// graphql/src/resolvers/settings/settings.mutations.ts
import { API } from '../../proxy/serviceproxy/api';

export const settingsMutations = {
    updateSettings: async (_: any, { input }: any, context: any) => {
        try {
            const data: any = await API.PUT<any>(context, "/Settings/", input);
            
            if (data.HasError) {
                return {
                    settings: null,
                    message: data.Error?.Message,
                    hasError: true,
                    error: { field: "settings", message: data.Error?.Message }
                };
            }
            
            const s = data.Settings || {};
            return {
                settings: {
                    companyName: s.company_name || s.companyName || '',
                    companyAddress: s.company_address || s.companyAddress || ''
                },
                message: data.Message || "Configurações atualizadas.",
                hasError: false,
                error: null
            };
        } catch (error: any) {
            return {
                settings: null,
                message: null,
                hasError: true,
                error: { field: "server", message: error.message }
            };
        }
    }
};