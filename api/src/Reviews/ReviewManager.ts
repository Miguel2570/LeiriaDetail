// api/src/Reviews/ReviewManager.ts
import { server } from '../Helpers/DatabaseConnectionHelper';
import { Review, ReviewOutputModel } from './ReviewModel';
import crypto from 'crypto';

class ReviewManager {
    
    static async GetApproved(): Promise<ReviewOutputModel> {
        try {
            const query = 'SELECT * FROM reviews WHERE is_approved = true AND submitted = true ORDER BY created_at DESC';
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

    /**
     * ✅ Criar convite de review após conclusão do serviço
     */
    static async CreateReviewInvite(bookingId: number, userId: number, userName: string, car: string): Promise<ReviewOutputModel> {
        try {
            const token = crypto.randomUUID();
            
            const query = `
                INSERT INTO reviews (name, car, text, rating, booking_id, user_id, token, submitted, is_approved)
                VALUES ($1, $2, '', 5, $3, $4, $5, false, false)
                RETURNING *
            `;
            const result = await server.query(query, [userName, car, bookingId, userId, token]);
            return new ReviewOutputModel([result.rows[0]], "Convite de review criado.", undefined);
        } catch (error: any) {
            return new ReviewOutputModel(undefined, "Erro ao criar convite.", {
                Field: "Server", Message: error?.message
            });
        }
    }

    /**
     * ✅ Submeter review pelo token (link do email)
     */
    static async SubmitByToken(token: string, text: string, rating: number): Promise<ReviewOutputModel> {
        try {
            const query = `
                UPDATE reviews 
                SET text = $1, rating = $2, submitted = true, is_approved = true, created_at = NOW()
                WHERE token = $3 AND submitted = false
                RETURNING *
            `;
            const result = await server.query(query, [text, rating, token]);
            
            if (result.rows.length === 0) {
                return new ReviewOutputModel(undefined, "Token inválido ou review já submetida.", {
                    Field: "Token", Message: "Token inválido ou expirado."
                });
            }
            
            return new ReviewOutputModel([result.rows[0]], "Review submetida com sucesso!", undefined);
        } catch (error: any) {
            return new ReviewOutputModel(undefined, "Erro ao submeter review.", {
                Field: "Server", Message: error?.message
            });
        }
    }

    /**
     * ✅ Obter review por token (para a página de submit)
     */
    static async GetByToken(token: string): Promise<ReviewOutputModel> {
        try {
            const query = 'SELECT * FROM reviews WHERE token = $1';
            const result = await server.query(query, [token]);
            
            if (result.rows.length === 0) {
                return new ReviewOutputModel(undefined, "Token não encontrado.", {
                    Field: "Token", Message: "Token inválido."
                });
            }
            
            return new ReviewOutputModel(result.rows, "Review carregada.");
        } catch (error: any) {
            return new ReviewOutputModel(undefined, "Erro ao carregar.", {
                Field: "Server", Message: error?.message
            });
        }
    }
}

export default ReviewManager;