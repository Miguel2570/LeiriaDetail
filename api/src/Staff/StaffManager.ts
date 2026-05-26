// src/Staff/StaffManager.ts
import { server } from '../Helpers/DatabaseConnectionHelper';
import { Staff } from './StaffModel';

class StaffManager {
    
    static async getAllStaff(): Promise<Staff[]> {
        const query = `
            SELECT 
                u.id,
                u.first_name || ' ' || u.last_name as name,
                u.email,
                COALESCE(u.role, 'staff') as role,
                CASE 
                    WHEN us.session_key IS NOT NULL THEN 'active'
                    ELSE 'offline'
                END as status,
                COALESCE(b.task_count, 0) as tasks,
                u.created_at::text
            FROM users u
            LEFT JOIN user_sessions us ON u.id = us.user_id AND us.expirationdatetime > NOW()
            LEFT JOIN (
                SELECT user_id, COUNT(*) as task_count
                FROM bookings
                WHERE status IN ('EM_PROGRESSO', 'PENDENTE')
                GROUP BY user_id
            ) b ON u.id = b.user_id
            WHERE u.role IN ('staff', 'admin', 'superadmin', 'operator', 'manager')
            ORDER BY u.role DESC, u.first_name ASC
        `;
        
        const result = await server.query(query);
        return result.rows;
    }
    
    static async getStaffById(id: number): Promise<Staff | null> {
        const query = `
            SELECT 
                u.id,
                u.first_name || ' ' || u.last_name as name,
                u.email,
                COALESCE(u.role, 'staff') as role,
                CASE 
                    WHEN us.session_key IS NOT NULL THEN 'active'
                    ELSE 'offline'
                END as status
            FROM users u
            LEFT JOIN user_sessions us ON u.id = us.user_id AND us.expirationdatetime > NOW()
            WHERE u.id = $1
        `;
        
        const result = await server.query(query, [id]);
        return result.rows[0] || null;
    }
    
    static async updateRole(id: number, role: string): Promise<void> {
        await server.query(
            'UPDATE users SET role = $1, updated_at = NOW() WHERE id = $2',
            [role, id]
        );
    }
    
    static async removeStaff(id: number): Promise<void> {
        // Não elimina, só muda para customer
        await server.query(
            'UPDATE users SET role = $1, updated_at = NOW() WHERE id = $2',
            ['customer', id]
        );
    }
}

export default StaffManager;