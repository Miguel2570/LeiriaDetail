import { server } from '../Helpers/DatabaseConnectionHelper';
import { Review, ReviewOutputModel } from './ReviewModel';

class ReviewManager {
    
    static async GetApproved(): Promise<ReviewOutputModel> {
        try {
            const query = 'SELECT * FROM reviews WHERE is_approved = true ORDER BY created_at DESC';
            const result = await server.query(query);
            return new ReviewOutputModel(result.rows, "Reviews carregadas.");
        } catch (error: any) {
            return new ReviewOutputModel(undefined, "Erro ao carregar reviews.", {
                Field: "Server", Message: error?.message
            });
        }
    }

    static async Add(data: Review): Promise<ReviewOutputModel> {
        try {
            const query = `
                INSERT INTO reviews (name, car, text, rating)
                VALUES ($1, $2, $3, $4)
                RETURNING *
            `;
            const result = await server.query(query, [data.name, data.car, data.text, data.rating || 5]);
            return new ReviewOutputModel([result.rows[0]], "Review adicionada.");
        } catch (error: any) {
            return new ReviewOutputModel(undefined, "Erro ao adicionar.", {
                Field: "Server", Message: error?.message
            });
        }
    }
}

export default ReviewManager;