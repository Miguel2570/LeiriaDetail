// src/Portfolio/PortfolioRoutes.ts
import { Request, Response, Router } from "express";
import PortfolioManager from "./PortfolioManager";

const router = Router();

async function GetAll(request: Request, response: Response) {
    const result = await PortfolioManager.GetAll();
    response.status(200).send(result);
}

async function GetByCategory(request: Request, response: Response) {
    const category = request.params.category;
    const result = await PortfolioManager.GetByCategory(category);
    response.status(200).send(result);
}

async function GetCategories(request: Request, response: Response) {
    const result = await PortfolioManager.GetCategories();
    response.status(200).send(result);
}

async function AddItem(request: Request, response: Response) {
    const createUser = request.headers["user-id"] as string || "system";
    const result = await PortfolioManager.Add(request.body, createUser);
    response.status(200).send(result);
}

async function UpdateItem(request: Request, response: Response) {
    const id = parseInt(request.params.id);
    const changeUser = request.headers["user-id"] as string || "system";
    const result = await PortfolioManager.Update(id, request.body, changeUser);
    response.status(200).send(result);
}

async function DeleteItem(request: Request, response: Response) {
    const id = parseInt(request.params.id);
    const changeUser = request.headers["user-id"] as string || "system";
    const result = await PortfolioManager.Delete(id, changeUser);
    response.status(200).send(result);
}

router.get("/", GetAll);
router.get("/categories", GetCategories);
router.get("/:category", GetByCategory);
router.post("/Add", AddItem);
router.put("/:id", UpdateItem);
router.delete("/:id", DeleteItem);

export default router;