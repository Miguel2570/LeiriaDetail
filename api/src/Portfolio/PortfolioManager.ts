// src/Portfolio/PortfolioManager.ts
import { server } from '../Helpers/DatabaseConnectionHelper';
import { PortfolioItem, PortfolioOutputModel } from './PortfolioModel';
import FileManager from '../File/FileManager';

class PortfolioManager {
    
    /**
     * Lista todos os itens do portfólio com imagens em base64
     */
    static async GetAll(): Promise<PortfolioOutputModel> {
        try {
            const query = `
                SELECT 
                    p.*,
                    COALESCE(json_agg(
                        json_build_object(
                            'id', pi.id,
                            'fileId', pi.file_id,
                            'type', pi.type,
                            'sortOrder', pi.sort_order
                        )
                        ORDER BY pi.sort_order
                    ) FILTER (WHERE pi.id IS NOT NULL), '[]') as gallery_images
                FROM portfolio p
                LEFT JOIN portfolio_images pi ON p.id = pi.portfolio_id
                GROUP BY p.id
                ORDER BY p.is_featured DESC, p.created_at DESC
            `;
            const result = await server.query(query);
            
            // Para cada item, carregar as imagens em base64
            const items = await Promise.all(
                result.rows.map(async (row: any) => {
                    const item: PortfolioItem = {
                        id: row.id,
                        title: row.title,
                        description: row.description,
                        category: row.category,
                        mainImageFileId: row.main_image_file_id,
                        beforeImageFileId: row.before_image_file_id,
                        afterImageFileId: row.after_image_file_id,
                        is_featured: row.is_featured,
                        created_at: row.created_at,
                        galleryImages: []
                    };
                    
                    // Carregar imagem principal
                    if (row.main_image_file_id) {
                        const fileResult = await FileManager.GetFileById(row.main_image_file_id);
                        if (fileResult.File) {
                            item.mainImageData = fileResult.File.FileData;
                        }
                    }
                    
                    // Carregar imagem antes
                    if (row.before_image_file_id) {
                        const fileResult = await FileManager.GetFileById(row.before_image_file_id);
                        if (fileResult.File) {
                            item.beforeImageData = fileResult.File.FileData;
                        }
                    }
                    
                    // Carregar imagem depois
                    if (row.after_image_file_id) {
                        const fileResult = await FileManager.GetFileById(row.after_image_file_id);
                        if (fileResult.File) {
                            item.afterImageData = fileResult.File.FileData;
                        }
                    }
                    
                    // Carregar galeria
                    const galleryImages = row.gallery_images || [];
                    for (const gi of galleryImages) {
                        if (gi.fileId) {
                            const fileResult = await FileManager.GetFileById(gi.fileId);
                            if (fileResult.File) {
                                item.galleryImages?.push({
                                    id: gi.id,
                                    fileId: gi.fileId,
                                    fileData: fileResult.File.FileData,
                                    fileName: fileResult.File.FileName,
                                    fileExtension: fileResult.File.FileExtension,
                                    type: gi.type || 'gallery',
                                    sortOrder: gi.sortOrder || 0
                                });
                            }
                        }
                    }
                    
                    return item;
                })
            );
            
            return new PortfolioOutputModel(items, "Portfólio carregado.");
        } catch (error: any) {
            console.error("❌ GetAll error:", error);
            return new PortfolioOutputModel(undefined, "Erro ao carregar portfólio.", {
                Field: "Server", Message: error?.message
            });
        }
    }

    /**
     * Adiciona novo item ao portfólio (com upload de imagens)
     */
    static async Add(data: any, createUser: string): Promise<PortfolioOutputModel> {
        try {
            await server.query('BEGIN');
            
            let mainImageFileId: string | null = null;
            let beforeImageFileId: string | null = null;
            let afterImageFileId: string | null = null;
            
            // Fazer upload da imagem principal
            if (data.mainImageData) {
                const fileResult = await FileManager.CreateFile(
                    data.mainImageData,
                    `portfolio_main_${Date.now()}`,
                    data.mainImageSize || 0,
                    data.mainImageExtension || 'jpg',
                    createUser,
                    'portfolio',
                    undefined,
                    ['main', data.category]
                );
                if (fileResult.File) {
                    mainImageFileId = fileResult.File.Id;
                }
            }
            
            // Fazer upload da imagem antes
            if (data.beforeImageData) {
                const fileResult = await FileManager.CreateFile(
                    data.beforeImageData,
                    `portfolio_before_${Date.now()}`,
                    data.beforeImageSize || 0,
                    data.beforeImageExtension || 'jpg',
                    createUser,
                    'portfolio',
                    undefined,
                    ['before', data.category]
                );
                if (fileResult.File) {
                    beforeImageFileId = fileResult.File.Id;
                }
            }
            
            // Fazer upload da imagem depois
            if (data.afterImageData) {
                const fileResult = await FileManager.CreateFile(
                    data.afterImageData,
                    `portfolio_after_${Date.now()}`,
                    data.afterImageSize || 0,
                    data.afterImageExtension || 'jpg',
                    createUser,
                    'portfolio',
                    undefined,
                    ['after', data.category]
                );
                if (fileResult.File) {
                    afterImageFileId = fileResult.File.Id;
                }
            }
            
            // Inserir na tabela portfolio
            const portfolioQuery = `
                INSERT INTO portfolio (title, description, category, main_image_file_id, before_image_file_id, after_image_file_id, is_featured)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING *
            `;
            const portfolioResult = await server.query(portfolioQuery, [
                data.title,
                data.description || null,
                data.category,
                mainImageFileId,
                beforeImageFileId,
                afterImageFileId,
                data.isFeatured || false
            ]);
            const portfolioId = portfolioResult.rows[0].id;
            
            // Fazer upload das imagens da galeria
            if (data.galleryImages && Array.isArray(data.galleryImages)) {
                for (let i = 0; i < data.galleryImages.length; i++) {
                    const img = data.galleryImages[i];
                    if (img.fileData) {
                        const fileResult = await FileManager.CreateFile(
                            img.fileData,
                            `portfolio_gallery_${portfolioId}_${i}`,
                            img.fileSize || 0,
                            img.fileExtension || 'jpg',
                            createUser,
                            'portfolio_gallery',
                            portfolioId,
                            ['gallery', data.category]
                        );
                        
                        if (fileResult.File) {
                            await server.query(
                                `INSERT INTO portfolio_images (portfolio_id, file_id, type, sort_order) VALUES ($1, $2, $3, $4)`,
                                [portfolioId, fileResult.File.Id, img.type || 'gallery', i]
                            );
                        }
                    }
                }
            }
            
            await server.query('COMMIT');
            return new PortfolioOutputModel([portfolioResult.rows[0]], "Item adicionado.");
        } catch (error: any) {
            await server.query('ROLLBACK');
            console.error("❌ Add error:", error);
            return new PortfolioOutputModel(undefined, "Erro ao adicionar.", {
                Field: "Server", Message: error?.message
            });
        }
    }

    /**
     * Atualiza item do portfólio
     */
    static async Update(id: number, data: any, changeUser: string): Promise<PortfolioOutputModel> {
        try {
            await server.query('BEGIN');
            
            let mainImageFileId: string | null = data.mainImageFileId || null;
            let beforeImageFileId: string | null = data.beforeImageFileId || null;
            let afterImageFileId: string | null = data.afterImageFileId || null;
            
            // Se enviou nova imagem principal, faz upload
            if (data.mainImageData) {
                const fileResult = await FileManager.CreateFile(
                    data.mainImageData,
                    `portfolio_main_${id}_${Date.now()}`,
                    data.mainImageSize || 0,
                    data.mainImageExtension || 'jpg',
                    changeUser,
                    'portfolio',
                    id,
                    ['main', data.category]
                );
                if (fileResult.File) {
                    mainImageFileId = fileResult.File.Id;
                }
            }
            
            // Se enviou nova imagem antes, faz upload
            if (data.beforeImageData) {
                const fileResult = await FileManager.CreateFile(
                    data.beforeImageData,
                    `portfolio_before_${id}_${Date.now()}`,
                    data.beforeImageSize || 0,
                    data.beforeImageExtension || 'jpg',
                    changeUser,
                    'portfolio',
                    id,
                    ['before', data.category]
                );
                if (fileResult.File) {
                    beforeImageFileId = fileResult.File.Id;
                }
            }
            
            // Se enviou nova imagem depois, faz upload
            if (data.afterImageData) {
                const fileResult = await FileManager.CreateFile(
                    data.afterImageData,
                    `portfolio_after_${id}_${Date.now()}`,
                    data.afterImageSize || 0,
                    data.afterImageExtension || 'jpg',
                    changeUser,
                    'portfolio',
                    id,
                    ['after', data.category]
                );
                if (fileResult.File) {
                    afterImageFileId = fileResult.File.Id;
                }
            }
            
            const portfolioQuery = `
                UPDATE portfolio SET
                    title = COALESCE($1, title),
                    description = COALESCE($2, description),
                    category = COALESCE($3, category),
                    main_image_file_id = COALESCE($4, main_image_file_id),
                    before_image_file_id = COALESCE($5, before_image_file_id),
                    after_image_file_id = COALESCE($6, after_image_file_id),
                    is_featured = COALESCE($7, is_featured),
                    updated_at = NOW()
                WHERE id = $8 RETURNING *
            `;
            const portfolioResult = await server.query(portfolioQuery, [
                data.title || null,
                data.description || null,
                data.category || null,
                mainImageFileId,
                beforeImageFileId,
                afterImageFileId,
                data.isFeatured,
                id
            ]);
            
            // Se enviou novas imagens de galeria, substitui
            if (data.galleryImages && Array.isArray(data.galleryImages)) {
                // Remover imagens antigas da galeria
                const oldImages = await server.query(
                    'SELECT file_id FROM portfolio_images WHERE portfolio_id = $1',
                    [id]
                );
                
                // Apagar da tabela portfolio_images
                await server.query('DELETE FROM portfolio_images WHERE portfolio_id = $1', [id]);
                
                // Apagar os ficheiros antigos
                for (const oldImg of oldImages.rows) {
                    await FileManager.DeleteFile(oldImg.file_id, changeUser);
                }
                
                // Inserir novas imagens
                for (let i = 0; i < data.galleryImages.length; i++) {
                    const img = data.galleryImages[i];
                    if (img.fileData) {
                        const fileResult = await FileManager.CreateFile(
                            img.fileData,
                            `portfolio_gallery_${id}_${i}_${Date.now()}`,
                            img.fileSize || 0,
                            img.fileExtension || 'jpg',
                            changeUser,
                            'portfolio_gallery',
                            id,
                            ['gallery', data.category || '']
                        );
                        
                        if (fileResult.File) {
                            await server.query(
                                `INSERT INTO portfolio_images (portfolio_id, file_id, type, sort_order) VALUES ($1, $2, $3, $4)`,
                                [id, fileResult.File.Id, img.type || 'gallery', i]
                            );
                        }
                    }
                }
            }
            
            await server.query('COMMIT');
            return new PortfolioOutputModel([portfolioResult.rows[0]], "Item atualizado.");
        } catch (error: any) {
            await server.query('ROLLBACK');
            console.error("❌ Update error:", error);
            return new PortfolioOutputModel(undefined, "Erro ao atualizar.", {
                Field: "Server", Message: error?.message
            });
        }
    }

    /**
     * Remove item do portfólio
     */
    static async Delete(id: number, changeUser: string): Promise<PortfolioOutputModel> {
        try {
            await server.query('BEGIN');
            
            // Buscar IDs dos ficheiros para apagar
            const item = await server.query('SELECT * FROM portfolio WHERE id = $1', [id]);
            const images = await server.query('SELECT file_id FROM portfolio_images WHERE portfolio_id = $1', [id]);
            
            // Apagar ficheiros
            if (item.rows[0]?.main_image_file_id) {
                await FileManager.DeleteFile(item.rows[0].main_image_file_id, changeUser);
            }
            if (item.rows[0]?.before_image_file_id) {
                await FileManager.DeleteFile(item.rows[0].before_image_file_id, changeUser);
            }
            if (item.rows[0]?.after_image_file_id) {
                await FileManager.DeleteFile(item.rows[0].after_image_file_id, changeUser);
            }
            for (const img of images.rows) {
                await FileManager.DeleteFile(img.file_id, changeUser);
            }
            
            // Apagar registos
            await server.query('DELETE FROM portfolio_images WHERE portfolio_id = $1', [id]);
            await server.query('DELETE FROM portfolio WHERE id = $1', [id]);
            
            await server.query('COMMIT');
            return new PortfolioOutputModel([], "Item removido.");
        } catch (error: any) {
            await server.query('ROLLBACK');
            console.error("❌ Delete error:", error);
            return new PortfolioOutputModel(undefined, "Erro ao remover.", {
                Field: "Server", Message: error?.message
            });
        }
    }

    static async GetByCategory(category: string): Promise<PortfolioOutputModel> {
        try {
            const query = `
                SELECT * FROM portfolio 
                WHERE category = $1 
                ORDER BY is_featured DESC, created_at DESC
            `;
            const result = await server.query(query, [category]);
            return new PortfolioOutputModel(result.rows, `Categoria: ${category}`);
        } catch (error: any) {
            return new PortfolioOutputModel(undefined, "Erro ao carregar.", {
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