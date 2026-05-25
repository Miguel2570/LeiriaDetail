import { Request, Response, Router } from "express";
import MaterialManager from "./MaterialManager";

const router = Router();

async function GetAll(request: Request, response: Response) {
    const result = await MaterialManager.GetAll();
    response.status(200).send(result);
}

router.get("/", GetAll);

export default router;