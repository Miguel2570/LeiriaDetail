import { Request, Response, Router } from "express";
import VehicleManager from "./VehicleManager";
import { VehicleOutputModel } from "./VehicleModel";

const router = Router();

async function AddVehicle(request: Request, response: Response) {
    const data = request.body;
    const userId = parseInt(request.headers['user-id'] as string) || data.user_id;

    if (!userId) {
        response.status(200).send(new VehicleOutputModel(undefined, undefined, {
            Field: "user_id",
            Message: "Utilizador não identificado."
        }));
        return;
    }

    if (!data.license_plate) {
        response.status(200).send(new VehicleOutputModel(undefined, undefined, {
            Field: "license_plate",
            Message: "Matrícula é obrigatória."
        }));
        return;
    }

    const result = await VehicleManager.addVehicle({
        user_id: userId,
        license_plate: data.license_plate,
        brand: data.brand || '',
        model: data.model || '',
        year: data.year,
        fuel_type: data.fuel_type,
        size_category: data.size_category || 'C',
        vin: data.vin
    });

    response.status(200).send(result);
}

async function GetUserVehicles(request: Request, response: Response) {
    const userId = parseInt(request.query.user_id as string) || 
                   parseInt(request.headers['user-id'] as string);

    if (!userId) {
        response.status(200).send(new VehicleOutputModel(undefined, undefined, {
            Field: "user_id",
            Message: "Utilizador não identificado."
        }));
        return;
    }

    const result = await VehicleManager.getUserVehicles(userId);
    response.status(200).send(result);
}

async function SetPrimaryVehicle(request: Request, response: Response) {
    const { vehicle_id } = request.body;
    const userId = parseInt(request.headers['user-id'] as string) || request.body.user_id;

    if (!userId || !vehicle_id) {
        response.status(200).send(new VehicleOutputModel(undefined, undefined, {
            Field: "params",
            Message: "Parâmetros inválidos."
        }));
        return;
    }

    const result = await VehicleManager.setPrimaryVehicle(userId, vehicle_id);
    response.status(200).send(result);
}

async function DeleteVehicle(request: Request, response: Response) {
    const vehicleId = parseInt(request.params.id);
    const userId = parseInt(request.headers['user-id'] as string);

    if (!userId || !vehicleId) {
        response.status(400).json({ success: false, error: "Parâmetros inválidos." });
        return;
    }

    const result = await VehicleManager.deleteVehicle(userId, vehicleId);
    response.status(result.success ? 200 : 400).send(result);
}

router.post("/Add", AddVehicle);
router.get("/List", GetUserVehicles);
router.post("/SetPrimary", SetPrimaryVehicle);
router.delete("/:id", DeleteVehicle);

export default router;