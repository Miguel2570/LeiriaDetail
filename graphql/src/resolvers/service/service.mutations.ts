import { API } from '../../proxy/serviceproxy/api';

export const serviceMutations = {
    createService: async (_: any, { input }: any, context: any) => {
        try {
            const data: any = await API.POST<any>(context, "/Services/", {
                name: input.name,
                description: input.description,
                priceAB: input.priceAB,
                priceC: input.priceC,
                priceDE: input.priceDE,
                durationMinutes: input.durationMinutes,
                packType: input.packType,
                loyaltyPoints: input.loyaltyPoints
            });

            return {
                services: data.Services?.map(mapService) || [],
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

    updateService: async (_: any, { id, input }: any, context: any) => {
        try {
            const data: any = await API.PUT<any>(context, `/Services/${id}`, {
                name: input.name,
                description: input.description,
                priceAB: input.priceAB,
                priceC: input.priceC,
                priceDE: input.priceDE,
                durationMinutes: input.durationMinutes,
                packType: input.packType,
                loyaltyPoints: input.loyaltyPoints
            });

            return {
                services: data.Services?.map(mapService) || [],
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

    deleteService: async (_: any, { id }: any, context: any) => {
        try {
            const data: any = await API.DELETE<any>(context, `/Services/${id}`);

            return {
                services: [],
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
        priceAB: parseFloat(s.price_ab) || 0,
        priceC: parseFloat(s.price_c) || 0,
        priceDE: parseFloat(s.price_de) || 0,
        durationMinutes: s.duration_minutes,
        packType: s.pack_type || 'Básico',
        loyaltyPoints: parseInt(s.loyalty_points) || 0
    };
}