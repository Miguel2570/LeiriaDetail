// src/resolvers/profile/profile.mutations.ts
import { API } from '../../proxy/serviceproxy/api';

export const profileMutations = {
    updateProfile: async (_: any, { input }: any, context: any) => {
        try {
            const data: any = await API.PUT<any>(context, "/Profile/Update", input);
            return {
                firstName: data.firstName,
                lastName: data.lastName,
                phone: data.phone,
                message: data.Message,
                hasError: data.HasError || false,
                error: data.Error || null
            };
        } catch (error: any) {
            return {
                firstName: null, lastName: null, phone: null,
                message: null, hasError: true,
                error: { field: "server", message: error.message }
            };
        }
    },

    changeProfilePassword: async (_: any, { input }: any, context: any) => {
        try {
            const data: any = await API.PUT<any>(context, "/Profile/ChangePassword", input);
            return {
                message: data.Message,
                hasError: data.HasError || false,
                error: data.Error || null
            };
        } catch (error: any) {
            return {
                message: null, hasError: true,
                error: { field: "server", message: error.message }
            };
        }
    },

    // ✅ NOVA MUTATION - Upload de avatar
    updateProfileAvatar: async (_: any, { input }: any, context: any) => {
        try {
            const data: any = await API.PUT<any>(context, "/Profile/Avatar", {
                imageData: input.imageData,
                imageExtension: input.imageExtension,
                imageSize: input.imageSize
            });
            
            if (data.HasError) {
                return {
                    profile: null,
                    message: data.Error?.Message || "Erro ao atualizar avatar",
                    hasError: true,
                    error: { field: data.Error?.Field || "avatar", message: data.Error?.Message }
                };
            }
            
            return {
                profile: data.Profile ? {
                    id: data.Profile.id,
                    firstName: data.Profile.firstName || data.Profile.first_name,
                    lastName: data.Profile.lastName || data.Profile.last_name,
                    email: data.Profile.email,
                    phone: data.Profile.phone || '',
                    // ✅ Retorna os dados do novo avatar
                    avatarFileId: data.Profile.avatar_file_id || null,
                    avatarData: data.Profile.avatar_data || null,
                    avatarExtension: data.Profile.avatar_extension || input.imageExtension,
                    isVerified: data.Profile.isVerified || data.Profile.is_verified || false,
                    createdAt: data.Profile.createdAt || data.Profile.created_at || '',
                    updatedAt: data.Profile.updatedAt || data.Profile.updated_at || null,
                } : null,
                message: data.Message || "Avatar atualizado com sucesso!",
                hasError: false,
                error: null
            };
        } catch (error: any) {
            return {
                profile: null,
                message: null,
                hasError: true,
                error: { field: "server", message: error.message }
            };
        }
    },

    createStaffProfile: async (_: any, { input }: any, context: any) => {
        try {
            // 1. Registar o utilizador
            const registerData: any = await API.POST<any>(context, "/Authentication/Register", {
                email: input.email,
                password: input.password,
                firstName: input.firstName,
                lastName: input.lastName
            });

            if (registerData.HasError) {
                return {
                    profile: null,
                    message: registerData.Error?.Message,
                    hasError: true,
                    error: { field: registerData.Error?.Field, message: registerData.Error?.Message }
                };
            }

            // 2. Promover para staff
            const promoteData: any = await API.POST<any>(context, "/Staff/promote", {
                email: input.email,
                role: input.role || 'operator'
            });

            if (promoteData.HasError) {
                return {
                    profile: null,
                    message: promoteData.Error?.Message,
                    hasError: true,
                    error: { field: promoteData.Error?.Field, message: promoteData.Error?.Message }
                };
            }

            // 3. Retornar perfil criado
            const profileData: any = await API.GET<any>(context, "/Profile/");
            return {
                profile: profileData.Profile ? {
                    id: profileData.Profile.id,
                    firstName: profileData.Profile.firstName,
                    lastName: profileData.Profile.lastName,
                    email: profileData.Profile.email,
                    phone: profileData.Profile.phone || '',
                    avatarFileId: null,
                    avatarData: null,
                    avatarExtension: 'jpg',
                    isVerified: profileData.Profile.isVerified || false,
                    createdAt: profileData.Profile.createdAt || '',
                    updatedAt: profileData.Profile.updatedAt || null,
                } : null,
                message: "Staff criado com sucesso!",
                hasError: false,
                error: null
            };
        } catch (error: any) {
            return {
                profile: null, message: null, hasError: true,
                error: { field: "server", message: error.message }
            };
        }
    }
};