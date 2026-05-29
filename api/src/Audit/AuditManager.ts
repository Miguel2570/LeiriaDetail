import { server } from '../Helpers/DatabaseConnectionHelper';

interface AuditLog {
    id: number;
    user_id: number;
    action: string;
    email: string;
    details: any;
    created_at: string;
}

class AuditManager {
    
    static async getLogs(limit: number = 100): Promise<AuditLog[]> {
        const query = `
            SELECT id, user_id, action, email, details, created_at
            FROM audit_logs
            ORDER BY created_at DESC
            LIMIT $1
        `;
        const result = await server.query(query, [limit]);
        return result.rows;
    }

    static async getLogsByAction(action: string, limit: number = 100): Promise<AuditLog[]> {
        const query = `
            SELECT id, user_id, action, email, details, created_at
            FROM audit_logs
            WHERE action = $1
            ORDER BY created_at DESC
            LIMIT $2
        `;
        const result = await server.query(query, [action, limit]);
        return result.rows;
    }

    static async getLogsByUser(userId: number, limit: number = 100): Promise<AuditLog[]> {
        const query = `
            SELECT id, user_id, action, email, details, created_at
            FROM audit_logs
            WHERE user_id = $1
            ORDER BY created_at DESC
            LIMIT $2
        `;
        const result = await server.query(query, [userId, limit]);
        return result.rows;
    }

    static async getLogsByDate(date: string, limit: number = 100): Promise<AuditLog[]> {
        const query = `
            SELECT id, user_id, action, email, details, created_at
            FROM audit_logs
            WHERE DATE(created_at) = $1
            ORDER BY created_at DESC
            LIMIT $2
        `;
        const result = await server.query(query, [date, limit]);
        return result.rows;
    }

    static async createLog(userId: number | null, action: string, email: string | null, details: any = null): Promise<void> {
        const query = `
            INSERT INTO audit_logs (user_id, action, email, details)
            VALUES ($1, $2, $3, $4)
        `;
        await server.query(query, [userId, action, email, details ? JSON.stringify(details) : null]);
    }
}

export default AuditManager;