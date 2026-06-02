// graphql/src/resolvers/reviews/reviews.queries.ts
import { API } from '../../proxy/serviceproxy/api';

export const reviewsQueries = {
    reviews: async (_: any, __: any, context: any) => {
        try {
            const data: any = await API.GET<any>(context, "/Reviews/");
            return {
                reviews: (data.Reviews || []).map(mapReview),
                message: data.Message,
                hasError: data.HasError || false
            };
        } catch (error: any) {
            return { reviews: [], hasError: true };
        }
    },

    // ✅ NOVO
    reviewByToken: async (_: any, { token }: { token: string }, context: any) => {
        try {
            const data: any = await API.GET<any>(context, `/Reviews/token/${token}`);
            return {
                reviews: (data.Reviews || []).map(mapReview),
                message: data.Message,
                hasError: data.HasError || false
            };
        } catch (error: any) {
            return { reviews: [], hasError: true };
        }
    }
};

function mapReview(r: any) {
    return {
        id: r.id?.toString(),
        name: r.name,
        car: r.car,
        text: r.text,
        rating: r.rating || 5,
        submitted: r.submitted || false,
        createdAt: r.created_at
    };
}