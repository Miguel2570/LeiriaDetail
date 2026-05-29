// api/src/Authentication/AuthenticationManager.ts
import { server } from '../Helpers/DatabaseConnectionHelper';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import AuditManager from '../Audit/AuditManager';
import logger from '../Helpers/Logger';
import { 
    LoginOutputModel, CreateUserOutputModel, ChangePasswordOutputModel,
    ResendVerificationOutputModel, ResetPasswordOutputModel,
    ValidateTokenOutputModel, CheckEmailOutputModel, ErrorModel 
} from "./AuthenticationModel";
import { sendVerificationEmail, sendPasswordResetEmail, sendWelcomeEmail } from '../Helpers/EmailService';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

class UserManager {
    
    private static generateUUID(): string { return crypto.randomUUID(); }

    static validatePasswordStrength(password: string): string | null {
        if (password.length < 8) return "A password deve ter pelo menos 8 caracteres.";
        if (!/[A-Z]/.test(password)) return "A password deve conter pelo menos uma letra maiúscula.";
        if (!/[a-z]/.test(password)) return "A password deve conter pelo menos uma letra minúscula.";
        if (!/[0-9]/.test(password)) return "A password deve conter pelo menos um número.";
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return "A password deve conter pelo menos um símbolo especial.";
        return null;
    }
    
    static async Register(email: string, password: string, firstName: string, lastName: string): Promise<CreateUserOutputModel> {
        const normalizedEmail = email.toLowerCase().trim();
        const passwordError = this.validatePasswordStrength(password);
        if (passwordError) return new CreateUserOutputModel(undefined, undefined, new ErrorModel("Password", passwordError));

        const checkQuery = 'SELECT id FROM users WHERE email = $1';
        const existing = await server.query(checkQuery, [normalizedEmail]);
        if (existing.rows.length > 0) return new CreateUserOutputModel(undefined, undefined, new ErrorModel("Email", "Email já registado."));
        
        const hash = await bcrypt.hash(password, await bcrypt.genSalt(10));
        await server.query('BEGIN');
        
        try {
            const insertQuery = `INSERT INTO users (first_name, last_name, email, password_hash, is_verified, role, provider) VALUES ($1, $2, $3, $4, false, 'customer', 'local') RETURNING id, first_name, last_name, email`;
            const result = await server.query(insertQuery, [firstName, lastName, normalizedEmail, hash]);
            const newUser = result.rows[0];
            await server.query('COMMIT');
            
            const verificationToken = this.generateUUID();
            const expirationDateTime = new Date();
            expirationDateTime.setHours(expirationDateTime.getHours() + 24);
            await server.query('INSERT INTO user_sessions (session_key, user_id, expirationdatetime) VALUES ($1::uuid, $2, $3)', [verificationToken, newUser.id, expirationDateTime]);
            await sendVerificationEmail(normalizedEmail, verificationToken, firstName);
            
            await AuditManager.createLog(newUser.id, 'REGISTER', normalizedEmail, { firstName, lastName });
            logger.info('Utilizador registado', { email: normalizedEmail, userId: newUser.id });
            return new CreateUserOutputModel("Conta criada com sucesso! Verifique o seu email.", true, undefined);
        } catch (error: any) {
            await server.query('ROLLBACK');
            logger.error('Erro no registo', { error: error.message, stack: error.stack });
            return new CreateUserOutputModel(undefined, false, new ErrorModel("Server", "Erro interno ao criar conta."));
        }
    }
    
    static async Login(email: string, password: string): Promise<LoginOutputModel> {
        const normalizedEmail = email.toLowerCase().trim();
        const query = `SELECT id, first_name, last_name, email, password_hash, is_verified, is_active, COALESCE(provider, 'local') as provider FROM users WHERE email = $1`;
        const result = await server.query(query, [normalizedEmail]);
        if (result.rows.length === 0) return new LoginOutputModel(undefined, undefined, new ErrorModel("Email", "Email não encontrado."));
        
        const user = result.rows[0];
        if (user.provider === 'google') return new LoginOutputModel(undefined, undefined, new ErrorModel("Email", "Esta conta usa login com Google."));
        if (user.provider === 'apple') return new LoginOutputModel(undefined, undefined, new ErrorModel("Email", "Esta conta usa login com Apple."));
        if (!user.is_active) return new LoginOutputModel(undefined, undefined, new ErrorModel("Account", "Conta desativada."));
        if (!user.is_verified) return new LoginOutputModel(undefined, undefined, new ErrorModel("Account", "Conta não verificada."));
        
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) return new LoginOutputModel(undefined, undefined, new ErrorModel("Password", "Password inválida."));
        
        const sessionKey = this.generateUUID();
        const expirationDateTime = new Date();
        expirationDateTime.setDate(expirationDateTime.getDate() + 1);
        await server.query('INSERT INTO user_sessions (session_key, user_id, expirationdatetime) VALUES ($1::uuid, $2, $3)', [sessionKey, user.id, expirationDateTime]);
        
        await AuditManager.createLog(user.id, 'LOGIN', normalizedEmail, {});
        logger.info('Login efetuado', { userId: user.id });
        return new LoginOutputModel(sessionKey, user.id, undefined);
    }
    
    static async VerifyAccount(token: string): Promise<any> {
        try {
            await server.query('BEGIN');
            const tokenQuery = `SELECT user_id FROM user_sessions WHERE session_key = $1 AND expirationdatetime > NOW()`;
            const tokenResult = await server.query(tokenQuery, [token]);
            if (tokenResult.rows.length === 0) {
                await server.query('ROLLBACK');
                return { HasError: true, Error: { Message: "Token inválido ou expirado." } };
            }
            const userId = tokenResult.rows[0].user_id;
            const userResult = await server.query(`UPDATE users SET is_verified = true, updated_at = NOW() WHERE id = $1 RETURNING first_name, email`, [userId]);
            await server.query('DELETE FROM user_sessions WHERE session_key = $1::uuid', [token]);
            await server.query('COMMIT');
            const user = userResult.rows[0];
            if (user) await sendWelcomeEmail(user.email, user.first_name || 'User');
            logger.info('Conta verificada', { userId });
            return { HasError: false };
        } catch (error: any) {
            await server.query('ROLLBACK');
            logger.error('Erro na verificação de conta', { error: error.message });
            return { HasError: true, Error: { Message: "Erro interno." } };
        }
    }
    
    static async ResendVerificationEmail(email: string): Promise<ResendVerificationOutputModel> {
        const normalizedEmail = email.toLowerCase().trim();
        const userResult = await server.query('SELECT id, first_name, last_name, is_verified FROM users WHERE email = $1', [normalizedEmail]);
        if (userResult.rows.length === 0) return new ResendVerificationOutputModel(undefined, new ErrorModel("Email", "Email não encontrado."));
        const user = userResult.rows[0];
        if (user.is_verified) return new ResendVerificationOutputModel(undefined, new ErrorModel("Account", "Conta já verificada."));
        
        const verificationToken = this.generateUUID();
        const expirationDateTime = new Date();
        expirationDateTime.setHours(expirationDateTime.getHours() + 24);
        await server.query('DELETE FROM user_sessions WHERE user_id = $1', [user.id]);
        await server.query('INSERT INTO user_sessions (session_key, user_id, expirationdatetime) VALUES ($1::uuid, $2, $3)', [verificationToken, user.id, expirationDateTime]);
        
        const emailResult = await sendVerificationEmail(normalizedEmail, verificationToken, user.first_name);
        if (!emailResult.success) return new ResendVerificationOutputModel(undefined, new ErrorModel("Email", emailResult.error || "Falha ao enviar email."));
        logger.info('Email de verificação reenviado', { email: normalizedEmail });
        return new ResendVerificationOutputModel("Email de verificação enviado.", undefined);
    }
    
    static async ResetPassword(email: string): Promise<ResetPasswordOutputModel> {
        const normalizedEmail = email.toLowerCase().trim();
        const userResult = await server.query('SELECT id, first_name, last_name FROM users WHERE email = $1', [normalizedEmail]);
        if (userResult.rows.length === 0) return new ResetPasswordOutputModel(new ErrorModel("Email", "Email não encontrado."));
        
        const user = userResult.rows[0];
        const resetToken = this.generateUUID();
        const expirationDateTime = new Date();
        expirationDateTime.setMinutes(expirationDateTime.getMinutes() + 15);
        await server.query('DELETE FROM user_sessions WHERE user_id = $1 AND expirationdatetime < NOW()', [user.id]);
        await server.query('INSERT INTO user_sessions (session_key, user_id, expirationdatetime) VALUES ($1::uuid, $2, $3)', [resetToken, user.id, expirationDateTime]);
        
        const emailResult = await sendPasswordResetEmail(normalizedEmail, resetToken, user.first_name);
        if (!emailResult.success) return new ResetPasswordOutputModel(new ErrorModel("Email", emailResult.error || "Falha ao enviar email."));
        logger.info('Reset de password solicitado', { email: normalizedEmail });
        return new ResetPasswordOutputModel(undefined);
    }
    
    static async ChangePassword(securityToken: string, newPassword: string): Promise<ChangePasswordOutputModel> {
        const tokenResult = await server.query(`SELECT user_id FROM user_sessions WHERE session_key = $1::uuid AND expirationdatetime > NOW()`, [securityToken]);
        if (tokenResult.rows.length === 0) return new ChangePasswordOutputModel(new ErrorModel("SecurityToken", "Token inválido ou expirado."));
        const userId = tokenResult.rows[0].user_id;
        if (newPassword.length < 6) return new ChangePasswordOutputModel(new ErrorModel("Password", "Password deve ter pelo menos 6 caracteres."));
        
        const hash = await bcrypt.hash(newPassword, await bcrypt.genSalt(10));
        await server.query('UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2', [hash, userId]);
        await server.query('DELETE FROM user_sessions WHERE session_key = $1::uuid', [securityToken]);
        await server.query('DELETE FROM user_sessions WHERE user_id = $1', [userId]);
        logger.info('Password alterada', { userId });
        return new ChangePasswordOutputModel(undefined);
    }
    
    static async ChangeAccountPassword(credencialKey: number, currentPassword: string, newPassword: string): Promise<ChangePasswordOutputModel> {
        if (!currentPassword || !newPassword) return new ChangePasswordOutputModel(new ErrorModel("Password", "Todos os campos são obrigatórios."));
        if (newPassword.length < 6) return new ChangePasswordOutputModel(new ErrorModel("Password", "Password deve ter pelo menos 6 caracteres."));
        
        const result = await server.query('SELECT id, password_hash FROM users WHERE id = $1', [credencialKey]);
        if (result.rows.length === 0) return new ChangePasswordOutputModel(new ErrorModel("User", "Utilizador não encontrado."));
        const user = result.rows[0];
        const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
        if (!isMatch) return new ChangePasswordOutputModel(new ErrorModel("CurrentPassword", "Password atual incorreta."));
        
        const hash = await bcrypt.hash(newPassword, await bcrypt.genSalt(10));
        await server.query('UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2', [hash, credencialKey]);
        logger.info('Password da conta alterada', { userId: credencialKey });
        return new ChangePasswordOutputModel(undefined);
    }
    
    static async ValidateToken(token: string): Promise<ValidateTokenOutputModel & { userId?: number }> {
        const result = await server.query(`SELECT user_id, expirationdatetime FROM user_sessions WHERE session_key = $1::uuid AND expirationdatetime > NOW()`, [token]);
        if (result.rows.length === 0) return new ValidateTokenOutputModel(false, "Token inválido ou expirado");
        return { isValid: true, userId: result.rows[0].user_id };
    }
    
    static async Logout(token: string): Promise<boolean> {
        const sessionQuery = 'SELECT user_id FROM user_sessions WHERE session_key = $1::uuid';
        const sessionResult = await server.query(sessionQuery, [token]);
        const userId = sessionResult.rows[0]?.user_id;
        if (userId) {
            const userResult = await server.query('SELECT email FROM users WHERE id = $1', [userId]);
            await AuditManager.createLog(userId, 'LOGOUT', userResult.rows[0]?.email, {});
        }
        await server.query('DELETE FROM user_sessions WHERE session_key = $1::uuid', [token]);
        logger.info('Logout efetuado', { userId });
        return true;
    }
    
    static async CheckEmail(email: string): Promise<CheckEmailOutputModel> {
        const normalizedEmail = email.toLowerCase().trim();
        if (!normalizedEmail) return new CheckEmailOutputModel(false, "Email não fornecido");
        const emailFormat = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailFormat.test(normalizedEmail)) return new CheckEmailOutputModel(false, "Formato de email inválido");
        const result = await server.query('SELECT id FROM users WHERE email = $1', [normalizedEmail]);
        return new CheckEmailOutputModel(result.rows.length > 0, result.rows.length > 0 ? "Email já registado" : "Email disponível");
    }
    
    static async VerifyPassword(credencialKey: number, password: string): Promise<{ success: boolean; error?: string }> {
        const result = await server.query('SELECT password_hash FROM users WHERE id = $1', [credencialKey]);
        if (result.rows.length === 0) return { success: false, error: 'Utilizador não encontrado' };
        const isValid = await bcrypt.compare(password, result.rows[0].password_hash);
        return isValid ? { success: true } : { success: false, error: 'Password inválida' };
    }
    
    static async GoogleLogin(googleToken: string): Promise<LoginOutputModel> {
        try {
            const ticket = await googleClient.verifyIdToken({ idToken: googleToken, audience: process.env.GOOGLE_CLIENT_ID });
            const payload = ticket.getPayload();
            if (!payload || !payload.email) return new LoginOutputModel(undefined, undefined, new ErrorModel("Google", "Token inválido."));

            const email = payload.email.toLowerCase();
            const firstName = payload.given_name || '';
            const lastName = payload.family_name || '';

            const query = "SELECT id, is_active, COALESCE(provider, 'local') as provider FROM users WHERE email = $1";
            const result = await server.query(query, [email]);
            let userId: number;

            if (result.rows.length === 0) {
                const insertResult = await server.query(
                    `INSERT INTO users (first_name, last_name, email, password_hash, is_verified, is_active, role, provider) VALUES ($1, $2, $3, 'GOOGLE_OAUTH', true, true, 'customer', 'google') RETURNING id`,
                    [firstName, lastName, email]
                );
                userId = insertResult.rows[0].id;
                logger.info('Novo utilizador via Google', { email, userId });
            } else {
                if (result.rows[0].provider === 'local') return new LoginOutputModel(undefined, undefined, new ErrorModel("Email", "Este email já está registado com password."));
                userId = result.rows[0].id;
            }

            const sessionKey = this.generateUUID();
            await server.query('INSERT INTO user_sessions (session_key, user_id, expirationdatetime) VALUES ($1::uuid, $2, NOW() + INTERVAL \'1 day\')', [sessionKey, userId]);
            await AuditManager.createLog(userId, 'LOGIN_GOOGLE', email, {});
            logger.info('Login Google efetuado', { userId });
            return new LoginOutputModel(sessionKey, userId, undefined);
        } catch (error: any) {
            logger.error('Erro no login Google', { error: error.message });
            return new LoginOutputModel(undefined, undefined, new ErrorModel("Server", "Erro no login com Google."));
        }
    }
    
    static async AppleLogin(appleToken: string, fullName?: { firstName?: string; lastName?: string }): Promise<LoginOutputModel> {
        try {
            const jwt = require('jsonwebtoken');
            const decoded = jwt.decode(appleToken) as any;
            if (!decoded || !decoded.email) return new LoginOutputModel(undefined, undefined, new ErrorModel("Apple", "Token inválido."));

            const email = decoded.email.toLowerCase();
            const firstName = fullName?.firstName || '';
            const lastName = fullName?.lastName || '';

            const query = 'SELECT id, is_active FROM users WHERE email = $1';
            const result = await server.query(query, [email]);
            let userId: number;

            if (result.rows.length === 0) {
                const insertResult = await server.query(
                    `INSERT INTO users (first_name, last_name, email, password_hash, is_verified, is_active, role, provider) VALUES ($1, $2, $3, 'APPLE_OAUTH', true, true, 'customer', 'apple') RETURNING id`,
                    [firstName, lastName, email]
                );
                userId = insertResult.rows[0].id;
                logger.info('Novo utilizador via Apple', { email, userId });
            } else {
                userId = result.rows[0].id;
            }

            const sessionKey = this.generateUUID();
            await server.query('INSERT INTO user_sessions (session_key, user_id, expirationdatetime) VALUES ($1::uuid, $2, NOW() + INTERVAL \'1 day\')', [sessionKey, userId]);
            await AuditManager.createLog(userId, 'LOGIN_APPLE', email, {});
            logger.info('Login Apple efetuado', { userId });
            return new LoginOutputModel(sessionKey, userId, undefined);
        } catch (error: any) {
            logger.error('Erro no login Apple', { error: error.message });
            return new LoginOutputModel(undefined, undefined, new ErrorModel("Server", "Erro no login com Apple."));
        }
    }
    
    static async GetUserRole(userId: number): Promise<string> {
        try {
            const result = await server.query('SELECT role FROM users WHERE id = $1', [userId]);
            return result.rows[0]?.role || 'customer';
        } catch (error) {
            return 'customer';
        }
    }
}

export default UserManager;