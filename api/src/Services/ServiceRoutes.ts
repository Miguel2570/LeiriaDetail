import { Request, Response, Router } from "express";
import ServiceManager from "./ServiceManager";

const router = Router();

async function GetAllServices(request: Request, response: Response) {
    const result = await ServiceManager.GetAllServices();
    response.status(200).send(result);
}

async function GetServiceById(request: Request, response: Response) {
    const id = parseInt(request.params.id);
    
    if (!id) {
        response.status(400).send({ HasError: true, Error: { Field: "id", Message: "ID inválido." } });
        return;
    }
    
    const result = await ServiceManager.GetServiceById(id);
    response.status(200).send(result);
}

async function GetServicesByPack(request: Request, response: Response) {
    const pack = request.query.pack as string;
    
    if (!pack || (pack !== 'Basico' && pack !== 'Premium')) {
        response.status(400).send({ HasError: true, Error: { Field: "pack", Message: "Pack inválido. Use 'Basico' ou 'Premium'." } });
        return;
    }
    
    const result = await ServiceManager.GetServicesByPack(pack);
    response.status(200).send(result);
}

router.get("/", GetAllServices);
router.get("/:id", GetServiceById);
router.get("/pack/:pack", GetServicesByPack);

export default router;