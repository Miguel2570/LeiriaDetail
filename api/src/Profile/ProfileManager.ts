// api/src/Profile/ProfileManager.ts
import { server } from '../Helpers/DatabaseConnectionHelper';
import bcrypt from 'bcrypt';
import { ProfileOutputModel, UpdateProfileOutputModel, UpdatePasswordOutputModel, ErrorModel } from './ProfileModel';
import FileManager from '../File/FileManager';

class ProfileManager {

    static async GetProfile(sessionKey: string): Promise<ProfileOutputModel> {
        try {
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

            const userQuery = `
                SELECT id, first_name, last_name, email, phone, is_verified, 
                       created_at, updated_at, avatar_file_id
                FROM users WHERE id = $1
            `;
            const userResult = await server.query(userQuery, [userId]);

            if (userResult.rows.length === 0) {
                return new ProfileOutputModel(undefined, undefined,
                    new ErrorModel("User", "Utilizador não encontrado."));
            }

            const user = userResult.rows[0];
            let avatarData: string | null = null;
            let avatarExtension: string | null = null;

            // ✅ Carregar avatar do sistema File
            if (user.avatar_file_id) {
                const fileResult = await FileManager.GetFileById(user.avatar_file_id);
                if (fileResult.File) {
                    avatarData = fileResult.File.FileData;
                    avatarExtension = fileResult.File.FileExtension;
                }
            }

            return new ProfileOutputModel({
                ...user,
                avatar_data: avatarData,
                avatar_extension: avatarExtension
            }, "Perfil encontrado com sucesso.");

        } catch (error: any) {
            console.error('GetProfile error:', error);
            return new ProfileOutputModel(undefined, undefined,
                new ErrorModel("Server", error?.message ?? "Erro interno."));
        }
    }

    static async UpdateProfile(
        sessionKey: string, 
        firstName: string, 
        lastName: string, 
        phone: string
    ): Promise<UpdateProfileOutputModel> {
        try {
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

    static async ChangePassword(
        sessionKey: string,
        currentPassword: string,
        newPassword: string
    ): Promise<UpdatePasswordOutputModel> {
        try {
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

            const userQuery = 'SELECT password_hash FROM users WHERE id = $1';
            const userResult = await server.query(userQuery, [userId]);

            const isMatch = await bcrypt.compare(currentPassword, userResult.rows[0].password_hash);
            if (!isMatch) {
                return new UpdatePasswordOutputModel(undefined,
                    new ErrorModel("CurrentPassword", "Password atual incorreta."));
            }

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

    /**
     * ✅ Atualizar avatar usando sistema File (sem perda de qualidade)
     */
    static async UpdateAvatar(
        sessionKey: string, 
        imageData: string,
        imageExtension: string,
        imageSize: number
    ): Promise<ProfileOutputModel> {
        try {
            const tokenQuery = `
                SELECT user_id FROM user_sessions 
                WHERE session_key = $1 AND expirationdatetime > NOW()
            `;
            const tokenResult = await server.query(tokenQuery, [sessionKey]);
            
            if (tokenResult.rows.length === 0) {
                return new ProfileOutputModel(undefined, undefined, 
                    new ErrorModel("Session", "Sessão inválida."));
            }
            
            const userId = tokenResult.rows[0].user_id;
            
            // Buscar avatar antigo para apagar
            const oldUser = await server.query(
                'SELECT avatar_file_id FROM users WHERE id = $1', [userId]
            );
            const oldFileId = oldUser.rows[0]?.avatar_file_id;
            
            // ✅ Criar novo ficheiro (qualidade original)
            const fileResult = await FileManager.CreateFile(
                imageData,
                `avatar_${userId}_${Date.now()}`,
                imageSize,
                imageExtension,
                userId.toString(),
                'user_avatar',
                userId,
                ['avatar', 'profile']
            );
            
            if (!fileResult.File) {
                return new ProfileOutputModel(undefined, undefined,
                    new ErrorModel("File", "Erro ao guardar avatar."));
            }
            
            // Atualizar referência no utilizador
            await server.query(
                'UPDATE users SET avatar_file_id = $1, updated_at = NOW() WHERE id = $2',
                [fileResult.File.Id, userId]
            );
            
            // Apagar avatar antigo
            if (oldFileId) {
                await FileManager.DeleteFile(oldFileId, userId.toString());
            }
            
            return new ProfileOutputModel({
                id: userId,
                avatar_data: fileResult.File.FileData,
                avatar_extension: fileResult.File.FileExtension
            }, "Avatar atualizado.");
            
        } catch (error: any) {
            console.error('UpdateAvatar error:', error);
            return new ProfileOutputModel(undefined, undefined,
                new ErrorModel("Server", error?.message ?? "Erro interno."));
        }
    }
}

export default ProfileManager;