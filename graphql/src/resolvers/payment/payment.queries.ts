import { API } from '../../proxy/serviceproxy/api';

export const paymentQueries = {
    paymentByBooking: async (_: any, { bookingId }: any, context: any) => {
        try {
            const data: any = await API.GET<any>(context, `/Payment/${bookingId}`);
            return {
                payment: data.Payment || null,
                message: data.Message,
                hasError: data.HasError || false,
                error: data.Error || null
            };
        } catch (error: any) {
            return { payment: null, message: null, hasError: true, error: { field: "server", message: error.message } };
        }
    }
};