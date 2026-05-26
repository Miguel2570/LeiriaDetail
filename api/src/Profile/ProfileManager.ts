// api/src/Profile/ProfileManager.ts

import { server } from '../Helpers/DatabaseConnectionHelper';
import bcrypt from 'bcrypt';
import { ProfileOutputModel, UpdateProfileOutputModel, UpdatePasswordOutputModel, ErrorModel } from './ProfileModel';

class ProfileManager {

    /**
     * Obter perfil do utilizador pela SessionKey
     */
    static async GetProfile(sessionKey: string): Promise<ProfileOutputModel> {
        try {
            // Validar token
            const tokenQuery = `
                SELECT user_id FROM user_sessions 
                WHERE session_key = $1 AND expirationdatetime > NOW()
            `;
            const tokenResult = await server.query(tokenQuery, [sessionKey]);

            if (tokenResult.rows.length === 0) {
                return new ProfileOutputModel(undefined, undefined, 
                    new ErrorModel("Session", "Sessão inválida ou expirada."));
            }

            const userId = tokenResult.rows[0].user_id;

            // Buscar dados do utilizador
            const userQuery = `
                SELECT id, first_name, last_name, email, phone, is_verified, created_at, updated_at
                FROM users WHERE id = $1
            `;
            const userResult = await server.query(userQuery, [userId]);

            if (userResult.rows.length === 0) {
                return new ProfileOutputModel(undefined, undefined,
                    new ErrorModel("User", "Utilizador não encontrado."));
            }

            return new ProfileOutputModel(userResult.rows[0], "Perfil encontrado com sucesso.");

        } catch (error: any) {
            console.error('GetProfile error:', error);
            return new ProfileOutputModel(undefined, undefined,
                new ErrorModel("Server", error?.message ?? "Erro interno."));
        }
    }

    /**
     * Atualizar dados do perfil (nome, apelido, telefone)
     */
    static async UpdateProfile(
        sessionKey: string, 
        firstName: string, 
        lastName: string, 
        phone: string
    ): Promise<UpdateProfileOutputModel> {
        try {
            // Validar token
            const tokenQuery = `
                SELECT user_id FROM user_sessions 
                WHERE session_key = $1 AND expirationdatetime > NOW()
            `;
            const tokenResult = await server.query(tokenQuery, [sessionKey]);

            if (tokenResult.rows.length === 0) {
                return new UpdateProfileOutputModel(undefined, undefined, undefined, undefined,
                    new ErrorModel("Session", "Sessão inválida ou expirada."));
            }

            const userId = tokenResult.rows[0].user_id;

            if (!firstName && !lastName && !phone) {
                return new UpdateProfileOutputModel(undefined, undefined, undefined, undefined,
                    new ErrorModel("Fields", "Nenhum campo para atualizar."));
            }

            // Atualizar
            const updateQuery = `
                UPDATE users 
                SET first_name = COALESCE($1, first_name),
                    last_name = COALESCE($2, last_name),
                    phone = COALESCE($3, phone),
                    updated_at = NOW()
                WHERE id = $4
                RETURNING first_name, last_name, phone
            `;
            const result = await server.query(updateQuery, [
                firstName || null,
                lastName || null,
                phone || null,
                userId
            ]);

            return new UpdateProfileOutputModel(
                result.rows[0].first_name,
                result.rows[0].last_name,
                result.rows[0].phone,
                "Perfil atualizado com sucesso!"
            );

        } catch (error: any) {
            console.error('UpdateProfile error:', error);
            return new UpdateProfileOutputModel(undefined, undefined, undefined, undefined,
                new ErrorModel("Server", error?.message ?? "Erro interno."));
        }
    }

    /**
     * Alterar password
     */
    static async ChangePassword(
        sessionKey: string,
        currentPassword: string,
        newPassword: string
    ): Promise<UpdatePasswordOutputModel> {
        try {
            // Validar token
            const tokenQuery = `
                SELECT user_id FROM user_sessions 
                WHERE session_key = $1 AND expirationdatetime > NOW()
            `;
            const tokenResult = await server.query(tokenQuery, [sessionKey]);

            if (tokenResult.rows.length === 0) {
                return new UpdatePasswordOutputModel(undefined,
                    new ErrorModel("Session", "Sessão inválida ou expirada."));
            }

            const userId = tokenResult.rows[0].user_id;

            if (!currentPassword || !newPassword) {
                return new UpdatePasswordOutputModel(undefined,
                    new ErrorModel("Password", "Todos os campos são obrigatórios."));
            }

            if (newPassword.length < 6) {
                return new UpdatePasswordOutputModel(undefined,
                    new ErrorModel("Password", "A nova password deve ter pelo menos 6 caracteres."));
            }

            // Buscar password atual
            const userQuery = 'SELECT password_hash FROM users WHERE id = $1';
            const userResult = await server.query(userQuery, [userId]);

            // Verificar password atual
            const isMatch = await bcrypt.compare(currentPassword, userResult.rows[0].password_hash);
            if (!isMatch) {
                return new UpdatePasswordOutputModel(undefined,
                    new ErrorModel("CurrentPassword", "Password atual incorreta."));
            }

            // Atualizar password
            const hash = await bcrypt.hash(newPassword, 10);
            await server.query(
                'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
                [hash, userId]
            );

            return new UpdatePasswordOutputModel("Password alterada com sucesso!");

        } catch (error: any) {
            console.error('ChangePassword error:', error);
            return new UpdatePasswordOutputModel(undefined,
                new ErrorModel("Server", error?.message ?? "Erro interno."));
        }
    }
    static async UpdateAvatar(sessionKey: string, avatarUrl: string): Promise<ProfileOutputModel> {
        const tokenQuery = `
            SELECT user_id FROM user_sessions 
            WHERE session_key = $1 AND expirationdatetime > NOW()
        `;
        const tokenResult = await server.query(tokenQuery, [sessionKey]);
        
        if (tokenResult.rows.length === 0) {
            return new ProfileOutputModel(undefined, undefined, new ErrorModel("Session", "Sessão inválida."));
        }
        
        const userId = tokenResult.rows[0].user_id;
        
        await server.query(
            'UPDATE users SET avatar_url = $1, updated_at = NOW() WHERE id = $2',
            [avatarUrl, userId]
        );
        
        return new ProfileOutputModel({ ...tokenResult.rows[0], avatar_url: avatarUrl }, "Avatar atualizado.");
    }
}

export default ProfileManager;