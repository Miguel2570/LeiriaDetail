// api/src/Portfolio/PortfolioManager.ts
import { server } from '../Helpers/DatabaseConnectionHelper';
import { PortfolioItem, PortfolioOutputModel } from './PortfolioModel';

class PortfolioManager {
    
    static async GetAll(): Promise<PortfolioOutputModel> {
        try {
            const query = `
                SELECT p.*, 
                       COALESCE(json_agg(
                           json_build_object('id', pi.id, 'url', pi.image_url, 'type', pi.type)
                           ORDER BY pi.sort_order
                       ) FILTER (WHERE pi.id IS NOT NULL), '[]') as gallery_images
                FROM portfolio p
                LEFT JOIN portfolio_images pi ON p.id = pi.portfolio_id
                GROUP BY p.id
                ORDER BY p.is_featured DESC, p.created_at DESC
            `;
            const result = await server.query(query);
            return new PortfolioOutputModel(result.rows, "Portfólio carregado.");
        } catch (error: any) {
            return new PortfolioOutputModel(undefined, "Erro ao carregar portfólio.", {
                Field: "Server", Message: error?.message
            });
        }
    }

    static async Add(data: any): Promise<PortfolioOutputModel> {
        try {
            await server.query('BEGIN');
            
            const portfolioQuery = `
                INSERT INTO portfolio (title, description, category, image_url, before_image_url, after_image_url, is_featured)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING *
            `;
            const portfolioResult = await server.query(portfolioQuery, [
                data.title, data.description, data.category,
                data.imageUrl, data.beforeImageUrl || null, data.afterImageUrl || null,
                data.isFeatured || false
            ]);
            const portfolioId = portfolioResult.rows[0].id;
            
            if (data.galleryImages) {
                const images = typeof data.galleryImages === 'string' 
                    ? JSON.parse(data.galleryImages) 
                    : data.galleryImages;
                    
                for (let i = 0; i < images.length; i++) {
                    await server.query(
                        `INSERT INTO portfolio_images (portfolio_id, image_url, type, sort_order) VALUES ($1, $2, $3, $4)`,
                        [portfolioId, images[i].url, images[i].type || 'gallery', i]
                    );
                }
            }
            
            await server.query('COMMIT');
            return new PortfolioOutputModel([portfolioResult.rows[0]], "Item adicionado.");
        } catch (error: any) {
            await server.query('ROLLBACK');
            return new PortfolioOutputModel(undefined, "Erro ao adicionar.", {
                Field: "Server", Message: error?.message
            });
        }
    }

    static async Update(id: number, data: any): Promise<PortfolioOutputModel> {
        try {
            await server.query('BEGIN');
            
            const portfolioQuery = `
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
            const portfolioResult = await server.query(portfolioQuery, [
                data.title || null, data.description || null, data.category || null,
                data.imageUrl || null, data.beforeImageUrl || null, data.afterImageUrl || null,
                data.isFeatured, id
            ]);
            
            // Apagar imagens antigas e reinserir
            await server.query('DELETE FROM portfolio_images WHERE portfolio_id = $1', [id]);
            
            if (data.galleryImages) {
                const images = typeof data.galleryImages === 'string' 
                    ? JSON.parse(data.galleryImages) 
                    : data.galleryImages;
                    
                for (let i = 0; i < images.length; i++) {
                    await server.query(
                        `INSERT INTO portfolio_images (portfolio_id, image_url, type, sort_order) VALUES ($1, $2, $3, $4)`,
                        [id, images[i].url, images[i].type || 'gallery', i]
                    );
                }
            }
            
            await server.query('COMMIT');
            return new PortfolioOutputModel([portfolioResult.rows[0]], "Item atualizado.");
        } catch (error: any) {
            await server.query('ROLLBACK');
            return new PortfolioOutputModel(undefined, "Erro ao atualizar.", {
                Field: "Server", Message: error?.message
            });
        }
    }

    static async Delete(id: number): Promise<PortfolioOutputModel> {
        try {
            await server.query('DELETE FROM portfolio_images WHERE portfolio_id = $1', [id]);
            await server.query('DELETE FROM portfolio WHERE id = $1', [id]);
            return new PortfolioOutputModel([], "Item removido.");
        } catch (error: any) {
            return new PortfolioOutputModel(undefined, "Erro ao remover.", {
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
}

export default PortfolioManager;