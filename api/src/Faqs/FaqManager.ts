import { server } from '../Helpers/DatabaseConnectionHelper';
import { Faq, FaqOutputModel } from './FaqModel';

class FaqManager {
    static async GetAll(): Promise<FaqOutputModel> {
        try {
            const query = 'SELECT * FROM faqs WHERE is_active = true ORDER BY order_index ASC';
            const result = await server.query(query);
            return new FaqOutputModel(result.rows, "FAQs carregadas.");
        } catch (error: any) {
            return new FaqOutputModel(undefined, "Erro.");
        }
    }
}

export default FaqManager;