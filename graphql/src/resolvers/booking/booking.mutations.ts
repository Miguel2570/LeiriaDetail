import { pool } from '../../db';

export const bookingMutations = {
    createBooking: async (_: any, { input }: { input: any }, context: any) => {
        const { user_id, vehicle_id, service_id, booking_date, booking_time } = input;
        try {
            const q = `
                INSERT INTO bookings (user_id, vehicle_id, service_id, booking_date, booking_time, status)
                VALUES ($1, $2, $3, $4, $5, 'PENDENTE')
                RETURNING *
            `;
            const values = [user_id, vehicle_id, service_id, booking_date, booking_time];
            const res = await pool.query(q, values);
            return res.rows[0];
        } catch (err) {
            console.error("Erro ao criar marcação:", err);
            throw new Error("Erro ao guardar a marcação na base de dados.");
        }
    }
};