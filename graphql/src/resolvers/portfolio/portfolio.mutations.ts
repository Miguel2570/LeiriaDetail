// src/resolvers/portfolio/portfolio.mutations.ts
import { API } from '../../proxy/serviceproxy/api';

export const portfolioMutations = {
    addPortfolioItem: async (_: any, { input }: any, context: any) => {
        try {
            // ✅ Mapeia os novos campos para o backend
            const payload = {
                title: input.title,
                description: input.description,
                category: input.category,
                isFeatured: input.isFeatured,
                // Imagem principal (base64)
                mainImageData: input.mainImageData || null,
                mainImageSize: input.mainImageSize || 0,
                mainImageExtension: input.mainImageExtension || 'jpg',
                // Antes
                beforeImageData: input.beforeImageData || null,
                beforeImageSize: input.beforeImageSize || 0,
                beforeImageExtension: input.beforeImageExtension || 'jpg',
                // Depois
                afterImageData: input.afterImageData || null,
                afterImageSize: input.afterImageSize || 0,
                afterImageExtension: input.afterImageExtension || 'jpg',
                // Galeria
                galleryImages: (input.galleryImages || []).map((img: any) => ({
                    fileData: img.fileData,
                    fileSize: img.fileSize || 0,
                    fileExtension: img.fileExtension || 'jpg',
                    type: img.type || 'gallery'
                }))
            };
            
            const data: any = await API.POST<any>(context, "/Portfolio/Add", payload);
            return {
                item: data.Item || data.item || null,
                message: data.Message || data.message,
                hasError: data.HasError || data.hasError || false,
                error: data.Error || data.error || null
            };
        } catch (error: any) {
            return {
                item: null,
                hasError: true,
                error: { field: "server", message: error.message }
            };
        }
    },

    updatePortfolioItem: async (_: any, { id, input }: any, context: any) => {
        try {
            // ✅ Mapeia os novos campos
            const payload: any = {};
            
            if (input.title !== undefined) payload.title = input.title;
            if (input.description !== undefined) payload.description = input.description;
            if (input.category !== undefined) payload.category = input.category;
            if (input.isFeatured !== undefined) payload.isFeatured = input.isFeatured;
            
            // Imagem principal (só se fornecida)
            if (input.mainImageData) {
                payload.mainImageData = input.mainImageData;
                payload.mainImageSize = input.mainImageSize || 0;
                payload.mainImageExtension = input.mainImageExtension || 'jpg';
            }
            
            // Antes
            if (input.beforeImageData) {
                payload.beforeImageData = input.beforeImageData;
                payload.beforeImageSize = input.beforeImageSize || 0;
                payload.beforeImageExtension = input.beforeImageExtension || 'jpg';
            }
            
            // Depois
            if (input.afterImageData) {
                payload.afterImageData = input.afterImageData;
                payload.afterImageSize = input.afterImageSize || 0;
                payload.afterImageExtension = input.afterImageExtension || 'jpg';
            }
            
            // Galeria (se fornecida)
            if (input.galleryImages) {
                payload.galleryImages = input.galleryImages.map((img: any) => ({
                    fileData: img.fileData,
                    fileSize: img.fileSize || 0,
                    fileExtension: img.fileExtension || 'jpg',
                    type: img.type || 'gallery'
                }));
            }
            
            const data: any = await API.PUT<any>(context, `/Portfolio/${id}`, payload);
            return {
                item: data.Item || data.item || null,
                message: data.Message || data.message,
                hasError: data.HasError || data.hasError || false,
                error: data.Error || data.error || null
            };
        } catch (error: any) {
            return {
                item: null,
                hasError: true,
                error: { field: "server", message: error.message }
            };
        }
    },

    deletePortfolioItem: async (_: any, { id }: any, context: any) => {
        try {
            const data: any = await API.DELETE<any>(context, `/Portfolio/${id}`);
            return {
                success: data.isSuccess || data.success || false,
                message: data.Message || data.message,
                hasError: data.HasError || data.hasError || false,
                error: data.Error || data.error || null
            };
        } catch (error: any) {
            return {
                success: false,
                hasError: true,
                error: { field: "server", message: error.message }
            };
        }
    }
};