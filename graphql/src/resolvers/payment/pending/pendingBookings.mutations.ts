// graphql/src/resolvers/pendingBookings/pendingBookings.mutations.ts
import { API } from '../../../proxy/serviceproxy/api';

export const pendingBookingsMutations = {
    createPendingBooking: async (_: any, { input }: any, context: any) => {
        try {
            const data = await API.POST<any>(context, "/PendingBookings/", input);
            
            if (data.HasError) {
                return {
                    id: null,
                    expiresAt: null,
                    hasError: true,
                    error: { field: "pendingBooking", message: data.Error?.Message }
                };
            }
            
            return {
                id: data.PendingBooking?.id,
                expiresAt: data.PendingBooking?.expires_at,
                hasError: false,
                error: null
            };
        } catch (error: any) {
            return {
                id: null,
                expiresAt: null,
                hasError: true,
                error: { field: "server", message: error.message }
            };
        }
    },
    
    markPendingAsPaid: async (_: any, { id, paymentMethod }: any, context: any) => {
        try {
            const data = await API.PUT<any>(context, "/PendingBookings/mark-paid", { id, paymentMethod });
            
            if (data.HasError) {
                return { hasError: true, error: { field: "payment", message: data.Error?.Message } };
            }
            
            return { hasError: false, message: data.Message, error: null };
        } catch (error: any) {
            return { hasError: true, error: { field: "server", message: error.message } };
        }
    },
    
    cancelPendingBooking: async (_: any, { id }: any, context: any) => {
        try {
            const data = await API.DELETE<any>(context, `/PendingBookings/${id}`);
            
            if (data.HasError) {
                return { hasError: true, error: { field: "cancel", message: data.Error?.Message } };
            }
            
            return { hasError: false, message: data.Message, error: null };
        } catch (error: any) {
            return { hasError: true, error: { field: "server", message: error.message } };
        }
    }
};