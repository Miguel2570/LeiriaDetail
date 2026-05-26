import { API } from '../../proxy/serviceproxy/api';

export const inventoryQueries = {
    inventoryList: async (_: any, __: any, context: any) => {
        try {
            const data = await API.GET<any>(context, "/Inventory/");
            return {
                products: (data.Products || []).map(mapProduct),
                message: data.Message,
                hasError: data.HasError || false,
                error: data.Error || null
            };
        } catch (error: any) {
            return { products: [], message: null, hasError: true, error: { field: "server", message: error.message } };
        }
    },
    inventoryAlerts: async (_: any, __: any, context: any) => {
        try {
            const data = await API.GET<any>(context, "/Inventory/alerts");
            return {
                products: (data.Products || []).map(mapProduct),
                message: data.Message,
                hasError: data.HasError || false,
                error: data.Error || null
            };
        } catch (error: any) {
            return { products: [], message: null, hasError: true, error: { field: "server", message: error.message } };
        }
    },
    inventoryProduct: async (_: any, { id }: any, context: any) => {
        try {
            const data = await API.GET<any>(context, `/Inventory/${id}`);
            return {
                products: null,
                product: data.Product ? mapProduct(data.Product) : null,
                message: data.Message,
                hasError: data.HasError || false,
                error: data.Error || null
            };
        } catch (error: any) {
            return { products: null, product: null, message: null, hasError: true, error: { field: "server", message: error.message } };
        }
    }
};

function mapProduct(p: any) {
    return {
        id: p.id?.toString(),
        name: p.name,
        category: p.category,
        stockQuantity: p.stock_quantity,
        minStock: p.min_stock,
        unit: p.unit,
        supplier: p.supplier,
        lastOrdered: p.last_ordered,
        isActive: p.is_active
    };
}