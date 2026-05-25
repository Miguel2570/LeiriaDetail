import { API } from '../../proxy/serviceproxy/api';

export const materialsMutations = {
    addMaterial: async (_: any, { input }: any, context: any) => {
        try {
            const data = await API.POST<any>(context, "/Materials/Add", input);
            return {
                material: data.Materials?.[0] || null,
                message: data.Message,
                hasError: data.HasError || false,
                error: data.Error || null
            };
        } catch (error: any) {
            return { material: null, hasError: true, error: { field: "server", message: error.message } };
        }
    },
    deleteMaterial: async (_: any, { id }: any, context: any) => {
        try {
            const data = await API.DELETE<any>(context, `/Materials/${id}`);
            return { message: data.Message, hasError: data.HasError || false, error: data.Error || null };
        } catch (error: any) {
            return { hasError: true, error: { field: "server", message: error.message } };
        }
    }
};