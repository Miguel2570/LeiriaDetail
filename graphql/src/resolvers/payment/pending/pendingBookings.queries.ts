// graphql/src/resolvers/pendingBookings/pendingBookings.queries.ts
import { API } from '../../../proxy/serviceproxy/api';

export const pendingBookingsQueries = {
    pendingBooking: async (_: any, { id }: any, context: any) => {
        try {
            const data: any = await API.GET<any>(context, `/PendingBookings/${id}`);
            
            if (data.HasError) {
                return { pendingBookings: null, hasError: true, error: { field: "pendingBooking", message: data.Error?.Message } };
            }
            
            return {
                pendingBookings: data.PendingBooking ? [data.PendingBooking] : [],
                hasError: false,
                error: null
            };
        } catch (error: any) {
            return { pendingBookings: null, hasError: true, error: { field: "server", message: error.message } };
        }
    },

    userPendingBookings: async (_: any, { userId }: any, context: any) => {
        try {
            const data: any = await API.GET<any>(context, `/PendingBookings/user?userId=${userId}`);
            
            if (data.HasError) {
                return { pendingBookings: null, hasError: true, error: { field: "pendingBookings", message: data.Error?.Message } };
            }
            
            return {
                pendingBookings: data.PendingBookings || [],
                hasError: false,
                error: null
            };
        } catch (error: any) {
            return { pendingBookings: null, hasError: true, error: { field: "server", message: error.message } };
        }
    },

    checkSlotBlocked: async (_: any, { date, time }: any, context: any) => {
        try {
            const data: any = await API.GET<any>(context, `/PendingBookings/check-slot?date=${date}&time=${time}`);
            
            if (data.HasError) {
                return { blocked: false, hasError: true, error: { field: "slot", message: data.Error?.Message } };
            }
            
            return {
                blocked: data.Blocked || data.blocked || false,
                hasError: false,
                error: null
            };
        } catch (error: any) {
            return { blocked: false, hasError: true, error: { field: "server", message: error.message } };
        }
    },

    blockedSlotsForDate: async (_: any, { date }: any, context: any) => {
        try {
            const data: any = await API.GET<any>(context, `/PendingBookings/blocked-slots?date=${date}`);
            
            if (data.HasError) {
                return { blockedSlots: [], hasError: true, error: { field: "slots", message: data.Error?.Message } };
            }
            
            return {
                blockedSlots: data.BlockedSlots || data.blockedSlots || [],
                hasError: false,
                error: null
            };
        } catch (error: any) {
            return { blockedSlots: [], hasError: true, error: { field: "server", message: error.message } };
        }
    }
};