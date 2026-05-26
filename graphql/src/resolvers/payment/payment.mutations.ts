// src/resolvers/payment/payment.mutations.ts
import { API } from '../../proxy/serviceproxy/api';

export const paymentMutations = {
    createPayment: async (_: any, { input }: any, context: any) => {
        try {
            const data: any = await API.POST<any>(context, "/Payment", input);
            return {
                payment: data.Payment || null,
                message: data.Message,
                hasError: data.HasError || false,
                error: data.Error || null
            };
        } catch (error: any) {
            return { payment: null, message: null, hasError: true, error: { field: "server", message: error.message } };
        }
    },
    confirmPayment: async (_: any, { paymentId }: any, context: any) => {
        try {
            const data: any = await API.POST<any>(context, "/Payment/confirm", { paymentId });
            return { hasError: data.HasError || false, message: data.Message || "Confirmado." };
        } catch (error: any) {
            return { hasError: true, message: error.message };
        }
    },
    generateMultibanco: async (_: any, { amount }: any, context: any) => {
        try {
            const data: any = await API.POST<any>(context, "/Payment/multibanco", { amount });
            return data;
        } catch (error: any) {
            return { entity: "", reference: "", amount: "0", validUntil: "" };
        }
    }
};