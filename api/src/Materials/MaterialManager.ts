import { server } from '../Helpers/DatabaseConnectionHelper';
import { MaterialOutputModel } from './MaterialModel';

class MaterialManager {
    static async GetAll(): Promise<MaterialOutputModel> {
        try {
            const materialsQuery = 'SELECT * FROM materials WHERE is_active = true ORDER BY order_index ASC';
            const categoriesQuery = 'SELECT DISTINCT category FROM materials WHERE is_active = true ORDER BY category';
            
            const [materials, categories] = await Promise.all([
                server.query(materialsQuery),
                server.query(categoriesQuery)
            ]);
            
            return new MaterialOutputModel(
                materials.rows,
                categories.rows.map((c: any) => c.category),
                "Materiais carregados."
            );
        } catch (error: any) {
            return new MaterialOutputModel(undefined, undefined, "Erro.");
        }
    }
}

export default MaterialManager;