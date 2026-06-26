import { server } from '../Helpers/DatabaseConnectionHelper';

export interface DashboardMetrics {
    faturacaoHoje: number;
    marcacoesPendentes: number;
    carrosConcluidos: number;
    staffAtivo: { ativo: number; total: number };
}

export interface RevenueDataPoint {
    date: string;
    revenue: number;
    expenses: number;
}

export interface ActivityLog {
    time: string;
    text: string;
    type: 'system' | 'user' | 'auth';
}

class DashboardManager {
    
    static async getMetrics(): Promise<DashboardMetrics> {
        // Faturação de hoje (bookings concluídos)
        const faturacaoQuery = `
            SELECT COALESCE(SUM(
                CASE 
                    WHEN COALESCE(v.size_category, 'M') = 'P' THEN s.price_ab
                    WHEN COALESCE(v.size_category, 'M') = 'M' THEN s.price_c
                    WHEN COALESCE(v.size_category, 'M') = 'G' THEN s.price_de
                    ELSE s.price_c
                END
            ), 0) as total
            FROM bookings b
            JOIN services s ON b.service_id = s.id
            LEFT JOIN user_vehicles v ON b.vehicle_id = v.id
            WHERE b.status = 'CONCLUIDO'
            AND b.booking_date = CURRENT_DATE
        `;
        const faturacaoResult = await server.query(faturacaoQuery);
        
        // Marcações pendentes
        const pendentesQuery = `
            SELECT COUNT(*) as total
            FROM bookings
            WHERE status = 'PENDENTE'
            AND booking_date >= CURRENT_DATE
        `;
        const pendentesResult = await server.query(pendentesQuery);
        
        // Carros concluídos hoje (veículos únicos)
        const concluidosQuery = `
            SELECT COUNT(DISTINCT b.vehicle_id) as total
            FROM bookings b
            WHERE b.status = 'CONCLUIDO'
            AND b.booking_date = CURRENT_DATE
        `;
        const concluidosResult = await server.query(concluidosQuery);
        
        // Staff ativo (users com role staff/admin/superadmin e sessão ativa)
        const staffQuery = `
            SELECT 
                COUNT(DISTINCT u.id) FILTER (WHERE us.session_key IS NOT NULL) as ativo,
                COUNT(DISTINCT u.id) as total
            FROM users u
            LEFT JOIN user_sessions us ON u.id = us.user_id 
                AND us.expirationdatetime > NOW()
            WHERE u.role IN ('staff', 'admin', 'superadmin', 'operator', 'manager')
        `;
        const staffResult = await server.query(staffQuery);
        
        return {
            faturacaoHoje: parseFloat(faturacaoResult.rows[0]?.total || '0'),
            marcacoesPendentes: parseInt(pendentesResult.rows[0]?.total || '0'),
            carrosConcluidos: parseInt(concluidosResult.rows[0]?.total || '0'),
            staffAtivo: {
                ativo: parseInt(staffResult.rows[0]?.ativo || '0'),
                total: parseInt(staffResult.rows[0]?.total || '0')
            }
        };
    }
    
    static async getRevenueChart(days: number = 7): Promise<RevenueDataPoint[]> {
        const query = `
            SELECT 
                b.booking_date as date,
                COALESCE(SUM(
                    CASE 
                        WHEN COALESCE(v.size_category, 'M') = 'P' THEN s.price_ab
                        WHEN COALESCE(v.size_category, 'M') = 'M' THEN s.price_c
                        WHEN COALESCE(v.size_category, 'M') = 'G' THEN s.price_de
                        ELSE s.price_c
                    END
                ), 0) as revenue
            FROM bookings b
            JOIN services s ON b.service_id = s.id
            LEFT JOIN user_vehicles v ON b.vehicle_id = v.id
            WHERE b.status = 'CONCLUIDO'
            AND b.booking_date >= CURRENT_DATE - INTERVAL '${days} days'
            GROUP BY b.booking_date
            ORDER BY b.booking_date ASC
        `;
        
        const result = await server.query(query);
        
        // Preencher dias em falta com 0
        const allDays: RevenueDataPoint[] = [];
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            
            const found = result.rows.find((r: any) => {
                const rowDate = new Date(r.date).toISOString().split('T')[0];
                return rowDate === dateStr;
            });
            
            allDays.push({
                date: dateStr,
                revenue: found ? parseFloat(found.revenue) : 0,
                expenses: found ? parseFloat(found.revenue) * 0.4 : 0
            });
        }
        
        return allDays;
    }
    
    static async getActivityLogs(limit: number = 10): Promise<ActivityLog[]> {
        const query = `
            SELECT 
                al.created_at as time,
                al.action as action,
                COALESCE(al.email, 'Sistema') as email,
                al.details::text as details
            FROM audit_logs al
            ORDER BY al.created_at DESC
            LIMIT $1
        `;
        
        const result = await server.query(query, [limit]);
        
        return result.rows.map((row: any) => {
            let type: 'system' | 'user' | 'auth' = 'system';
            if (row.action?.toLowerCase().includes('login') || row.action?.toLowerCase().includes('auth')) {
                type = 'auth';
            } else if (row.email && row.email !== 'Sistema') {
                type = 'user';
            }
            
            let text = `${row.action}: ${row.email}`;
            if (row.details && row.details !== 'null') {
                try {
                    const details = JSON.parse(row.details);
                    text += ` - ${JSON.stringify(details)}`;
                } catch {
                    text += ` - ${row.details}`;
                }
            }
            
            return {
                time: new Date(row.time).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }),
                text: text.substring(0, 100),
                type
            };
        });
    }
}

export default DashboardManager;