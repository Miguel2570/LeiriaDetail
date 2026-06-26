// src/Financial/FinancialManager.ts
import { server } from '../Helpers/DatabaseConnectionHelper';
import { FinancialSummary, RevenueDataPoint, Transaction } from './FinancialModel';

class FinancialManager {
    
    // 🔧 Função auxiliar para formatar data como YYYY-MM-DD
    private static fmt(d: Date): string {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
    }
    
    private static getDateRange(period: string): { startDate: string; groupBy: string; fillPoints: string[] } {
        const now = new Date();
        let startDate: string;
        let groupBy: string;
        let fillPoints: string[] = [];
        
        switch (period) {
            case '1d': {
                startDate = this.fmt(now);
                groupBy = "DATE_TRUNC('hour', b.booking_date)::text";
                for (let h = 0; h < 24; h++) {
                    fillPoints.push(`${String(h).padStart(2, '0')}:00`);
                }
                break;
            }
            case '7d': {
                const dayOfWeek = now.getDay();
                const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
                const monday = new Date(now);
                monday.setDate(now.getDate() + mondayOffset);
                monday.setHours(0, 0, 0, 0);
                startDate = this.fmt(monday);
                groupBy = "b.booking_date::date::text";
                for (let i = 0; i < 7; i++) {
                    const d = new Date(monday);
                    d.setDate(monday.getDate() + i);
                    fillPoints.push(this.fmt(d));
                }
                break;
            }
            case '30d': {
                const start = new Date(now);
                start.setDate(now.getDate() - 29);
                start.setHours(0, 0, 0, 0);
                startDate = this.fmt(start);
                groupBy = "b.booking_date::date::text";
                for (let i = 0; i < 30; i++) {
                    const d = new Date(start);
                    d.setDate(start.getDate() + i);
                    fillPoints.push(this.fmt(d));
                }
                break;
            }
            case '90d': {
                const start = new Date(now);
                start.setDate(now.getDate() - 89);
                start.setHours(0, 0, 0, 0);
                startDate = this.fmt(start);
                // 🔥 NÃO agrupar no SQL - buscar por dia
                groupBy = "b.booking_date::date::text";
                
                // Criar 13 pontos (1 por semana = segundas-feiras)
                const firstMonday = new Date(start);
                const fd = firstMonday.getDay();
                const off = fd === 0 ? -6 : 1 - fd;
                firstMonday.setDate(firstMonday.getDate() + off);
                
                for (let i = 0; i < 13; i++) {
                    const d = new Date(firstMonday);
                    d.setDate(firstMonday.getDate() + i * 7);
                    fillPoints.push(this.fmt(d));
                }
                break;
            }
            case '365d': {
                const start = new Date(now);
                start.setFullYear(now.getFullYear() - 1);
                start.setDate(1);
                start.setHours(0, 0, 0, 0);
                startDate = this.fmt(start);
                // 🔥 NÃO agrupar no SQL - buscar por dia
                groupBy = "b.booking_date::date::text";
                
                // Criar 12 pontos (dia 1 de cada mês)
                for (let i = 0; i < 12; i++) {
                    const d = new Date(start);
                    d.setMonth(start.getMonth() + i);
                    d.setDate(1);
                    fillPoints.push(this.fmt(d));
                }
                break;
            }
            default: {
                const start = new Date(now);
                start.setDate(now.getDate() - 6);
                start.setHours(0, 0, 0, 0);
                startDate = this.fmt(start);
                groupBy = "b.booking_date::date::text";
                for (let i = 0; i < 7; i++) {
                    const d = new Date(start);
                    d.setDate(start.getDate() + i);
                    fillPoints.push(this.fmt(d));
                }
            }
        }
        
        return { startDate, groupBy, fillPoints };
    }
    
    static async getSummary(period: string = '7d'): Promise<FinancialSummary> {
        const { startDate } = this.getDateRange(period);
        
        const revenueQuery = `
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
            JOIN user_vehicles v ON b.vehicle_id = v.id
            WHERE b.status = 'CONCLUIDO'
            AND b.booking_date::date >= $1::date
        `;
        const revenueResult = await server.query(revenueQuery, [startDate]);
        
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
            LEFT JOIN user_vehicles v ON b.vehicle_id = v.id
            WHERE b.status IN ('PENDENTE', 'EM_PROGRESSO', 'AGENDADO', 'CONFIRMADO')
            AND b.booking_date::date >= $1::date
        `;
        const expectedResult = await server.query(expectedQuery, [startDate]);
        
        const pendingQuery = `
            SELECT 
                COALESCE(SUM(amount), 0) as total,
                COUNT(*)::int as count
            FROM transactions
            WHERE type = 'pending'
        `;
        const pendingResult = await server.query(pendingQuery);
        
        const periodRevenue = parseFloat(revenueResult.rows[0]?.total || '0');
        
        return {
            periodRevenue,
            weeklyRevenue: periodRevenue,
            expectedIncome: parseFloat(expectedResult.rows[0]?.total || '0'),
            pendingPayments: parseFloat(pendingResult.rows[0]?.total || '0'),
            pendingCount: parseInt(pendingResult.rows[0]?.count || '0')
        };
    }
    
    static async getRevenueChart(period: string = '7d'): Promise<RevenueDataPoint[]> {
        const { startDate, groupBy, fillPoints } = this.getDateRange(period);
        
        // 🔥 Para 90d e 365d, buscar dados por dia (sem agrupamento complexo)
        const query = `
            SELECT 
                b.booking_date::date::text as date,
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
            AND b.booking_date::date >= $1::date
            GROUP BY b.booking_date::date
            ORDER BY date ASC
        `;
        
        const result = await server.query(query, [startDate]);
        
        // Mapa de data -> receita (formato YYYY-MM-DD)
        const revenueMap = new Map<string, number>();
        
        result.rows.forEach((r: any) => {
            const rowDate = new Date(r.date);
            const key = this.fmt(rowDate);
            revenueMap.set(key, (revenueMap.get(key) || 0) + parseFloat(r.revenue));
        });
        
        // 🔥 Para 90d e 365d, acumular receita entre fillPoints consecutivos
        if (period === '90d' || period === '365d') {
            const sortedPoints = [...fillPoints].sort();
            
            const allPoints: RevenueDataPoint[] = sortedPoints.map((pointDate, index) => {
                const nextPointDate = index < sortedPoints.length - 1 ? sortedPoints[index + 1] : null;
                
                // Somar todas as receitas entre pointDate (inclusive) e nextPointDate (exclusive)
                let totalRevenue = 0;
                revenueMap.forEach((rev, dateKey) => {
                    if (dateKey >= pointDate && (!nextPointDate || dateKey < nextPointDate)) {
                        totalRevenue += rev;
                    }
                });
                
                return { date: pointDate, revenue: totalRevenue };
            });
            
            return allPoints;
        }
        
        // Para 1d, 7d, 30d - match exato
        const allPoints: RevenueDataPoint[] = fillPoints.map(pointDate => {
            let revenue = 0;
            
            if (period === '1d') {
                // Procurar por hora
                revenueMap.forEach((rev, dateKey) => {
                    // dateKey é YYYY-MM-DD, precisamos da hora
                    // Encontrar a linha original com esta data
                });
                // Para 1d, buscar diretamente das rows
                result.rows.forEach((r: any) => {
                    const rowDate = new Date(r.date);
                    const hour = `${String(rowDate.getHours()).padStart(2, '0')}:00`;
                    if (hour === pointDate) {
                        revenue += parseFloat(r.revenue);
                    }
                });
            } else {
                revenue = revenueMap.get(pointDate) || 0;
            }
            
            return { date: pointDate, revenue };
        });
        
        return allPoints;
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
                t.transaction_date::text as transaction_date
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