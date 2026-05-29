// src/resolvers/profile/profile.queries.ts
import { API } from '../../proxy/serviceproxy/api';

export const profileQueries = {
    profile: async (_: any, __: any, context: any) => {
        try {            
            const data: any = await API.GET<any>(context, "/Profile/");
            
            if (!data || data.HasError) {
                return {
                    profile: null,
                    message: data?.Error?.Message || "Erro",
                    hasError: true,
                    error: { field: data?.Error?.Field || "unknown", message: data?.Error?.Message || "Erro" }
                };
            }

            return {
                profile: data.Profile ? {
                    id: data.Profile.id,
                    firstName: data.Profile.firstName,
                    lastName: data.Profile.lastName,
                    email: data.Profile.email,
                    phone: data.Profile.phone || '',
                    // ✅ NOVOS CAMPOS
                    avatarFileId: data.Profile.avatar_file_id || null,
                    avatarData: data.Profile.avatar_data || null,
                    avatarExtension: data.Profile.avatar_extension || 'jpg',
                    isVerified: data.Profile.isVerified || false,
                    createdAt: data.Profile.createdAt || data.Profile.created_at || '',
                    updatedAt: data.Profile.updatedAt || data.Profile.updated_at || null,
                } : null,
                message: data.Message,
                hasError: false,
                error: null
            };
        } catch (error: any) {
            return {
                profile: null,
                message: error.message,
                hasError: true,
                error: { field: "server", message: error.message }
            };
        }
    }
};