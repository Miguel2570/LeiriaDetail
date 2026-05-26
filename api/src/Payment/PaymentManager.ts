// api/src/Payment/PaymentManager.ts
import { server } from '../Helpers/DatabaseConnectionHelper';
import { Payment, MultibancoData } from './PaymentModel';

class PaymentManager {

    static async createPayment(
        bookingId: number,
        userId: number,
        amount: number,
        method: string,
        mbwayPhone?: string,
        invoiceNIF?: string,
        invoiceName?: string,
        invoiceAddress?: string
    ): Promise<Payment> {
        let entity: string | undefined;
        let reference: string | undefined;

        if (method === 'multibanco') {
            entity = '21247';
            reference = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10)).join('');
        }

        const query = `
            INSERT INTO payments (booking_id, user_id, amount, method, status, entity, reference, mbway_phone, invoice_nif, invoice_name, invoice_address)
            VALUES ($1, $2, $3, $4, 'PENDENTE', $5, $6, $7, $8, $9, $10)
            RETURNING *
        `;

        const result = await server.query(query, [
            bookingId, userId, amount, method,
            entity || null, reference || null, mbwayPhone || null,
            invoiceNIF || null, invoiceName || null, invoiceAddress || null
        ]);

        return result.rows[0];
    }

    static async getPaymentByBooking(bookingId: number): Promise<Payment | null> {
        const query = 'SELECT * FROM payments WHERE booking_id = $1 ORDER BY created_at DESC LIMIT 1';
        const result = await server.query(query, [bookingId]);
        return result.rows[0] || null;
    }

    static async confirmPayment(paymentId: number): Promise<void> {
        await server.query(
            "UPDATE payments SET status = 'PAGO', paid_at = NOW() WHERE id = $1",
            [paymentId]
        );
    }

    static async cancelPayment(paymentId: number): Promise<void> {
        await server.query(
            "UPDATE payments SET status = 'CANCELADO' WHERE id = $1",
            [paymentId]
        );
    }

    static generateMultibancoRef(amount: number): MultibancoData {
        return new MultibancoData('21247', Array.from({ length: 9 }, () => Math.floor(Math.random() * 10)).join(''), amount);
    }
}

export default PaymentManager;