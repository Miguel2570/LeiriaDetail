// src/Inventory/InventoryManager.ts
import { server } from '../Helpers/DatabaseConnectionHelper';
import { Product } from './InventoryModel';

class InventoryManager {
    
    static async getAllProducts(): Promise<Product[]> {
        const query = `
            SELECT *
            FROM inventory
            WHERE is_active = true
            ORDER BY category, name ASC
        `;
        const result = await server.query(query);
        return result.rows;
    }
    
    static async getLowStock(): Promise<Product[]> {
        const query = `
            SELECT *
            FROM inventory
            WHERE stock_quantity <= min_stock AND is_active = true
            ORDER BY stock_quantity ASC
        `;
        const result = await server.query(query);
        return result.rows;
    }
    
    static async getProductById(id: number): Promise<Product | null> {
        const query = 'SELECT * FROM inventory WHERE id = $1';
        const result = await server.query(query, [id]);
        return result.rows[0] || null;
    }
    
    static async createProduct(product: Partial<Product>): Promise<Product> {
        const query = `
            INSERT INTO inventory (name, category, stock_quantity, min_stock, unit, supplier)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `;
        const result = await server.query(query, [
            product.name,
            product.category,
            product.stock_quantity || 0,
            product.min_stock || 10,
            product.unit || 'un',
            product.supplier || null
        ]);
        return result.rows[0];
    }
    
    static async updateProduct(id: number, product: Partial<Product>): Promise<Product | null> {
        const query = `
            UPDATE inventory 
            SET name = COALESCE($1, name),
                category = COALESCE($2, category),
                stock_quantity = COALESCE($3, stock_quantity),
                min_stock = COALESCE($4, min_stock),
                unit = COALESCE($5, unit),
                supplier = COALESCE($6, supplier),
                updated_at = NOW()
            WHERE id = $7
            RETURNING *
        `;
        const result = await server.query(query, [
            product.name || null,
            product.category || null,
            product.stock_quantity ?? null,
            product.min_stock ?? null,
            product.unit || null,
            product.supplier || null,
            id
        ]);
        return result.rows[0] || null;
    }
    
    static async updateStock(id: number, quantity: number): Promise<void> {
        await server.query(
            'UPDATE inventory SET stock_quantity = stock_quantity + $1, updated_at = NOW() WHERE id = $2',
            [quantity, id]
        );
    }
    
    static async deleteProduct(id: number): Promise<void> {
        await server.query(
            'UPDATE inventory SET is_active = false, updated_at = NOW() WHERE id = $1',
            [id]
        );
    }
}

export default InventoryManager;