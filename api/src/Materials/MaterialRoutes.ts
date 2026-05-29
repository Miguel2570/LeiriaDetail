// src/Material/MaterialRoutes.ts
import { Request, Response, Router } from "express";
import MaterialManager from "./MaterialManager";

const router = Router();

async function GetAll(request: Request, response: Response) {
    const result = await MaterialManager.GetAll();
    response.status(200).send(result);
}

async function Add(request: Request, response: Response) {
    const createUser = request.headers["user-id"] as string || "system";
    const result = await MaterialManager.Add(request.body, createUser);
    response.status(200).send(result);
}

async function Update(request: Request, response: Response) {
    const id = parseInt(request.params.id);
    const changeUser = request.headers["user-id"] as string || "system";
    const result = await MaterialManager.Update(id, request.body, changeUser);
    response.status(200).send(result);
}

async function Delete(request: Request, response: Response) {
    const id = parseInt(request.params.id);
    const changeUser = request.headers["user-id"] as string || "system";
    const result = await MaterialManager.Delete(id, changeUser);
    response.status(200).send(result);
}

router.get("/", GetAll);
router.post("/Add", Add);
router.put("/:id", Update);
router.delete("/:id", Delete);

export default router;