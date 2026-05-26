import { API } from '../../proxy/serviceproxy/api';

export const bookingsMutations = {
    createClientBooking: async (_: any, { input }: any, context: any) => {
        try {
            const data: any = await API.POST<any>(context, "/Bookings/", input);
            return {
                booking: data.Booking || null,
                message: data.Message,
                hasError: data.HasError || false,
                error: data.Error || null
            };
        } catch (error: any) {
            return {
                booking: null,
                hasError: true,
                error: { field: "server", message: error.message }
            };
        }
    }
};