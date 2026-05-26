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
                profile: profileData.Profile || null,
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