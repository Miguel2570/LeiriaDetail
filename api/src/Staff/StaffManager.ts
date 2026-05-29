// api/src/Staff/StaffManager.ts
import { server } from '../Helpers/DatabaseConnectionHelper';
import { Staff } from './StaffModel';
import AuditManager from '../Audit/AuditManager';
import logger from '../Helpers/Logger';

class StaffManager {
    
    static async getAllStaff(): Promise<Staff[]> {
        const query = `
            SELECT DISTINCT ON (u.id)
                u.id, u.first_name || ' ' || u.last_name as name, u.email,
                COALESCE(u.role, 'staff') as role,
                CASE WHEN us_latest.session_key IS NOT NULL THEN 'active' ELSE 'offline' END as status,
                COALESCE(task_counts.count, 0) as tasks
            FROM users u
            LEFT JOIN LATERAL (SELECT session_key FROM user_sessions WHERE user_id = u.id AND expirationdatetime > NOW() LIMIT 1) us_latest ON true
            LEFT JOIN LATERAL (SELECT COUNT(*) as count FROM bookings WHERE user_id = u.id AND status IN ('EM_PROGRESSO', 'PENDENTE')) task_counts ON true
            WHERE u.role IN ('staff', 'admin', 'superadmin', 'operator', 'manager')
            ORDER BY u.id, u.role DESC, u.first_name ASC
        `;
        const result = await server.query(query);
        return result.rows;
    }
    
    static async getStaffById(id: number): Promise<Staff | null> {
        const result = await server.query(
            `SELECT u.id, u.first_name || ' ' || u.last_name as name, u.email, COALESCE(u.role, 'staff') as role,
             CASE WHEN us.session_key IS NOT NULL THEN 'active' ELSE 'offline' END as status
             FROM users u LEFT JOIN user_sessions us ON u.id = us.user_id AND us.expirationdatetime > NOW() WHERE u.id = $1`, [id]
        );
        return result.rows[0] || null;
    }
    
    static async updateRole(id: number, role: string, adminEmail?: string): Promise<void> {
        await server.query('UPDATE users SET role = $1, updated_at = NOW() WHERE id = $2', [role, id]);
        await AuditManager.createLog(null, 'UPDATE_ROLE', adminEmail || 'system', { targetId: id, newRole: role });
        logger.info('Role atualizada', { targetId: id, newRole: role });
    }
    
    static async removeStaff(id: number, adminEmail?: string): Promise<void> {
        await server.query("UPDATE users SET role = 'customer', updated_at = NOW() WHERE id = $1", [id]);
        await AuditManager.createLog(null, 'REMOVE_STAFF', adminEmail || 'system', { targetId: id });
        logger.info('Staff removido', { targetId: id });
    }
}

export default StaffManager;