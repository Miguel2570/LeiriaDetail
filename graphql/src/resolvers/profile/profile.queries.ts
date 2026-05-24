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
                profile: data.Profile,
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