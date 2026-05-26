// src/Financial/FinancialManager.ts
import { server } from '../Helpers/DatabaseConnectionHelper';
import { FinancialSummary, RevenueDataPoint, Transaction } from './FinancialModel';

class FinancialManager {
    
    static async getSummary(): Promise<FinancialSummary> {
        // Receita da semana (bookings concluídos nos últimos 7 dias)
        const weeklyQuery = `
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
            LEFT JOIN vehicles v ON b.vehicle_id = v.id
            WHERE b.status = 'CONCLUIDO'
            AND b.booking_date >= CURRENT_DATE - INTERVAL '7 days'
        `;
        const weeklyResult = await server.query(weeklyQuery);
        
        // Receita esperada (bookings pendentes/agendados)
        const expectedQuery = `
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
            LEFT JOIN vehicles v ON b.vehicle_id = v.id
            WHERE b.status IN ('PENDENTE', 'AGENDADO', 'CONFIRMADO')
        `;
        const expectedResult = await server.query(expectedQuery);
        
        // Pagamentos pendentes (transactions)
        const pendingQuery = `
            SELECT 
                COALESCE(SUM(amount), 0) as total,
                COUNT(*) as count
            FROM transactions
            WHERE type = 'pending'
        `;
        const pendingResult = await server.query(pendingQuery);
        
        return {
            weeklyRevenue: parseFloat(weeklyResult.rows[0]?.total || '0'),
            expectedIncome: parseFloat(expectedResult.rows[0]?.total || '0'),
            pendingPayments: parseFloat(pendingResult.rows[0]?.total || '0'),
            pendingCount: parseInt(pendingResult.rows[0]?.count || '0')
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
            LEFT JOIN vehicles v ON b.vehicle_id = v.id
            WHERE b.status = 'CONCLUIDO'
            AND b.booking_date >= CURRENT_DATE - INTERVAL '${days} days'
            GROUP BY b.booking_date
            ORDER BY b.booking_date ASC
        `;
        
        const result = await server.query(query);
        
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
                revenue: found ? parseFloat(found.revenue) : 0
            });
        }
        
        return allDays;
    }
    
    static async getTransactions(limit: number = 20): Promise<Transaction[]> {
        const query = `
            SELECT 
                t.id,
                t.booking_id,
                t.user_id,
                u.first_name || ' ' || u.last_name as client_name,
                t.amount,
                t.type,
                t.category,
                t.description,
                t.payment_method,
                t.transaction_date::text
            FROM transactions t
            LEFT JOIN users u ON t.user_id = u.id
            ORDER BY t.transaction_date DESC, t.id DESC
            LIMIT $1
        `;
        
        const result = await server.query(query, [limit]);
        return result.rows;
    }
}

export default FinancialManager;