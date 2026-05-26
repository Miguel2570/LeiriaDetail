// src/Inventory/InventoryRoutes.ts
import { Request, Response, Router } from "express";
import InventoryManager from "./InventoryManager";
import { InventoryOutputModel, ErrorModel } from "./InventoryModel";

const router = Router();

async function GetAllProducts(request: Request, response: Response) {
    try {
        const products = await InventoryManager.getAllProducts();
        response.status(200).json(new InventoryOutputModel(products, undefined, "Produtos carregados."));
    } catch (error: any) {
        console.error('Inventory error:', error);
        response.status(500).json(new InventoryOutputModel(undefined, undefined, undefined, new ErrorModel("Server", "Erro ao carregar inventário.")));
    }
}

async function GetLowStock(request: Request, response: Response) {
    try {
        const products = await InventoryManager.getLowStock();
        response.status(200).json(new InventoryOutputModel(products, undefined, "Alertas carregados."));
    } catch (error: any) {
        response.status(500).json(new InventoryOutputModel(undefined, undefined, undefined, new ErrorModel("Server", "Erro ao carregar alertas.")));
    }
}

async function GetProductById(request: Request, response: Response) {
    try {
        const id = parseInt(request.params.id);
        const product = await InventoryManager.getProductById(id);
        
        if (!product) {
            response.status(404).json(new InventoryOutputModel(undefined, undefined, undefined, new ErrorModel("Product", "Produto não encontrado.")));
            return;
        }
        
        response.status(200).json(new InventoryOutputModel(undefined, product));
    } catch (error: any) {
        response.status(500).json(new InventoryOutputModel(undefined, undefined, undefined, new ErrorModel("Server", "Erro ao carregar produto.")));
    }
}

async function CreateProduct(request: Request, response: Response) {
    try {
        const { name, category, stockQuantity, minStock, unit, supplier } = request.body;
        
        if (!name || !category) {
            response.status(400).json(new InventoryOutputModel(undefined, undefined, undefined, new ErrorModel("Input", "Nome e categoria obrigatórios.")));
            return;
        }
        
        const product = await InventoryManager.createProduct({
            name,
            category,
            stock_quantity: stockQuantity,
            min_stock: minStock,
            unit,
            supplier
        });
        
        response.status(201).json(new InventoryOutputModel(undefined, product, "Produto criado."));
    } catch (error: any) {
        response.status(500).json(new InventoryOutputModel(undefined, undefined, undefined, new ErrorModel("Server", "Erro ao criar produto.")));
    }
}

async function UpdateProduct(request: Request, response: Response) {
    try {
        const id = parseInt(request.params.id);
        const { name, category, stockQuantity, minStock, unit, supplier } = request.body;
        
        const product = await InventoryManager.updateProduct(id, {
            name,
            category,
            stock_quantity: stockQuantity,
            min_stock: minStock,
            unit,
            supplier
        });
        
        if (!product) {
            response.status(404).json(new InventoryOutputModel(undefined, undefined, undefined, new ErrorModel("Product", "Produto não encontrado.")));
            return;
        }
        
        response.status(200).json(new InventoryOutputModel(undefined, product, "Produto atualizado."));
    } catch (error: any) {
        response.status(500).json(new InventoryOutputModel(undefined, undefined, undefined, new ErrorModel("Server", "Erro ao atualizar produto.")));
    }
}

async function UpdateStock(request: Request, response: Response) {
    try {
        const { id, quantity } = request.body;
        await InventoryManager.updateStock(id, quantity);
        response.status(200).json({ HasError: false, Message: "Stock atualizado." });
    } catch (error: any) {
        response.status(500).json(new InventoryOutputModel(undefined, undefined, undefined, new ErrorModel("Server", "Erro ao atualizar stock.")));
    }
}

async function DeleteProduct(request: Request, response: Response) {
    try {
        const id = parseInt(request.params.id);
        await InventoryManager.deleteProduct(id);
        response.status(200).json({ HasError: false, Message: "Produto removido." });
    } catch (error: any) {
        response.status(500).json(new InventoryOutputModel(undefined, undefined, undefined, new ErrorModel("Server", "Erro ao remover produto.")));
    }
}

router.get("/", GetAllProducts);
router.get("/alerts", GetLowStock);
router.get("/:id", GetProductById);
router.post("/", CreateProduct);
router.put("/:id", UpdateProduct);
router.put("/stock", UpdateStock);
router.delete("/:id", DeleteProduct);

export default router;