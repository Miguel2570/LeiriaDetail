import { API } from '../../proxy/serviceproxy/api';

export const inventoryMutations = {
    createProduct: async (_: any, { input }: any, context: any) => {
        try {
            const data = await API.POST<any>(context, "/Inventory/", input);
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
    },
    updateProduct: async (_: any, { id, input }: any, context: any) => {
        try {
            const data = await API.PUT<any>(context, `/Inventory/${id}`, input);
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
    },
    updateStock: async (_: any, { input }: any, context: any) => {
        try {
            const data = await API.PUT<any>(context, "/Inventory/stock", input);
            return { hasError: data.HasError || false, message: data.Message || "Stock atualizado." };
        } catch (error: any) {
            return { hasError: true, message: error.message };
        }
    },
    deleteProduct: async (_: any, { id }: any, context: any) => {
        try {
            const data = await API.DELETE<any>(context, `/Inventory/${id}`);
            return { hasError: data.HasError || false, message: data.Message || "Produto removido." };
        } catch (error: any) {
            return { hasError: true, message: error.message };
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