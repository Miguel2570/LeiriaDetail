import { API } from '../../proxy/serviceproxy/api';

export const portfolioMutations = {
    addPortfolioItem: async (_: any, { input }: any, context: any) => {
        try {
            const data: any = await API.POST<any>(context, "/Portfolio/Add", input);
            return {
                item: data.Item || null,
                message: data.Message,
                hasError: data.HasError || false,
                error: data.Error || null
            };
        } catch (error: any) {
            return {
                item: null,
                hasError: true,
                error: { field: "server", message: error.message }
            };
        }
    },

    updatePortfolioItem: async (_: any, { id, input }: any, context: any) => {
        try {
            const data: any = await API.PUT<any>(context, `/Portfolio/${id}`, input);
            return {
                item: data.Item || null,
                message: data.Message,
                hasError: data.HasError || false,
                error: data.Error || null
            };
        } catch (error: any) {
            return {
                item: null,
                hasError: true,
                error: { field: "server", message: error.message }
            };
        }
    },

    deletePortfolioItem: async (_: any, { id }: any, context: any) => {
        try {
            const data: any = await API.DELETE<any>(context, `/Portfolio/${id}`);
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
    }
};