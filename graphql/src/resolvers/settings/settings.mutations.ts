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
                    ivaEnabled: s.iva_enabled === 'true' || s.iva_enabled === true,
                    ivaRate: parseInt(s.iva_rate) || 23,
                    requireNif: s.require_nif === 'true' || s.require_nif === true,
                    companyName: s.company_name || '',
                    companyAddress: s.company_address || ''
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