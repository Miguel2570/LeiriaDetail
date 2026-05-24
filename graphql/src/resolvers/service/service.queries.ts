import { API } from '../../proxy/serviceproxy/api';

export const servicesQueries = {
    services: async (_: any, __: any, context: any) => {
        try {
            const data: any = await API.GET<any>(context, "/Services/");

            if (data.HasError) {
                return {
                    services: [],
                    message: null,
                    hasError: true,
                    error: { field: data.Error?.Field, message: data.Error?.Message }
                };
            }

            return {
                services: (data.Services || []).map((s: any) => ({
                    id: s.id?.toString(),
                    name: s.name,
                    description: s.description,
                    priceAB: parseFloat(s.price_ab),
                    priceC: parseFloat(s.price_c),
                    priceDE: parseFloat(s.price_de),
                    durationMinutes: s.duration_minutes,
                    packType: s.pack_type || 'Básico'
                })),
                message: data.Message,
                hasError: false,
                error: null
            };
        } catch (error: any) {
            return {
                services: [],
                message: null,
                hasError: true,
                error: { field: "server", message: error.message }
            };
        }
    },

    service: async (_: any, { id }: { id: string }, context: any) => {
        try {
            const data: any = await API.GET<any>(context, `/Services/${id}`);

            if (data.HasError) {
                return {
                    services: [],
                    message: null,
                    hasError: true,
                    error: { field: data.Error?.Field, message: data.Error?.Message }
                };
            }

            return {
                services: (data.Services || []).map((s: any) => ({
                    id: s.id?.toString(),
                    name: s.name,
                    description: s.description,
                    priceAB: parseFloat(s.price_ab),
                    priceC: parseFloat(s.price_c),
                    priceDE: parseFloat(s.price_de),
                    durationMinutes: s.duration_minutes,
                    packType: s.pack_type || 'Básico'
                })),
                message: data.Message,
                hasError: false,
                error: null
            };
        } catch (error: any) {
            return {
                services: [],
                message: null,
                hasError: true,
                error: { field: "server", message: error.message }
            };
        }
    },

    servicesByPack: async (_: any, { pack }: { pack: string }, context: any) => {
        try {
            const data: any = await API.GET<any>(context, `/Services?pack=${pack}`);

            if (data.HasError) {
                return {
                    services: [],
                    message: null,
                    hasError: true,
                    error: { field: data.Error?.Field, message: data.Error?.Message }
                };
            }

            return {
                services: (data.Services || []).map((s: any) => ({
                    id: s.id?.toString(),
                    name: s.name,
                    description: s.description,
                    priceAB: parseFloat(s.price_ab),
                    priceC: parseFloat(s.price_c),
                    priceDE: parseFloat(s.price_de),
                    durationMinutes: s.duration_minutes,
                    packType: s.pack_type || pack || 'Básico'
                })),
                message: data.Message,
                hasError: false,
                error: null
            };
        } catch (error: any) {
            return {
                services: [],
                message: null,
                hasError: true,
                error: { field: "server", message: error.message }
            };
        }
    }
};