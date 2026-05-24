import { API } from '../../proxy/serviceproxy/api';

export const reviewsQueries = {
    reviews: async (_: any, __: any, context: any) => {
        try {
            const data: any = await API.GET<any>(context, "/Reviews/");
            return {
                reviews: (data.Reviews || []).map((r: any) => ({
                    id: r.id?.toString(),
                    name: r.name,
                    car: r.car,
                    text: r.text,
                    rating: r.rating || 5,
                    createdAt: r.created_at
                })),
                message: data.Message,
                hasError: data.HasError || false
            };
        } catch (error: any) {
            return { reviews: [], hasError: true };
        }
    }
};