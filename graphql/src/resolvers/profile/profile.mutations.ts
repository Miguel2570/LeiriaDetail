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
                firstName: null,
                lastName: null,
                phone: null,
                message: null,
                hasError: true,
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
                message: null,
                hasError: true,
                error: { field: "server", message: error.message }
            };
        }
    }
};