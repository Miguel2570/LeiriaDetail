import { Request, Response, Router } from "express";
import PortfolioManager from "./PortfolioManager";

const router = Router();

// GET - Listar todos
async function GetAll(request: Request, response: Response) {
    const result = await PortfolioManager.GetAll();
    response.status(200).send(result);
}

// GET - Por categoria
async function GetByCategory(request: Request, response: Response) {
    const category = request.params.category;
    const result = await PortfolioManager.GetByCategory(category);
    response.status(200).send(result);
}

// GET - Listar categorias
async function GetCategories(request: Request, response: Response) {
    const result = await PortfolioManager.GetCategories();
    response.status(200).send(result);
}

// POST - Adicionar
async function AddItem(request: Request, response: Response) {
    const result = await PortfolioManager.Add(request.body);
    response.status(200).send(result);
}

// PUT - Atualizar
async function UpdateItem(request: Request, response: Response) {
    const id = parseInt(request.params.id);
    const result = await PortfolioManager.Update(id, request.body);
    response.status(200).send(result);
}

// DELETE - Remover
async function DeleteItem(request: Request, response: Response) {
    const id = parseInt(request.params.id);
    const result = await PortfolioManager.Delete(id);
    response.status(200).send(result);
}

router.get("/", GetAll);
router.get("/categories", GetCategories);
router.get("/:category", GetByCategory);
router.post("/Add", AddItem);
router.put("/:id", UpdateItem);
router.delete("/:id", DeleteItem);

export default router;