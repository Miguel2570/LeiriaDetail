import { server } from '../Helpers/DatabaseConnectionHelper';
import { PortfolioItem, PortfolioOutputModel } from './PortfolioModel';

class PortfolioManager {
    
    static async GetAll(): Promise<PortfolioOutputModel> {
        try {
            const query = 'SELECT * FROM portfolio ORDER BY is_featured DESC, created_at DESC';
            const result = await server.query(query);
            return new PortfolioOutputModel(result.rows, "Portfólio carregado.");
        } catch (error: any) {
            return new PortfolioOutputModel(undefined, "Erro ao carregar portfólio.", {
                Field: "Server", Message: error?.message
            });
        }
    }

    static async GetByCategory(category: string): Promise<PortfolioOutputModel> {
        try {
            const query = 'SELECT * FROM portfolio WHERE category = $1 ORDER BY created_at DESC';
            const result = await server.query(query, [category]);
            return new PortfolioOutputModel(result.rows, `Categoria: ${category}`);
        } catch (error: any) {
            return new PortfolioOutputModel(undefined, "Erro ao carregar portfólio.", {
                Field: "Server", Message: error?.message
            });
        }
    }

    static async GetCategories(): Promise<PortfolioOutputModel> {
        try {
            const query = 'SELECT DISTINCT category FROM portfolio ORDER BY category';
            const result = await server.query(query);
            return new PortfolioOutputModel(result.rows, "Categorias carregadas.");
        } catch (error: any) {
            return new PortfolioOutputModel(undefined, "Erro ao carregar categorias.", {
                Field: "Server", Message: error?.message
            });
        }
    }

    static async Add(data: any): Promise<PortfolioOutputModel> {
        try {
            const query = `
                INSERT INTO portfolio (title, description, category, image_url, before_image_url, after_image_url, is_featured)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING *
            `;
            const result = await server.query(query, [
                data.title, data.description, data.category,
                data.imageUrl, data.beforeImageUrl || null, data.afterImageUrl || null,
                data.isFeatured || false
            ]);
            return new PortfolioOutputModel([result.rows[0]], "Item adicionado.");
        } catch (error: any) {
            return new PortfolioOutputModel(undefined, "Erro ao adicionar.", {
                Field: "Server", Message: error?.message
            });
        }
    }

    static async Update(id: number, data: any): Promise<PortfolioOutputModel> {
        try {
            const query = `
                UPDATE portfolio SET
                    title = COALESCE($1, title),
                    description = COALESCE($2, description),
                    category = COALESCE($3, category),
                    image_url = COALESCE($4, image_url),
                    before_image_url = COALESCE($5, before_image_url),
                    after_image_url = COALESCE($6, after_image_url),
                    is_featured = COALESCE($7, is_featured)
                WHERE id = $8 RETURNING *
            `;
            const result = await server.query(query, [
                data.title || null, data.description || null, data.category || null,
                data.imageUrl || null, data.beforeImageUrl || null, data.afterImageUrl || null,
                data.isFeatured, id
            ]);
            return new PortfolioOutputModel([result.rows[0]], "Item atualizado.");
        } catch (error: any) {
            return new PortfolioOutputModel(undefined, "Erro ao atualizar.", {
                Field: "Server", Message: error?.message
            });
        }
    }

    static async Delete(id: number): Promise<PortfolioOutputModel> {
        try {
            await server.query('DELETE FROM portfolio WHERE id = $1', [id]);
            return new PortfolioOutputModel([], "Item removido.");
        } catch (error: any) {
            return new PortfolioOutputModel(undefined, "Erro ao remover.", {
                Field: "Server", Message: error?.message
            });
        }
    }
}

export default PortfolioManager;