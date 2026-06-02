import { API } from '../../proxy/serviceproxy/api';

export const reviewsMutations = {
    addReview: async (_: any, { input }: any, context: any) => {
        try {
            const data: any = await API.POST<any>(context, "/Reviews/Add", input);
            return {
                review: data.Reviews?.[0] || null,
                message: data.Message,
                hasError: data.HasError || false,
                error: data.Error || null
            };
        } catch (error: any) {
            return {
                review: null,
                hasError: true,
                error: { field: "server", message: error.message }
            };
        }
    },

    approveReview: async (_: any, { id }: { id: string }, context: any) => {
        try {
            const data: any = await API.PUT<any>(context, `/Reviews/${id}/approve`);
            return {
                success: !data.HasError,
                message: data.Message,
                hasError: data.HasError || false,
                error: data.Error || null
            };
        } catch (error: any) {
            return {
                success: false,
                hasError: true,
                error: { field: "server", message: error.message }
            };
        }
    },

    deleteReview: async (_: any, { id }: { id: string }, context: any) => {
        try {
            const data: any = await API.DELETE<any>(context, `/Reviews/${id}`);
            return {
                success: data.success || false,
                message: data.Message,
                hasError: data.HasError || false,
                error: data.Error || null
            };
        } catch (error: any) {
            return {
                success: false,
                hasError: true,
                error: { field: "server", message: error.message }
            };
        }
    },
    submitReviewByToken: async (_: any, { token, text, rating }: any, context: any) => {
        try {
            const data: any = await API.POST<any>(context, `/Reviews/token/${token}/submit`, { text, rating });
            return {
                success: !data.HasError,
                message: data.Message,
                hasError: data.HasError || false,
                error: data.Error || null
            };
        } catch (error: any) {
            return {
                success: false,
                hasError: true,
                error: { field: "server", message: error.message }
            };
        }
    }
};