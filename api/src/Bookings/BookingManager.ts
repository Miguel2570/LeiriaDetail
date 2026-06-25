import { server } from '../Helpers/DatabaseConnectionHelper';
import { Booking, BookingOutputModel, SlotsOutputModel, PriceOutputModel, ErrorModel } from './BookingModel';

class BookingManager {

    /**
     * Criar nova marcação
     */
    static async CreateBooking(data: Booking): Promise<BookingOutputModel> {
        try {
            const query = `
                INSERT INTO bookings (user_id, vehicle_id, service_id, booking_date, booking_time, status)
                VALUES ($1, $2, $3, $4, $5, 'PENDENTE')
                RETURNING *
            `;
            const values = [data.user_id, data.vehicle_id, data.service_id, data.booking_date, data.booking_time];
            const result = await server.query(query, values);

            return new BookingOutputModel(result.rows[0], "Marcação criada com sucesso!");
        } catch (error: any) {
            console.error('Error creating booking:', error);
            return new BookingOutputModel(undefined, undefined,
                new ErrorModel("Server", "Erro ao criar marcação."));
        }
    }

    /**
     * Listar marcações de um utilizador
     */
    static async GetUserBookings(userId: number): Promise<BookingOutputModel> {
        try {
            const query = `
                SELECT 
                    b.id, b.user_id, b.booking_date, b.booking_time, b.status, b.created_at,
                    v.brand as vehicle_brand, v.model as vehicle_model, 
                    v.license_plate as vehicle_plate,
                    s.name as service_name,
                    s.price_ab, s.price_c, s.price_de,
                    v.size_category
                FROM bookings b
                JOIN vehicles v ON b.vehicle_id = v.id
                JOIN services s ON b.service_id = s.id
                WHERE b.user_id = $1
                ORDER BY b.booking_date DESC, b.booking_time DESC
            `;
            const result = await server.query(query, [userId]);

            const bookings = result.rows.map(row => {
                let price = 0;
                const cat = row.size_category;
                if (cat === 'A' || cat === 'B') price = parseFloat(row.price_ab);
                else if (cat === 'C') price = parseFloat(row.price_c);
                else price = parseFloat(row.price_de);

                return {
                    id: row.id,
                    user_id: row.user_id,
                    booking_date: row.booking_date,
                    booking_time: row.booking_time,
                    status: row.status,
                    created_at: row.created_at,
                    vehicle_name: `${row.vehicle_brand} ${row.vehicle_model}`,
                    vehicle_plate: row.vehicle_plate,
                    service_name: row.service_name,
                    service_price: price
                };
            });

            return new BookingOutputModel(bookings, "Marcações carregadas.");
        } catch (error: any) {
            return new BookingOutputModel(undefined, undefined,
                new ErrorModel("Server", "Erro ao carregar marcações."));
        }
    }

    /**
     * Obter slots disponíveis para uma data
     */
    static async GetAvailableSlots(date: string): Promise<SlotsOutputModel> {
        try {
            const allSlots = [
                '09:00', '09:30', '10:00', '10:30',
                '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
                '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
                '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
                '20:00', '20:30', '21:00'
            ];

            const query = `
                SELECT booking_time 
                FROM bookings 
                WHERE booking_date = $1 AND status != 'CANCELADO'
            `;
            const result = await server.query(query, [date]);
            const occupiedSlots = result.rows.map(r => r.booking_time.slice(0, 5));
            const availableSlots = allSlots.filter(slot => !occupiedSlots.includes(slot));

            return new SlotsOutputModel(date, availableSlots, occupiedSlots);
        } catch (error: any) {
            return new SlotsOutputModel(undefined, undefined, undefined,
                new ErrorModel("Server", "Erro ao carregar horários."));
        }
    }

    /**
     * Calcular preço baseado no veículo e serviço
     */
    static async CalculatePrice(vehicleId: number, serviceId: number): Promise<PriceOutputModel> {
        try {
            const vehicleQuery = 'SELECT size_category FROM user_vehicles WHERE id = $1';
            const vehicleResult = await server.query(vehicleQuery, [vehicleId]);

            if (vehicleResult.rows.length === 0) {
                return new PriceOutputModel(undefined, undefined, undefined, undefined,
                    new ErrorModel("vehicle", "Veículo não encontrado."));
            }

            const category = vehicleResult.rows[0].size_category;

            const serviceQuery = 'SELECT * FROM services WHERE id = $1';
            const serviceResult = await server.query(serviceQuery, [serviceId]);

            if (serviceResult.rows.length === 0) {
                return new PriceOutputModel(undefined, undefined, undefined, undefined,
                    new ErrorModel("service", "Serviço não encontrado."));
            }

            const service = serviceResult.rows[0];
            let price: number;

            if (category === 'A' || category === 'B') {
                price = parseFloat(service.price_ab);
            } else if (category === 'C') {
                price = parseFloat(service.price_c);
            } else {
                price = parseFloat(service.price_de);
            }

            return new PriceOutputModel(category, service.name, price, service.duration_minutes);
        } catch (error: any) {
            return new PriceOutputModel(undefined, undefined, undefined, undefined,
                new ErrorModel("Server", "Erro ao calcular preço."));
        }
    }
    static async CreatePendingBooking(data: {
        userId: number;
        vehicleId: number;
        serviceId: number;
        bookingDate: string;
        bookingTime: string;
        serviceName: string;
        vehicleName: string;
        vehiclePlate: string;
        price: number;
        paymentMethod: string;
        expiresInMinutes: number;
    }): Promise<any> {
        try {
            const query = `
                INSERT INTO pending_bookings (
                    user_id, vehicle_id, service_id, 
                    booking_date, booking_time, 
                    service_name, vehicle_name, vehicle_plate,
                    price, payment_method, 
                    expires_at, status
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 
                        NOW() + INTERVAL '${data.expiresInMinutes} minutes', 
                        'PENDENTE')
                RETURNING id, expires_at
            `;
            
            const values = [
                data.userId,
                data.vehicleId,
                data.serviceId,
                data.bookingDate,
                data.bookingTime,
                data.serviceName,
                data.vehicleName,
                data.vehiclePlate,
                data.price,
                data.paymentMethod
            ];
            
            const result = await server.query(query, values);
            
            return {
                HasError: false,
                PendingBooking: {
                    id: result.rows[0].id,
                    expires_at: result.rows[0].expires_at
                }
            };
        } catch (error: any) {
            console.error('Error creating pending booking:', error);
            return {
                HasError: true,
                Error: { Message: error.message || "Erro ao criar pré-reserva." }
            };
        }
    }
}

export default BookingManager;