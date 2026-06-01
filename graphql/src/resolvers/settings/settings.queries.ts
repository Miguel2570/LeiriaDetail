// graphql/src/resolvers/settings/settings.queries.ts
import { API } from '../../proxy/serviceproxy/api';

export const settingsQueries = {
    settings: async (_: any, __: any, context: any) => {
        try {
            // ✅ Usa a rota pública (sem autenticação)
            const data: any = await API.GET<any>(context, "/Settings/public");
            
            if (data.HasError) {
                return {
                    settings: null,
                    hasError: true,
                    error: { field: "settings", message: data.Error?.Message }
                };
            }
            
            return {
                settings: data.Settings,
                hasError: false,
                error: null
            };
        } catch (error: any) {
            return {
                settings: null,
                hasError: true,
                error: { field: "server", message: error.message }
            };
        }
    }
};