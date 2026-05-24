import { server } from '../Helpers/DatabaseConnectionHelper';
import { Service, ServiceOutputModel } from './ServiceModel';

class ServiceManager {

    /**
     * Listar todos os serviços disponíveis
     */
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

    /**
     * Obter serviço por ID
     */
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

    /**
     * Obter serviços por pack (Básico ou Premium)
     */
    static async GetServicesByPack(pack: 'Basico' | 'Premium'): Promise<ServiceOutputModel> {
        try {
            const query = "SELECT * FROM services WHERE name ILIKE $1 ORDER BY id ASC";
            const result = await server.query(query, [`%Pack ${pack}%`]);
            
            return new ServiceOutputModel(result.rows, `Serviços ${pack} carregados.`);
        } catch (error: any) {
            return new ServiceOutputModel(undefined, "Erro ao carregar serviços.", {
                Field: "Server",
                Message: error?.message ?? "Internal Server Error"
            });
        }
    }
}

export default ServiceManager;