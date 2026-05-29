// src/Material/MaterialManager.ts
import { server } from '../Helpers/DatabaseConnectionHelper';
import { MaterialOutputModel, Material } from './MaterialModel';
import FileManager from '../File/FileManager';

class MaterialManager {
    
    static async GetAll(): Promise<MaterialOutputModel> {
        try {
            const materialsQuery = `
                SELECT m.*, f.FileExtension as image_extension
                FROM materials m
                LEFT JOIN File f ON m.image_file_id = f.Id
                WHERE m.is_active = true 
                ORDER BY m.order_index ASC
            `;
            const categoriesQuery = `
                SELECT DISTINCT category 
                FROM materials 
                WHERE is_active = true 
                ORDER BY category
            `;
            
            const [materialsResult, categoriesResult] = await Promise.all([
                server.query(materialsQuery),
                server.query(categoriesQuery)
            ]);
            
            // Carregar imagens em base64
            const materials = await Promise.all(
                materialsResult.rows.map(async (row: any) => {
                    const material: Material = {
                        id: row.id,
                        name: row.name,
                        description: row.description,
                        category: row.category,
                        brand: row.brand,
                        purchase_url: row.purchase_url,
                        image_file_id: row.image_file_id,
                        order_index: row.order_index
                    };
                    
                    // Se tem imagem, carregar em base64
                    if (row.image_file_id) {
                        const fileResult = await FileManager.GetFileById(row.image_file_id);
                        if (fileResult.File) {
                            material.image_data = fileResult.File.FileData;
                            material.image_extension = fileResult.File.FileExtension;
                        }
                    }
                    
                    return material;
                })
            );
            
            return new MaterialOutputModel(
                materials,
                categoriesResult.rows.map((c: any) => c.category),
                "Materiais carregados."
            );
        } catch (error: any) {
            console.error("❌ GetAll error:", error);
            return new MaterialOutputModel(undefined, undefined, "Erro ao carregar materiais.");
        }
    }

    static async Add(data: any, createUser: string): Promise<MaterialOutputModel> {
        try {
            let imageFileId: string | null = null;
            
            // Fazer upload da imagem se fornecida
            if (data.imageData) {
                const fileResult = await FileManager.CreateFile(
                    data.imageData,
                    `material_${data.name?.replace(/\s+/g, '_') || 'image'}`,
                    data.imageSize || 0,
                    data.imageExtension || 'jpg',
                    createUser,
                    'material',
                    undefined,
                    ['material', data.category || '']
                );
                if (fileResult.File) {
                    imageFileId = fileResult.File.Id;
                }
            }
            
            const query = `
                INSERT INTO materials (name, description, category, brand, purchase_url, image_file_id, order_index)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING *
            `;
            
            const result = await server.query(query, [
                data.name,
                data.description || null,
                data.category || null,
                data.brand || null,
                data.purchaseUrl || null,
                imageFileId,
                data.orderIndex || 0
            ]);
            
            return new MaterialOutputModel(
                [result.rows[0]],
                undefined,
                "Material adicionado."
            );
        } catch (error: any) {
            console.error("❌ Add error:", error);
            return new MaterialOutputModel(undefined, undefined, "Erro ao adicionar material.");
        }
    }

    static async Update(id: number, data: any, changeUser: string): Promise<MaterialOutputModel> {
        try {
            let imageFileId: string | null = data.imageFileId || null;
            
            // Se enviou nova imagem, faz upload
            if (data.imageData) {
                const fileResult = await FileManager.CreateFile(
                    data.imageData,
                    `material_${id}_${Date.now()}`,
                    data.imageSize || 0,
                    data.imageExtension || 'jpg',
                    changeUser,
                    'material',
                    id,
                    ['material', data.category || '']
                );
                if (fileResult.File) {
                    imageFileId = fileResult.File.Id;
                    
                    // Apagar imagem antiga se existir
                    const oldMaterial = await server.query(
                        'SELECT image_file_id FROM materials WHERE id = $1', [id]
                    );
                    if (oldMaterial.rows[0]?.image_file_id) {
                        await FileManager.DeleteFile(oldMaterial.rows[0].image_file_id, changeUser);
                    }
                }
            }
            
            const query = `
                UPDATE materials SET
                    name = COALESCE($1, name),
                    description = COALESCE($2, description),
                    category = COALESCE($3, category),
                    brand = COALESCE($4, brand),
                    purchase_url = COALESCE($5, purchase_url),
                    image_file_id = COALESCE($6, image_file_id),
                    order_index = COALESCE($7, order_index)
                WHERE id = $8 RETURNING *
            `;
            
            const result = await server.query(query, [
                data.name || null,
                data.description || null,
                data.category || null,
                data.brand || null,
                data.purchaseUrl || null,
                imageFileId,
                data.orderIndex || null,
                id
            ]);
            
            return new MaterialOutputModel(
                [result.rows[0]],
                undefined,
                "Material atualizado."
            );
        } catch (error: any) {
            console.error("❌ Update error:", error);
            return new MaterialOutputModel(undefined, undefined, "Erro ao atualizar.");
        }
    }

    static async Delete(id: number, changeUser: string): Promise<MaterialOutputModel> {
        try {
            // Apagar imagem associada
            const material = await server.query(
                'SELECT image_file_id FROM materials WHERE id = $1', [id]
            );
            if (material.rows[0]?.image_file_id) {
                await FileManager.DeleteFile(material.rows[0].image_file_id, changeUser);
            }
            
            await server.query('DELETE FROM materials WHERE id = $1', [id]);
            
            return new MaterialOutputModel([], undefined, "Material removido.");
        } catch (error: any) {
            console.error("❌ Delete error:", error);
            return new MaterialOutputModel(undefined, undefined, "Erro ao remover.");
        }
    }
}

export default MaterialManager;