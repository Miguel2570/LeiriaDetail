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
                    imageUrl: i.image_url,
                    beforeImageUrl: i.before_image_url,
                    afterImageUrl: i.after_image_url,
                    galleryImages: i.gallery_images ? JSON.stringify(i.gallery_images) : null,
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
                    imageUrl: i.image_url,
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