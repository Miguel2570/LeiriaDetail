import { server } from '../Helpers/DatabaseConnectionHelper';
import { Service, ServiceOutputModel } from './ServiceModel';

class ServiceManager {

    static async GetAllServices(): Promise<ServiceOutputModel> {
        try {
            const query = 'SELECT * FROM services ORDER BY id ASC';
            const result = await server.query(query);
            return new ServiceOutputModel(result.rows, "Serviços carregados com sucesso.");
        } catch (error: any) {
            console.error('Error fetching services:', error);
            return new ServiceOutputModel(undefined, "Erro ao carregar serviços.", {
                Field: "Server",
                Message: error?.message ?? "Internal Server Error"
            });
        }
    }

    static async GetServiceById(id: number): Promise<ServiceOutputModel> {
        try {
            const query = 'SELECT * FROM services WHERE id = $1';
            const result = await server.query(query, [id]);
            
            if (result.rows.length === 0) {
                return new ServiceOutputModel(undefined, "Serviço não encontrado.", {
                    Field: "id",
                    Message: "Serviço não encontrado."
                });
            }
            
            return new ServiceOutputModel([result.rows[0]], "Serviço encontrado.");
        } catch (error: any) {
            return new ServiceOutputModel(undefined, "Erro ao buscar serviço.", {
                Field: "Server",
                Message: error?.message ?? "Internal Server Error"
            });
        }
    }

    static async GetServicesByPack(pack: string): Promise<ServiceOutputModel> {
        try {
            const query = "SELECT * FROM services WHERE pack_type = $1 ORDER BY id ASC";
            const result = await server.query(query, [pack]);
            return new ServiceOutputModel(result.rows, `Serviços ${pack} carregados.`);
        } catch (error: any) {
            return new ServiceOutputModel(undefined, "Erro ao carregar serviços.", {
                Field: "Server",
                Message: error?.message ?? "Internal Server Error"
            });
        }
    }

    static async CreateService(service: Service): Promise<ServiceOutputModel> {
        try {
            const query = `
                INSERT INTO services (name, description, price_ab, price_c, price_de, duration_minutes, pack_type)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING *
            `;
            const result = await server.query(query, [
                service.name,
                service.description || null,
                service.price_ab,
                service.price_c,
                service.price_de,
                service.duration_minutes || 60,
                service.pack_type || 'Básico'
            ]);
            return new ServiceOutputModel([result.rows[0]], "Serviço criado com sucesso.");
        } catch (error: any) {
            return new ServiceOutputModel(undefined, "Erro ao criar serviço.", {
                Field: "Server",
                Message: error?.message ?? "Internal Server Error"
            });
        }
    }

    static async UpdateService(id: number, service: Partial<Service>): Promise<ServiceOutputModel> {
        try {
            const query = `
                UPDATE services 
                SET name = COALESCE($1, name),
                    description = COALESCE($2, description),
                    price_ab = COALESCE($3, price_ab),
                    price_c = COALESCE($4, price_c),
                    price_de = COALESCE($5, price_de),
                    duration_minutes = COALESCE($6, duration_minutes),
                    pack_type = COALESCE($7, pack_type)
                WHERE id = $8 
                RETURNING *
            `;
            const result = await server.query(query, [
                service.name || null,
                service.description || null,
                service.price_ab || null,
                service.price_c || null,
                service.price_de || null,
                service.duration_minutes || null,
                service.pack_type || null,
                id
            ]);
            
            if (result.rows.length === 0) {
                return new ServiceOutputModel(undefined, "Serviço não encontrado.", {
                    Field: "id",
                    Message: "Serviço não encontrado."
                });
            }
            
            return new ServiceOutputModel([result.rows[0]], "Serviço atualizado com sucesso.");
        } catch (error: any) {
            return new ServiceOutputModel(undefined, "Erro ao atualizar serviço.", {
                Field: "Server",
                Message: error?.message ?? "Internal Server Error"
            });
        }
    }

    static async DeleteService(id: number): Promise<ServiceOutputModel> {
        try {
            const query = 'DELETE FROM services WHERE id = $1 RETURNING id';
            const result = await server.query(query, [id]);
            
            if (result.rows.length === 0) {
                return new ServiceOutputModel(undefined, "Serviço não encontrado.", {
                    Field: "id",
                    Message: "Serviço não encontrado."
                });
            }
            
            return new ServiceOutputModel(undefined, "Serviço eliminado com sucesso.");
        } catch (error: any) {
            return new ServiceOutputModel(undefined, "Erro ao eliminar serviço.", {
                Field: "Server",
                Message: error?.message ?? "Internal Server Error"
            });
        }
    }
}

export default ServiceManager;