import { API } from '../../proxy/serviceproxy/api';

export const faqsMutations = {
    addFaq: async (_: any, { input }: any, context: any) => {
        try {
            const data: any = await API.POST<any>(context, "/Faqs/Add", input);
            return {
                faq: data.Faqs?.[0] || null,
                message: data.Message,
                hasError: data.HasError || false,
                error: data.Error || null
            };
        } catch (error: any) {
            return {
                faq: null,
                hasError: true,
                error: { field: "server", message: error.message }
            };
        }
    },

    updateFaq: async (_: any, { id, input }: any, context: any) => {
        try {
            const data: any = await API.PUT<any>(context, `/Faqs/${id}`, input);
            return {
                faq: data.Faqs?.[0] || null,
                message: data.Message,
                hasError: data.HasError || false,
                error: data.Error || null
            };
        } catch (error: any) {
            return {
                faq: null,
                hasError: true,
                error: { field: "server", message: error.message }
            };
        }
    },

    deleteFaq: async (_: any, { id }: any, context: any) => {
        try {
            const data: any = await API.DELETE<any>(context, `/Faqs/${id}`);
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