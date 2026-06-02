import { API } from '../../proxy/serviceproxy/api';

export const serviceQueries = {
    services: async (_: any, __: any, context: any) => {
        try {
            const data: any = await API.GET<any>(context, "/Services/");

            return {
                services: (data.Services || []).map(mapService),
                message: data.Message,
                hasError: data.HasError || false,
                error: data.Error || null
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

            return {
                services: (data.Services || []).map(mapService),
                message: data.Message,
                hasError: data.HasError || false,
                error: data.Error || null
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
            const data: any = await API.GET<any>(context, `/Services/pack/query?pack=${pack}`);

            return {
                services: (data.Services || []).map(mapService),
                message: data.Message,
                hasError: data.HasError || false,
                error: data.Error || null
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

function mapService(s: any) {
    return {
        id: s.id?.toString(),
        name: s.name,
        description: s.description,
        longDescription: s.long_description || null,
        priceAB: parseFloat(s.price_ab) || 0,
        priceC: parseFloat(s.price_c) || 0,
        priceDE: parseFloat(s.price_de) || 0,
        durationMinutes: s.duration_minutes,
        durationDetails: s.duration_details || null,
        packType: s.pack_type || 'Básico',
        icon: s.icon || null,
        includes: s.includes || [],
        processSteps: typeof s.process_steps === 'string' 
            ? JSON.parse(s.process_steps) 
            : (s.process_steps || []),
        loyaltyPoints: parseInt(s.loyalty_points) || 0 
    };
}