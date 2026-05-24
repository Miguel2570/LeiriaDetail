import { server } from '../Helpers/DatabaseConnectionHelper';
import { Vehicle, VehicleOutputModel } from './VehicleModel';

class VehicleManager {
    
    static async addVehicle(data: Vehicle): Promise<VehicleOutputModel> {
        const normalizedPlate = data.license_plate.toUpperCase().trim().replace(/\s/g, '');
        
        // Verifica se já existe
        const checkQuery = 'SELECT id FROM user_vehicles WHERE user_id = $1 AND license_plate = $2';
        const existing = await server.query(checkQuery, [data.user_id, normalizedPlate]);
        
        if (existing.rows.length > 0) {
            return new VehicleOutputModel(undefined, undefined, {
                Field: "license_plate",
                Message: "Esta matrícula já está registada."
            });
        }
        
        try {
            // Se for o primeiro veículo, define como primário
            const countQuery = 'SELECT COUNT(*) as count FROM user_vehicles WHERE user_id = $1';
            const countResult = await server.query(countQuery, [data.user_id]);
            const isFirstVehicle = parseInt(countResult.rows[0].count) === 0;
            
            const insertQuery = `
                INSERT INTO user_vehicles (user_id, license_plate, brand, model, year, fuel_type, size_category, vin, is_primary)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                RETURNING *
            `;
            
            const result = await server.query(insertQuery, [
                data.user_id,
                normalizedPlate,
                data.brand,
                data.model,
                data.year || null,
                data.fuel_type || null,
                data.size_category || 'C',
                data.vin || null,
                isFirstVehicle
            ]);
            
            return new VehicleOutputModel(result.rows[0]);
        } catch (error) {
            console.error('Error adding vehicle:', error);
            return new VehicleOutputModel(undefined, undefined, {
                Field: "Server",
                Message: "Erro ao adicionar veículo."
            });
        }
    }
    
    static async getUserVehicles(userId: number): Promise<VehicleOutputModel> {
        try {
            const query = 'SELECT * FROM user_vehicles WHERE user_id = $1 ORDER BY is_primary DESC, created_at DESC';
            const result = await server.query(query, [userId]);
            
            return new VehicleOutputModel(undefined, result.rows);
        } catch (error) {
            console.error('Error fetching vehicles:', error);
            return new VehicleOutputModel(undefined, undefined, {
                Field: "Server",
                Message: "Erro ao buscar veículos."
            });
        }
    }
    
    static async setPrimaryVehicle(userId: number, vehicleId: number): Promise<VehicleOutputModel> {
        try {
            await server.query('BEGIN');
            
            // Remove primary de todos
            await server.query('UPDATE user_vehicles SET is_primary = false WHERE user_id = $1', [userId]);
            
            // Define o novo primary
            const query = 'UPDATE user_vehicles SET is_primary = true, updated_at = NOW() WHERE id = $1 AND user_id = $2 RETURNING *';
            const result = await server.query(query, [vehicleId, userId]);
            
            await server.query('COMMIT');
            
            if (result.rows.length === 0) {
                return new VehicleOutputModel(undefined, undefined, {
                    Field: "vehicle",
                    Message: "Veículo não encontrado."
                });
            }
            
            return new VehicleOutputModel(result.rows[0]);
        } catch (error) {
            await server.query('ROLLBACK');
            console.error('Error setting primary vehicle:', error);
            return new VehicleOutputModel(undefined, undefined, {
                Field: "Server",
                Message: "Erro ao definir veículo principal."
            });
        }
    }
    
    static async deleteVehicle(userId: number, vehicleId: number): Promise<{ success: boolean; error?: string }> {
        try {
            const result = await server.query(
                'DELETE FROM user_vehicles WHERE id = $1 AND user_id = $2 RETURNING id',
                [vehicleId, userId]
            );
            
            if (result.rows.length === 0) {
                return { success: false, error: "Veículo não encontrado." };
            }
            
            return { success: true };
        } catch (error) {
            console.error('Error deleting vehicle:', error);
            return { success: false, error: "Erro ao remover veículo." };
        }
    }
    
    static async updateVehicle(vehicleId: number, userId: number, data: Partial<Vehicle>): Promise<VehicleOutputModel> {
        try {
            const query = `
                UPDATE user_vehicles 
                SET brand = COALESCE($1, brand),
                    model = COALESCE($2, model),
                    year = COALESCE($3, year),
                    fuel_type = COALESCE($4, fuel_type),
                    size_category = COALESCE($5, size_category),
                    vin = COALESCE($6, vin),
                    updated_at = NOW()
                WHERE id = $7 AND user_id = $8
                RETURNING *
            `;
            
            const result = await server.query(query, [
                data.brand,
                data.model,
                data.year,
                data.fuel_type,
                data.size_category,
                data.vin,
                vehicleId,
                userId
            ]);
            
            if (result.rows.length === 0) {
                return new VehicleOutputModel(undefined, undefined, {
                    Field: "vehicle",
                    Message: "Veículo não encontrado."
                });
            }
            
            return new VehicleOutputModel(result.rows[0]);
        } catch (error) {
            return new VehicleOutputModel(undefined, undefined, {
                Field: "Server",
                Message: "Erro ao atualizar veículo."
            });
        }
    }
}

export default VehicleManager;