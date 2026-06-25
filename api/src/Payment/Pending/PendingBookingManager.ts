// api/src/PendingBookings/PendingBookingsManager.ts
import { server } from '../../Helpers/DatabaseConnectionHelper';

class PendingBookingsManager {
    
    static async create(data: {
        userId: number;
        vehicleId: number;
        serviceId: number;
        bookingDate: string;
        bookingTime: string;
        serviceName?: string;
        vehicleName?: string;
        vehiclePlate?: string;
        price: number;
        paymentMethod?: string;
        invoiceNIF?: string;
        invoiceName?: string;
        invoiceAddress?: string;
        expiresInMinutes?: number;
    }): Promise<any> {
        console.log('📥 Manager recebeu:', JSON.stringify(data, null, 2));
        const expiresInMinutes = data.expiresInMinutes || 30
        console.log('⏱ Expira em:', expiresInMinutes, 'minutos');
        
        const result = await server.query(
            `INSERT INTO pending_bookings 
             (user_id, vehicle_id, service_id, booking_date, booking_time, service_name, vehicle_name, vehicle_plate, price, payment_method, invoice_nif, invoice_name, invoice_address, status, expires_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, 'pending', NOW() + INTERVAL '${expiresInMinutes} minutes')
             RETURNING id, expires_at`,
            [
                data.userId, data.vehicleId, data.serviceId, data.bookingDate, data.bookingTime,
                data.serviceName, data.vehicleName, data.vehiclePlate, data.price,
                data.paymentMethod || 'mbway', data.invoiceNIF, data.invoiceName, data.invoiceAddress
            ]
        );
        return result.rows[0];
    }

    static async getById(id: string): Promise<any | null> {
        const result = await server.query(
            'SELECT * FROM pending_bookings WHERE id = $1 AND status = $2',
            [id, 'pending']
        );
        return result.rows[0] || null;
    }

    static async getByUserId(userId: number): Promise<any[]> {
        const result = await server.query(
            `SELECT * FROM pending_bookings 
             WHERE user_id = $1 AND status = 'pending' AND expires_at > NOW()
             ORDER BY created_at DESC`,
            [userId]
        );
        return result.rows;
    }

    static async markAsPaid(id: string, paymentMethod: string): Promise<void> {
        await server.query(
            `UPDATE pending_bookings 
             SET status = 'paid', paid_at = NOW(), payment_method = $2
             WHERE id = $1`,
            [id, paymentMethod]
        );
    }

    static async markAsExpired(id: string): Promise<void> {
        await server.query(
            `UPDATE pending_bookings SET status = 'expired' WHERE id = $1`,
            [id]
        );
    }

    // ✅ Verifica se um slot está bloqueado por pagamento pendente
    static async isSlotBlocked(date: string, time: string): Promise<boolean> {
        const result = await server.query(
            `SELECT id FROM pending_bookings 
             WHERE booking_date = $1 AND booking_time = $2 AND status = 'pending' AND expires_at > NOW()
             LIMIT 1`,
            [date, time]
        );
        return result.rows.length > 0;
    }

    // ✅ Busca slots bloqueados para uma data
    static async getBlockedSlotsForDate(date: string): Promise<string[]> {
        const result = await server.query(
            `SELECT booking_time FROM pending_bookings 
             WHERE booking_date = $1 AND status = 'pending' AND expires_at > NOW()`,
            [date]
        );
        return result.rows.map((r: any) => r.booking_time.substring(0, 5));
    }

    // ✅ Cancelar (expirar) um booking pendente
    static async cancel(id: string): Promise<boolean> {
        const result = await server.query(
            `UPDATE pending_bookings SET status = 'cancelled' WHERE id = $1 AND status = 'pending'`,
            [id]
        );
        return (result.rowCount ?? 0) > 0;
    }

    // ✅ Limpar todos os expirados (chamado pelo cron job)
    static async cleanupExpired(): Promise<number> {
        const result = await server.query(
            `UPDATE pending_bookings 
            SET status = 'expired' 
            WHERE status = 'pending' AND expires_at < NOW()`
        );
        return result.rowCount ?? 0;
    }
}

export default PendingBookingsManager;