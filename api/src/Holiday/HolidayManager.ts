// api/src/Holiday/HolidayManager.ts
import { server } from '../Helpers/DatabaseConnectionHelper';

interface BlockedDate {
    id: number;
    date: string;
    reason: string;
    is_recurring: boolean;
}

class HolidayManager {
    
    static async getAll(): Promise<BlockedDate[]> {
        const result = await server.query('SELECT * FROM blocked_dates ORDER BY date ASC');
        return result.rows;
    }

    static async isBlocked(date: string): Promise<boolean> {
        const result = await server.query('SELECT id FROM blocked_dates WHERE date = $1', [date]);
        return result.rows.length > 0;
    }

    static async add(date: string, reason: string, isRecurring: boolean = false): Promise<BlockedDate> {
        const result = await server.query(
            'INSERT INTO blocked_dates (date, reason, is_recurring) VALUES ($1, $2, $3) RETURNING *',
            [date, reason, isRecurring]
        );
        return result.rows[0];
    }

    static async remove(id: number): Promise<void> {
        await server.query('DELETE FROM blocked_dates WHERE id = $1', [id]);
    }
}

export default HolidayManager;