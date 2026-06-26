// src/CRM/CRMManager.ts
import { server } from '../Helpers/DatabaseConnectionHelper';
import { Client, Vehicle, HistoryRecord } from './CRMModel';

class CRMManager {
    
    static async getClients(): Promise<Client[]> {
        const query = `
            SELECT DISTINCT
                u.id,
                u.first_name || ' ' || u.last_name as name,
                COALESCE(u.phone, 'N/A') as phone,
                u.email,
                u.created_at
            FROM users u
            LEFT JOIN user_vehicles uv ON u.id = uv.user_id
            LEFT JOIN bookings b ON u.id = b.user_id
            WHERE uv.id IS NOT NULL 
            OR b.id IS NOT NULL
            OR u.role = 'customer'
            ORDER BY u.created_at DESC
        `;
        
        const result = await server.query(query);
        
        console.log(`📊 Found ${result.rows.length} total clients`);
        
        const clients: Client[] = [];
        
        for (const row of result.rows) {
            try {
                console.log(`\n🔍 Processing client ${row.id} (${row.name})...`);
                
                const vehicles = await this.getClientVehicles(row.id);
                console.log(`   Vehicles: ${vehicles.length}`);
                
                const history = await this.getClientHistory(row.id);
                console.log(`   History: ${history.length} records`);
                
                const ltv = await this.getClientLTV(row.id);
                console.log(`   LTV: €${ltv}`);
                
                const nameParts = row.name?.split(' ') || [];
                const avatar = nameParts.length >= 2 
                    ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
                    : (nameParts[0]?.[0] || '?').toUpperCase();
                
                clients.push({
                    id: row.id,
                    name: row.name || 'Sem nome',
                    phone: row.phone,
                    email: row.email,
                    ltv: `€${ltv.toFixed(0)}`,
                    avatar,
                    vehicles,
                    history  // 👈 This should now have data
                });
                
                console.log(`   ✅ Client added with ${history.length} history records`);
            } catch (error) {
                console.error(`❌ Error processing client ${row.id}:`, error);
                // Still add the client but with empty history
                const nameParts = row.name?.split(' ') || [];
                const avatar = nameParts.length >= 2 
                    ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
                    : (nameParts[0]?.[0] || '?').toUpperCase();
                
                clients.push({
                    id: row.id,
                    name: row.name || 'Sem nome',
                    phone: row.phone || 'N/A',
                    email: row.email || '',
                    ltv: '€0',
                    avatar,
                    vehicles: [],
                    history: []
                });
            }
        }
        
        console.log(`\n✅ Final: ${clients.length} clients loaded`);
        if (clients.length > 0) {
            console.log(`📊 First client "${clients[0].name}": ${clients[0].history.length} history records`);
        }
        
        return clients;
    }
    
    static async getClientById(clientId: number): Promise<Client | null> {
        const query = `
            SELECT 
                id,
                first_name || ' ' || last_name as name,
                COALESCE(phone, 'N/A') as phone,
                email
            FROM users
            WHERE id = $1
        `;
        
        const result = await server.query(query, [clientId]);
        
        if (result.rows.length === 0) return null;
        
        const row = result.rows[0];
        const vehicles = await this.getClientVehicles(clientId);
        const history = await this.getClientHistory(clientId);
        const ltv = await this.getClientLTV(clientId);
        
        const nameParts = row.name?.split(' ') || [];
        const avatar = nameParts.length >= 2 
            ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
            : (nameParts[0]?.[0] || '?').toUpperCase();
        
        return {
            id: row.id,
            name: row.name,
            phone: row.phone,
            email: row.email,
            ltv: `€${ltv.toFixed(0)}`,
            avatar,
            vehicles,
            history
        };
    }
    
    private static async getClientVehicles(userId: number): Promise<Vehicle[]> {
        const query = `
            SELECT 
                id,
                license_plate as plate,
                model,
                brand,
                COALESCE(year, EXTRACT(YEAR FROM NOW())::int) as year,
                size_category,
                'N/A' as color
            FROM user_vehicles
            WHERE user_id = $1
            ORDER BY id
        `;
        
        const result = await server.query(query, [userId]);
        return result.rows;
    }
    
    private static async getClientHistory(userId: number): Promise<HistoryRecord[]> {
        try {
            const query = `
                -- Marcações do cliente (bookings)
                SELECT 
                    b.id,
                    b.vehicle_id::int as "vehicleId",
                    b.booking_date::text as date,
                    s.name as service,
                    b.status,
                    CASE 
                        WHEN v.size_category = 'Small' THEN s.price_ab
                        WHEN v.size_category = 'Large' THEN s.price_de
                        ELSE s.price_c
                    END as price
                FROM bookings b
                JOIN services s ON b.service_id = s.id
                JOIN user_vehicles v ON b.vehicle_id = v.id
                WHERE b.user_id = $1

                UNION ALL

                -- Serviços da oficina (workshop_services)
                SELECT 
                    ws.id,
                    ws.vehicle_id::int as "vehicleId",
                    ws.entry_date::text as date,
                    ws.service_type as service,
                    ws.status,
                    COALESCE(ws.total_value, ws.estimated_value, 0) as price
                FROM workshop_services ws
                WHERE ws.client_id = $1

                ORDER BY date DESC
                LIMIT 20
            `;
            
            const result = await server.query(query, [userId]);
            
            console.log(`📊 getClientHistory for user ${userId}: ${result.rows.length} records`);
            if (result.rows.length > 0) {
                console.log('📊 First record:', JSON.stringify(result.rows[0]));
            } else {
                console.log('⚠️ No history records found!');
            }
            
            // 🔍 Ensure the data is properly typed
            return result.rows.map(row => ({
                id: row.id,
                vehicleId: row.vehicleId,
                date: row.date,
                service: row.service,
                status: row.status,
                price: typeof row.price === 'string' ? parseFloat(row.price) : row.price
            }));
        } catch (error) {
            console.error(`❌ Error in getClientHistory for user ${userId}:`, error);
            return []; // Return empty array on error instead of crashing
        }
    }
    
    private static async getClientLTV(userId: number): Promise<number> {
        const query = `
            SELECT COALESCE(SUM(
                CASE 
                    WHEN v.size_category = 'P' THEN s.price_ab
                    WHEN v.size_category = 'G' THEN s.price_de
                    ELSE s.price_c
                END
            ), 0) as total
            FROM bookings b
            JOIN services s ON b.service_id = s.id
            JOIN user_vehicles v ON b.vehicle_id = v.id
            WHERE b.user_id = $1 AND b.status = 'CONCLUIDO'
        `;
        
        const result = await server.query(query, [userId]);
        return parseFloat(result.rows[0]?.total || '0');
    }
    
    static async addClient(firstName: string, lastName: string, email: string, phone: string): Promise<number> {
        const query = `
            INSERT INTO users (first_name, last_name, email, phone, password_hash, is_verified, is_active, role)
            VALUES ($1, $2, $3, $4, 'CLIENT_NO_PASSWORD', true, true, 'customer')
            RETURNING id
        `;
        
        const result = await server.query(query, [firstName, lastName, email.toLowerCase(), phone]);
        return result.rows[0].id;
    }
    
    static async addVehicle(userId: number, plate: string, brand: string, model: string, year: number, sizeCategory: string): Promise<number> {
        const query = `
            INSERT INTO user_vehicles (user_id, license_plate, brand, model, year, size_category)
            VALUES ($1, $2, $3, $4, $5, $6)
            ON CONFLICT (user_id, license_plate) DO NOTHING
            RETURNING id
        `;
        
        const result = await server.query(query, [userId, plate.toUpperCase(), brand, model, year, sizeCategory]);
        return result.rows[0]?.id || 0;
    }
}

export default CRMManager;