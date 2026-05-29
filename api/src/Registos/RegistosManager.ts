// src/Registos/RegistosManager.ts
import { server } from '../Helpers/DatabaseConnectionHelper';
import { ServiceEntry, WorkshopStats } from './RegistosModel';

class RegistosManager {
    
    static async createServiceEntry(data: {
        clientId: number;
        vehicleId: number;
        serviceType: string;
        observations: string;
        entryChecks: string[];
        estimatedValue: number;
    }): Promise<number> {
        const query = `
            INSERT INTO workshop_services (
                client_id, vehicle_id, service_type, status, progress,
                entry_date, entry_observations, entry_checks, service_checks,
                estimated_value, total_value
            )
            VALUES ($1, $2, $3, 'EM_ABERTO', 0, NOW(), $4, $5, '[]', $6, $6)
            RETURNING id
        `;
        
        const result = await server.query(query, [
            data.clientId,
            data.vehicleId,
            data.serviceType,
            data.observations || '',
            JSON.stringify(data.entryChecks || []),
            data.estimatedValue || 0
        ]);
        
        return result.rows[0].id;
    }
    
    static async getServiceById(serviceId: number): Promise<ServiceEntry | null> {
        const query = `
            SELECT 
                ws.*,
                v.license_plate as vehicle_plate
            FROM workshop_services ws
            LEFT JOIN user_vehicles v ON ws.vehicle_id = v.id
            WHERE ws.id = $1
        `;
        
        const result = await server.query(query, [serviceId]);
        
        if (result.rows.length === 0) return null;
        
        return this.mapServiceEntry(result.rows[0]);
    }
    
    static async getAllServices(status?: string, clientId?: number, date?: string): Promise<ServiceEntry[]> {
        let query = `
            SELECT 
                ws.*,
                COALESCE(uv.license_plate, v.license_plate) as vehicle_plate
            FROM workshop_services ws
            LEFT JOIN user_vehicles uv ON ws.vehicle_id = uv.id
            LEFT JOIN vehicles v ON ws.vehicle_id = v.id
            WHERE 1=1
        `;
        
        const params: any[] = [];
        let paramCount = 0;
        
        if (status) {
            paramCount++;
            query += ` AND ws.status = $${paramCount}`;
            params.push(status);
        }
        
        if (clientId) {
            paramCount++;
            query += ` AND ws.client_id = $${paramCount}`;
            params.push(clientId);
        }
        
        // ✅ NOVO
        if (date) {
            paramCount++;
            query += ` AND ws.entry_date::date = $${paramCount}::date`;
            params.push(date);
        }
        
        query += ` ORDER BY ws.entry_date DESC`;
        
        const result = await server.query(query, params);
        return result.rows.map((row: any) => this.mapServiceEntry(row));
    }
    
    static async getActiveServices(): Promise<ServiceEntry[]> {
        const query = `
            SELECT 
                ws.*,
                COALESCE(uv.license_plate, v.license_plate) as vehicle_plate
            FROM workshop_services ws
            LEFT JOIN user_vehicles uv ON ws.vehicle_id = uv.id
            LEFT JOIN vehicles v ON ws.vehicle_id = v.id
            WHERE ws.status IN ('EM_ABERTO', 'EM_PROGRESSO')
            ORDER BY 
                CASE ws.status 
                    WHEN 'EM_PROGRESSO' THEN 1 
                    WHEN 'EM_ABERTO' THEN 2 
                END,
                ws.entry_date DESC
        `;
        
        const result = await server.query(query);
        return result.rows.map((row: any) => this.mapServiceEntry(row));
    }
    
    static async startService(serviceId: number): Promise<ServiceEntry | null> {
        const query = `
            UPDATE workshop_services 
            SET status = 'EM_PROGRESSO', 
                started_at = NOW(), 
                progress = 10,
                updated_at = NOW()
            WHERE id = $1 AND status = 'EM_ABERTO'
            RETURNING *
        `;
        
        const result = await server.query(query, [serviceId]);
        
        if (result.rows.length === 0) return null;
        
        return this.getServiceById(serviceId);
    }
    
    static async updateChecklist(
        serviceId: number, 
        checklist: string[], 
        notes: string, 
        progress: number
    ): Promise<ServiceEntry | null> {
        const query = `
            UPDATE workshop_services 
            SET service_checks = $2, 
                service_notes = $3, 
                progress = LEAST($4, 100),
                updated_at = NOW()
            WHERE id = $1
            RETURNING *
        `;
        
        const result = await server.query(query, [
            serviceId,
            JSON.stringify(checklist),
            notes || '',
            progress
        ]);
        
        if (result.rows.length === 0) return null;
        
        return this.getServiceById(serviceId);
    }
    
    static async completeService(serviceId: number, totalValue?: number): Promise<ServiceEntry | null> {
        let query = `
            UPDATE workshop_services 
            SET status = 'CONCLUIDO', 
                completed_at = NOW(), 
                progress = 100,
                updated_at = NOW()
        `;
        
        const params: any[] = [];
        let paramCount = 1;
        
        if (totalValue !== undefined) {
            paramCount++;
            query += ` , total_value = $${paramCount}`;
            params.push(totalValue);
        }
        
        query += ` WHERE id = $1 AND status = 'EM_PROGRESSO' RETURNING *`;
        params.unshift(serviceId);
        
        const result = await server.query(query, params);
        
        if (result.rows.length === 0) return null;
        
        return this.getServiceById(serviceId);
    }
    
    static async getStats(): Promise<WorkshopStats> {
        const query = `
            SELECT 
                COUNT(*) FILTER (WHERE status = 'EM_ABERTO') as em_aberto,
                COUNT(*) FILTER (WHERE status = 'EM_PROGRESSO') as em_progresso,
                COUNT(*) FILTER (WHERE status = 'CONCLUIDO' AND completed_at::date = CURRENT_DATE) as concluidos_hoje,
                COALESCE(SUM(total_value) FILTER (WHERE status = 'CONCLUIDO' AND completed_at::date = CURRENT_DATE), 0) as faturacao_hoje
            FROM workshop_services
        `;
        
        const result = await server.query(query);
        const row = result.rows[0];
        
        return {
            emAberto: parseInt(row.em_aberto) || 0,
            emProgresso: parseInt(row.em_progresso) || 0,
            concluidosHoje: parseInt(row.concluidos_hoje) || 0,
            faturacaoHoje: parseFloat(row.faturacao_hoje) || 0
        };
    }
    
    static async getServiceHistory(clientId: number): Promise<ServiceEntry[]> {
        const query = `
            SELECT 
                ws.*,
                COALESCE(uv.license_plate, v.license_plate) as vehicle_plate
            FROM workshop_services ws
            LEFT JOIN user_vehicles uv ON ws.vehicle_id = uv.id
            LEFT JOIN vehicles v ON ws.vehicle_id = v.id
            WHERE ws.client_id = $1
            ORDER BY ws.entry_date DESC
        `;
        
        const result = await server.query(query, [clientId]);
        return result.rows.map((row: any) => this.mapServiceEntry(row));
    }
    
    private static mapServiceEntry(row: any): ServiceEntry {
        return {
            id: row.id,
            clientId: row.client_id,
            vehicleId: row.vehicle_id,
            vehiclePlate: row.vehicle_plate || 'N/A',
            serviceType: row.service_type,
            status: row.status,
            progress: row.progress || 0,
            entryDate: row.entry_date?.toISOString() || new Date().toISOString(),
            startedAt: row.started_at?.toISOString() || null,
            completedAt: row.completed_at?.toISOString() || null,
            observations: row.entry_observations || '',
            entryChecks: typeof row.entry_checks === 'string' ? JSON.parse(row.entry_checks) : (row.entry_checks || []),
            checklistItems: typeof row.service_checks === 'string' ? JSON.parse(row.service_checks) : (row.service_checks || []),
            serviceNotes: row.service_notes || '',
            estimatedValue: row.estimated_value || 0,
            totalValue: row.total_value || 0
        };
    }
}

export default RegistosManager;