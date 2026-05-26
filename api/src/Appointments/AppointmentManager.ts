import { server } from '../Helpers/DatabaseConnectionHelper';
import { Booking, Bay } from './AppointmentModel';

class AppointmentManager {
    
    static async getAppointments(date?: string): Promise<{ pending: Booking[]; bays: Bay[] }> {
        const targetDate = date || new Date().toISOString().split('T')[0];
        
        // Marcações pendentes
        const pendingQuery = `
            SELECT 
                b.id,
                u.first_name || ' ' || u.last_name as "clientName",
                COALESCE(u.phone, 'N/A') as "clientPhone",
                s.name as service,
                v.brand || ' ' || v.model as vehicle,
                v.license_plate as "vehiclePlate",
                b.booking_date::text as date,
                b.booking_time::text as time,
                s.duration_minutes || 'min' as duration,
                b.status
            FROM bookings b
            JOIN users u ON b.user_id = u.id
            JOIN services s ON b.service_id = s.id
            JOIN vehicles v ON b.vehicle_id = v.id
            WHERE b.status = 'PENDENTE'
            AND b.booking_date >= $1
            ORDER BY b.booking_date, b.booking_time
        `;
        
        const pendingResult = await server.query(pendingQuery, [targetDate]);
        
        // Bays fixos (podem ser dinâmicos depois)
        const bays: Bay[] = [
            { id: 'bay-1', name: 'Bay 1 (Cerâmicos/Pintura)', bookings: [] },
            { id: 'bay-2', name: 'Bay 2 (Interiores)', bookings: [] },
            { id: 'bay-3', name: 'Bay 3 (Express/Lavagem)', bookings: [] },
        ];
        
        // Marcações em progresso/agendadas nos bays
        const baysQuery = `
            SELECT 
                b.id,
                u.first_name || ' ' || u.last_name as "clientName",
                COALESCE(u.phone, 'N/A') as "clientPhone",
                s.name as service,
                v.brand || ' ' || v.model as vehicle,
                v.license_plate as "vehiclePlate",
                b.booking_date::text as date,
                b.booking_time::text as time,
                s.duration_minutes || 'min' as duration,
                b.status,
                COALESCE(b.bay, 'bay-1') as bay
            FROM bookings b
            JOIN users u ON b.user_id = u.id
            JOIN services s ON b.service_id = s.id
            JOIN vehicles v ON b.vehicle_id = v.id
            WHERE b.status IN ('EM_PROGRESSO', 'AGENDADO', 'CONFIRMADO')
            AND b.booking_date = $1
            ORDER BY b.booking_time
        `;
        
        const baysResult = await server.query(baysQuery, [targetDate]);
        
        for (const booking of baysResult.rows) {
            const bay = bays.find(b => b.id === booking.bay);
            if (bay) {
                bay.bookings.push(booking);
            } else {
                bays[0].bookings.push(booking);
            }
        }
        
        return {
            pending: pendingResult.rows,
            bays
        };
    }
    
    static async moveBooking(bookingId: number, toBayId: string, status: string = 'EM_PROGRESSO'): Promise<void> {
        await server.query(
            `UPDATE bookings SET status = $1, bay = $2 WHERE id = $3`,
            [status, toBayId, bookingId]
        );
    }
    
    static async createBooking(
        userId: number,
        vehicleId: number,
        serviceId: number,
        bookingDate: string,
        bookingTime: string
    ): Promise<number> {
        const query = `
            INSERT INTO bookings (user_id, vehicle_id, service_id, booking_date, booking_time, status)
            VALUES ($1, $2, $3, $4, $5, 'PENDENTE')
            RETURNING id
        `;
        
        const result = await server.query(query, [userId, vehicleId, serviceId, bookingDate, bookingTime]);
        return result.rows[0].id;
    }
    
    static async updateBookingStatus(bookingId: number, status: string): Promise<void> {
        await server.query(
            `UPDATE bookings SET status = $1 WHERE id = $2`,
            [status, bookingId]
        );
    }
}

export default AppointmentManager;