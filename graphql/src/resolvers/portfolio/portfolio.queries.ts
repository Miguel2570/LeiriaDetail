// src/resolvers/portfolio/portfolio.queries.ts
import { API } from '../../proxy/serviceproxy/api';

export const portfolioQueries = {
    portfolio: async (_: any, __: any, context: any) => {
        try {
            const [itemsData, categoriesData] = await Promise.all([
                API.GET<any>(context, "/Portfolio/"),
                API.GET<any>(context, "/Portfolio/categories")
            ]);

            return {
                items: (itemsData.Items || []).map((i: any) => ({
                    id: i.id?.toString(),
                    title: i.title,
                    description: i.description,
                    category: i.category,
                    // ✅ NOVOS CAMPOS (base64)
                    mainImageData: i.mainImageData || i.main_image_data || null,
                    mainImageExtension: i.mainImageExtension || i.main_image_extension || 'jpg',
                    beforeImageData: i.beforeImageData || i.before_image_data || null,
                    beforeImageExtension: i.beforeImageExtension || i.before_image_extension || 'jpg',
                    afterImageData: i.afterImageData || i.after_image_data || null,
                    afterImageExtension: i.afterImageExtension || i.after_image_extension || 'jpg',
                    // ✅ Galeria já vem como array de objetos (não JSON string)
                    galleryImages: (i.galleryImages || i.gallery_images || []).map((img: any) => ({
                        fileId: img.fileId || img.file_id || img.id,
                        fileData: img.fileData || img.file_data || null,
                        fileName: img.fileName || img.file_name || '',
                        fileExtension: img.fileExtension || img.file_extension || 'jpg',
                        type: img.type || 'gallery',
                        sortOrder: img.sortOrder || img.sort_order || 0
                    })),
                    isFeatured: i.is_featured || false,
                    createdAt: i.created_at
                })),
                categories: (categoriesData.Items || []).map((c: any) => c.category),
                message: null,
                hasError: false
            };
        } catch (error: any) {
            return { items: [], categories: [], hasError: true };
        }
    },

    portfolioByCategory: async (_: any, { category }: { category: string }, context: any) => {
        try {
            const data = await API.GET<any>(context, `/Portfolio/${category}`);
            return {
                items: (data.Items || []).map((i: any) => ({
                    id: i.id?.toString(),
                    title: i.title,
                    description: i.description,
                    category: i.category,
                    // ✅ NOVOS CAMPOS
                    mainImageData: i.mainImageData || null,
                    mainImageExtension: i.mainImageExtension || 'jpg',
                    isFeatured: i.is_featured || false,
                    createdAt: i.created_at
                })),
                categories: [],
                hasError: false
            };
        } catch (error: any) {
            return { items: [], categories: [], hasError: true };
        }
    }
};