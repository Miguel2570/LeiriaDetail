import { API } from '../../proxy/serviceproxy/api';

export const bookingsQueries = {
    userBookings: async (_: any, { userId }: { userId: number }, context: any) => {
        try {
            const data: any = await API.GET<any>(context, `/Bookings?user_id=${userId}`);
            
            console.log('📦 Bookings API response:', JSON.stringify(data)); // Debug
            
            // A API retorna { Booking: [...] } - um array
            if (data.Booking && Array.isArray(data.Booking)) {
                return data.Booking;
            }
            
            // Se for um objeto único, mete em array
            if (data.Booking) {
                return [data.Booking];
            }
            
            return [];
        } catch (error) {
            console.error('❌ userBookings error:', error);
            return [];
        }
    },

    availableSlots: async (_: any, { date }: { date: string }, context: any) => {
        try {
            const data: any = await API.GET<any>(context, `/Bookings/slots?date=${date}`);
            return {
                date: data.Date,
                availableSlots: data.AvailableSlots || [],
                occupiedSlots: data.OccupiedSlots || [],
                hasError: data.HasError || false,
                error: data.Error || null
            };
        } catch (error: any) {
            return {
                availableSlots: [],
                hasError: true,
                error: { field: "server", message: error.message }
            };
        }
    },

    calculatePrice: async (_: any, { vehicleId, serviceId }: any, context: any) => {
        try {
            const data: any = await API.GET<any>(context, `/Bookings/price?vehicle_id=${vehicleId}&service_id=${serviceId}`);
            return {
                vehicleCategory: data.VehicleCategory,
                serviceName: data.ServiceName,
                price: data.Price,
                durationMinutes: data.DurationMinutes,
                hasError: data.HasError || false,
                error: data.Error || null
            };
        } catch (error: any) {
            return {
                hasError: true,
                error: { field: "server", message: error.message }
            };
        }
    }
};