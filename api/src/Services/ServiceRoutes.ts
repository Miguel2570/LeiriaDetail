// api/src/Services/ServiceRoutes.ts
import { Request, Response, Router } from "express";
import ServiceManager from "./ServiceManager";

const router = Router();

async function GetAllServices(request: Request, response: Response) {
    const result = await ServiceManager.GetAllServices();
    response.status(200).send(result);
}

async function GetServiceById(request: Request, response: Response) {
    const id = parseInt(request.params.id);
    if (!id || isNaN(id)) {
        response.status(400).send({ HasError: true, Error: { Field: "id", Message: "ID inválido." } });
        return;
    }
    const result = await ServiceManager.GetServiceById(id);
    response.status(200).send(result);
}

async function GetServicesByPack(request: Request, response: Response) {
    const pack = request.query.pack as string;
    if (!pack) {
        response.status(400).send({ HasError: true, Error: { Field: "pack", Message: "Pack não especificado." } });
        return;
    }
    const result = await ServiceManager.GetServicesByPack(pack);
    response.status(200).send(result);
}

async function GetPackExtras(request: Request, response: Response) {
    const id = parseInt(request.params.id);
    if (!id || isNaN(id)) {
        response.status(400).send({ HasError: true, Error: { Message: "ID inválido." } });
        return;
    }
    const result = await ServiceManager.GetPackExtras(id);
    response.status(200).send(result);
}

async function GetServiceSteps(request: Request, response: Response) {
    const id = parseInt(request.params.id);
    if (!id || isNaN(id)) {
        response.status(400).send({ HasError: true, Error: { Message: "ID inválido." } });
        return;
    }
    const result = await ServiceManager.GetServiceSteps(id);
    response.status(200).send(result);
}

async function CreateService(request: Request, response: Response) {
    const { name, description, priceAB, priceC, priceDE, durationMinutes, packType } = request.body;
    if (!name || priceAB == null || priceC == null || priceDE == null) {
        response.status(400).send({ HasError: true, Error: { Field: "Input", Message: "Campos obrigatórios: name, priceAB, priceC, priceDE" } });
        return;
    }
    const result = await ServiceManager.CreateService({
        name, description, price_ab: priceAB, price_c: priceC, price_de: priceDE,
        duration_minutes: durationMinutes, pack_type: packType
    });
    response.status(201).send(result);
}

async function UpdateService(request: Request, response: Response) {
    const id = parseInt(request.params.id);
    const { name, description, priceAB, priceC, priceDE, durationMinutes, packType } = request.body;
    if (!id || isNaN(id)) {
        response.status(400).send({ HasError: true, Error: { Field: "id", Message: "ID inválido." } });
        return;
    }
    const result = await ServiceManager.UpdateService(id, {
        name, description, price_ab: priceAB, price_c: priceC, price_de: priceDE,
        duration_minutes: durationMinutes, pack_type: packType
    });
    response.status(200).send(result);
}

async function DeleteService(request: Request, response: Response) {
    const id = parseInt(request.params.id);
    if (!id || isNaN(id)) {
        response.status(400).send({ HasError: true, Error: { Field: "id", Message: "ID inválido." } });
        return;
    }
    const result = await ServiceManager.DeleteService(id);
    response.status(200).send(result);
}

async function GetFullPackDetails(request: Request, response: Response) {
    const id = parseInt(request.params.id);
    if (isNaN(id)) {
        response.status(400).send({ HasError: true, Error: { Field: "id", Message: "ID inválido." } });
        return;
    }
    const result = await ServiceManager.GetFullPackDetails(id);
    response.status(200).send(result);
}

router.get("/", GetAllServices);
router.get("/pack/query", GetServicesByPack);
router.get("/:id/extras", GetPackExtras);
router.get("/:id/steps", GetServiceSteps);
router.get("/:id", GetServiceById);
router.post("/", CreateService);
router.put("/:id", UpdateService);
router.delete("/:id", DeleteService);
router.get("/:id/full", GetFullPackDetails);

export default router;