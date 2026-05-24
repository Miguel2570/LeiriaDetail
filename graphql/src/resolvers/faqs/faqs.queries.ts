import { API } from '../../proxy/serviceproxy/api';

export const faqsQueries = {
    faqs: async (_: any, __: any, context: any) => {
        try {
            const data: any = await API.GET<any>(context, "/Faqs/");
            return {
                faqs: (data.Faqs || []).map((f: any) => ({
                    id: f.id?.toString(),
                    question: f.question,
                    answer: f.answer,
                    orderIndex: f.order_index || 0
                })),
                message: data.Message,
                hasError: false
            };
        } catch (error: any) {
            return { faqs: [], hasError: true };
        }
    }
};