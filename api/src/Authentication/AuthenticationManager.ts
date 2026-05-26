import { server } from '../Helpers/DatabaseConnectionHelper';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import { 
    LoginOutputModel, 
    CreateUserOutputModel, 
    ChangePasswordOutputModel,
    ResendVerificationOutputModel,
    ResetPasswordOutputModel,
    ValidateTokenOutputModel,
    CheckEmailOutputModel,
    ErrorModel 
} from "./AuthenticationModel";
import { sendVerificationEmail, sendPasswordResetEmail, sendWelcomeEmail } from '../Helpers/EmailService';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

class UserManager {
    
    private static generateUUID(): string {
        return crypto.randomUUID();
    }
    
    static async Register(email: string, password: string, firstName: string, lastName: string): Promise<CreateUserOutputModel> {
        const normalizedEmail = email.toLowerCase().trim();
        
        const checkQuery = 'SELECT id FROM users WHERE email = $1';
        const existing = await server.query(checkQuery, [normalizedEmail]);
        
        if (existing.rows.length > 0) {
            return new CreateUserOutputModel(undefined, undefined, new ErrorModel("Email", "Email already registered."));
        }
        
        const hash = await bcrypt.hash(password, await bcrypt.genSalt(10));
        
        await server.query('BEGIN');
        
        try {
            const insertQuery = `
                INSERT INTO users (first_name, last_name, email, password_hash, is_verified, role)
                VALUES ($1, $2, $3, $4, true, 'customer')
                RETURNING id, first_name, last_name, email
            `;
            
            const result = await server.query(insertQuery, [firstName, lastName, normalizedEmail, hash]);
            const newUser = result.rows[0];
            
            await server.query('COMMIT');
            
            // Pular envio de email
            // const emailResult = await sendVerificationEmail(normalizedEmail, verificationToken, firstName);
            
            return new CreateUserOutputModel("Conta criada com sucesso!", true, undefined);
            
        } catch (error) {
            await server.query('ROLLBACK');
            console.error('Register error:', error);
            return new CreateUserOutputModel(undefined, false, new ErrorModel("Server", "Internal server error while creating account."));
        }
    }
    
    static async Login(email: string, password: string): Promise<LoginOutputModel> {
        const normalizedEmail = email.toLowerCase().trim();
        
        const query = `
            SELECT id, first_name, last_name, email, password_hash, is_verified, is_active
            FROM users 
            WHERE email = $1
        `;
        
        const result = await server.query(query, [normalizedEmail]);
        
        if (result.rows.length === 0) {
            return new LoginOutputModel(undefined, undefined, new ErrorModel("Email", "Email not found."));
        }
        
        const user = result.rows[0];
        
        if (!user.is_active) {
            return new LoginOutputModel(undefined, undefined, new ErrorModel("Account", "Account not activated."));
        }
        
        if (!user.is_verified) {
            return new LoginOutputModel(undefined, undefined, new ErrorModel("Account", "Account not verified. Please check your email."));
        }
        
        const isMatch = await bcrypt.compare(password, user.password_hash);
        
        if (!isMatch) {
            return new LoginOutputModel(undefined, undefined, new ErrorModel("Password", "Invalid password."));
        }
        
        const sessionKey = this.generateUUID();
            const expirationDateTime = new Date();
            expirationDateTime.setDate(expirationDateTime.getDate() + 1);
            
            const insertSession = `
                INSERT INTO user_sessions (session_key, user_id, expirationdatetime)
                VALUES ($1::uuid, $2, $3)
            `;
            await server.query(insertSession, [sessionKey, user.id, expirationDateTime]);
            
            console.log('✅ Sessão criada:', sessionKey);
            
            return new LoginOutputModel(sessionKey, user.id, undefined);
    }
    
    static async VerifyAccount(token: string): Promise<any> {
        try {
            await server.query('BEGIN');
            
            const tokenQuery = `
                SELECT user_id
                FROM user_sessions
                WHERE session_key = $1 AND expirationdatetime > NOW()
            `;
            const tokenResult = await server.query(tokenQuery, [token]);
            
            if (tokenResult.rows.length === 0) {
                await server.query('ROLLBACK');
                return {
                    HasError: true,
                    Error: { Message: "Invalid or expired token." }
                };
            }
            
            const userId = tokenResult.rows[0].user_id;
            
            const updateUser = `
                UPDATE users 
                SET is_verified = true, updated_at = NOW()
                WHERE id = $1
                RETURNING first_name, email
            `;
            const userResult = await server.query(updateUser, [userId]);
            
            await server.query('DELETE FROM user_sessions WHERE session_key = $1', [token]);
            
            await server.query('COMMIT');
            
            const user = userResult.rows[0];
            if (user) {
                await sendWelcomeEmail(user.email, user.first_name || 'User');
            }
            
            return { HasError: false };
        } catch (error) {
            await server.query('ROLLBACK');
            console.error('VerifyAccount error:', error);
            return {
                HasError: true,
                Error: { Message: "Internal server error." }
            };
        }
    }
    
    static async ResendVerificationEmail(email: string): Promise<ResendVerificationOutputModel> {
        const normalizedEmail = email.toLowerCase().trim();
        
        const userQuery = 'SELECT id, first_name, last_name, is_verified FROM users WHERE email = $1';
        const userResult = await server.query(userQuery, [normalizedEmail]);
        
        if (userResult.rows.length === 0) {
            return new ResendVerificationOutputModel(undefined, new ErrorModel("Email", "Email not found."));
        }
        
        const user = userResult.rows[0];
        
        if (user.is_verified) {
            return new ResendVerificationOutputModel(undefined, new ErrorModel("Account", "This account is already verified."));
        }
        
        const verificationToken = this.generateUUID();
        const expirationDateTime = new Date();
        expirationDateTime.setHours(expirationDateTime.getHours() + 24);
        
        await server.query('DELETE FROM user_sessions WHERE user_id = $1', [user.id]);
        
        const insertTokenQuery = `
            INSERT INTO user_sessions (session_key, user_id, expirationdatetime)
            VALUES ($1, $2, $3)
        `;
        await server.query(insertTokenQuery, [verificationToken, user.id, expirationDateTime]);
        
        const emailResult = await sendVerificationEmail(normalizedEmail, verificationToken, user.first_name);
        
        if (!emailResult.success) {
            return new ResendVerificationOutputModel(undefined, new ErrorModel("Email", emailResult.error || "Failed to send verification email."));
        }
        
        return new ResendVerificationOutputModel("Verification email sent successfully.", undefined);
    }
    
    static async ResetPassword(email: string): Promise<ResetPasswordOutputModel> {
        const normalizedEmail = email.toLowerCase().trim();
        
        const userQuery = 'SELECT id, first_name, last_name FROM users WHERE email = $1';
        const userResult = await server.query(userQuery, [normalizedEmail]);
        
        if (userResult.rows.length === 0) {
            return new ResetPasswordOutputModel(new ErrorModel("Email", "Email not found."));
        }
        
        const user = userResult.rows[0];
        
        const resetToken = this.generateUUID();
        const expirationDateTime = new Date();
        expirationDateTime.setMinutes(expirationDateTime.getMinutes() + 15);
        
        await server.query('DELETE FROM user_sessions WHERE user_id = $1 AND expirationdatetime < NOW()', [user.id]);
        
        const insertToken = `
            INSERT INTO user_sessions (session_key, user_id, expirationdatetime)
            VALUES ($1, $2, $3)
        `;
        await server.query(insertToken, [resetToken, user.id, expirationDateTime]);
        
        const emailResult = await sendPasswordResetEmail(normalizedEmail, resetToken, user.first_name);
        
        if (!emailResult.success) {
            return new ResetPasswordOutputModel(new ErrorModel("Email", emailResult.error || "Failed to send reset email."));
        }
        
        return new ResetPasswordOutputModel(undefined);
    }
    
    static async ChangePassword(securityToken: string, newPassword: string): Promise<ChangePasswordOutputModel> {
        const tokenQuery = `
            SELECT user_id
            FROM user_sessions
            WHERE session_key = $1 AND expirationdatetime > NOW()
        `;
        const tokenResult = await server.query(tokenQuery, [securityToken]);
        
        if (tokenResult.rows.length === 0) {
            return new ChangePasswordOutputModel(new ErrorModel("SecurityToken", "Invalid or expired token."));
        }
        
        const userId = tokenResult.rows[0].user_id;
        
        if (newPassword.length < 6) {
            return new ChangePasswordOutputModel(new ErrorModel("Password", "Password must be at least 6 characters long."));
        }
        
        const hash = await bcrypt.hash(newPassword, await bcrypt.genSalt(10));
        
        await server.query('UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2', [hash, userId]);
        
        await server.query('DELETE FROM user_sessions WHERE session_key = $1', [securityToken]);
        
        await server.query('DELETE FROM user_sessions WHERE user_id = $1', [userId]);
        
        return new ChangePasswordOutputModel(undefined);
    }
    
    static async ChangeAccountPassword(credencialKey: number, currentPassword: string, newPassword: string): Promise<ChangePasswordOutputModel> {
        if (!currentPassword || !newPassword) {
            return new ChangePasswordOutputModel(new ErrorModel("Password", "All fields are required."));
        }
        
        if (newPassword.length < 6) {
            return new ChangePasswordOutputModel(new ErrorModel("Password", "Password must be at least 6 characters long."));
        }
        
        const query = 'SELECT id, password_hash FROM users WHERE id = $1';
        const result = await server.query(query, [credencialKey]);
        
        if (result.rows.length === 0) {
            return new ChangePasswordOutputModel(new ErrorModel("User", "User not found."));
        }
        
        const user = result.rows[0];
        
        const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
        
        if (!isMatch) {
            return new ChangePasswordOutputModel(new ErrorModel("CurrentPassword", "The current password is incorrect."));
        }
        
        const hash = await bcrypt.hash(newPassword, await bcrypt.genSalt(10));
        
        await server.query('UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2', [hash, credencialKey]);
        
        return new ChangePasswordOutputModel(undefined);
    }
    
    static async ValidateToken(token: string): Promise<ValidateTokenOutputModel & { userId?: number }> {
        const query = `
            SELECT user_id, expirationdatetime
            FROM user_sessions
            WHERE session_key = $1 AND expirationdatetime > NOW()
        `;
        
        const result = await server.query(query, [token]);
        
        if (result.rows.length === 0) {
            return new ValidateTokenOutputModel(false, "Invalid or expired token");
        }
        
        return {
            isValid: true,
            userId: result.rows[0].user_id
        };
    }
    
    static async Logout(token: string): Promise<boolean> {
        await server.query('DELETE FROM user_sessions WHERE session_key = $1', [token]);
        return true;
    }
    
    static async CheckEmail(email: string): Promise<CheckEmailOutputModel> {
        const normalizedEmail = email.toLowerCase().trim();
        
        if (!normalizedEmail) {
            return new CheckEmailOutputModel(false, "Email not provided");
        }
        
        const emailFormat = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailFormat.test(normalizedEmail)) {
            return new CheckEmailOutputModel(false, "Invalid email format");
        }
        
        const query = 'SELECT id FROM users WHERE email = $1';
        const result = await server.query(query, [normalizedEmail]);
        
        return new CheckEmailOutputModel(
            result.rows.length > 0,
            result.rows.length > 0 ? "Email already registered" : "Email available"
        );
    }
    
    static async VerifyPassword(credencialKey: number, password: string): Promise<{ success: boolean; error?: string }> {
        const query = 'SELECT password_hash FROM users WHERE id = $1';
        const result = await server.query(query, [credencialKey]);
        
        if (result.rows.length === 0) {
            return { success: false, error: 'User not found' };
        }
        
        const isValid = await bcrypt.compare(password, result.rows[0].password_hash);
        
        if (isValid) {
            return { success: true };
        } else {
            return { success: false, error: 'Invalid password' };
        }
    }
    /**
     * Login com Google
     */
    static async GoogleLogin(googleToken: string): Promise<LoginOutputModel> {
        try {
            // Verificar token com a Google
            const ticket = await googleClient.verifyIdToken({
                idToken: googleToken,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
            
            const payload = ticket.getPayload();
            if (!payload || !payload.email) {
                return new LoginOutputModel(undefined, undefined, 
                    new ErrorModel("Google", "Token inválido."));
            }

            const email = payload.email.toLowerCase();
            const firstName = payload.given_name || '';
            const lastName = payload.family_name || '';

            // Verificar se utilizador já existe
            const query = 'SELECT id, is_active FROM users WHERE email = $1';
            const result = await server.query(query, [email]);

            let userId: number;

            if (result.rows.length === 0) {
                const insertQuery = `
                    INSERT INTO users (first_name, last_name, email, password_hash, is_verified, is_active, role)
                    VALUES ($1, $2, $3, $4, true, true, 'customer')
                    RETURNING id
                `;
                const insertResult = await server.query(insertQuery, [
                    firstName, lastName, email, 'GOOGLE_OAUTH'
                ]);
                userId = insertResult.rows[0].id;
            } else {
                userId = result.rows[0].id;
            }

            // Criar sessão
            const sessionKey = this.generateUUID();
            const expirationDateTime = new Date();
            expirationDateTime.setDate(expirationDateTime.getDate() + 1);

            const insertSession = `
                INSERT INTO user_sessions (session_key, user_id, expirationdatetime)
                VALUES ($1, $2, $3)
            `;
            await server.query(insertSession, [sessionKey, userId, expirationDateTime]);

            return new LoginOutputModel(sessionKey, userId, undefined);

        } catch (error: any) {
            console.error('GoogleLogin error:', error);
            return new LoginOutputModel(undefined, undefined,
                new ErrorModel("Server", "Erro no login com Google."));
        }
    }
    /**
     * Login com Apple
     */
    static async AppleLogin(appleToken: string, fullName?: { firstName?: string; lastName?: string }): Promise<LoginOutputModel> {
        try {
            // Nota: Apple requer verificação JWT com a chave pública da Apple
            // Simplificado para demonstração
            const jwt = require('jsonwebtoken');
            const decoded = jwt.decode(appleToken) as any;
            
            if (!decoded || !decoded.email) {
                return new LoginOutputModel(undefined, undefined,
                    new ErrorModel("Apple", "Token inválido."));
            }

            const email = decoded.email.toLowerCase();
            const firstName = fullName?.firstName || '';
            const lastName = fullName?.lastName || '';

            // Verificar se utilizador já existe
            const query = 'SELECT id, is_active FROM users WHERE email = $1';
            const result = await server.query(query, [email]);

            let userId: number;

            if (result.rows.length === 0) {
                const insertQuery = `
                    INSERT INTO users (first_name, last_name, email, password_hash, is_verified, is_active, role)
                    VALUES ($1, $2, $3, $4, true, true, 'customer')
                    RETURNING id
                `;
                const insertResult = await server.query(insertQuery, [
                    firstName, lastName, email, 'APPLE_OAUTH'
                ]);
                userId = insertResult.rows[0].id;
            } else {
                userId = result.rows[0].id;
            }

            const sessionKey = this.generateUUID();
            const expirationDateTime = new Date();
            expirationDateTime.setDate(expirationDateTime.getDate() + 1);

            const insertSession = `
                INSERT INTO user_sessions (session_key, user_id, expirationdatetime)
                VALUES ($1, $2, $3)
            `;
            await server.query(insertSession, [sessionKey, userId, expirationDateTime]);

            return new LoginOutputModel(sessionKey, userId, undefined);

        } catch (error: any) {
            console.error('AppleLogin error:', error);
            return new LoginOutputModel(undefined, undefined,
                new ErrorModel("Server", "Erro no login com Apple."));
        }
    }
    static async GetUserRole(userId: number): Promise<string> {
        try {
            const query = 'SELECT role FROM users WHERE id = $1';
            const result = await server.query(query, [userId]);
            
            if (result.rows.length === 0) {
                return 'customer';
            }
            
            return result.rows[0].role || 'customer';
        } catch (error) {
            return 'customer';
        }
    }
}

export default UserManager; 