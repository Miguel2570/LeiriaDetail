import { API } from '../../proxy/serviceproxy/api';

export const materialsQueries = {
    materials: async (_: any, __: any, context: any) => {
        try {
            const data: any = await API.GET<any>(context, "/Materials/");
            return {
                materials: (data.Materials || []).map((m: any) => ({
                    id: m.id?.toString(),
                    name: m.name,
                    description: m.description,
                    category: m.category,
                    brand: m.brand,
                    purchaseUrl: m.purchase_url,
                    imageUrl: m.image_url
                })),
                categories: data.Categories || [],
                message: data.Message,
                hasError: false
            };
        } catch (error: any) {
            return { materials: [], categories: [], hasError: true };
        }
    }
};