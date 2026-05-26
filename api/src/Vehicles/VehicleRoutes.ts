import { Request, Response, Router } from "express";
import VehicleManager from "./VehicleManager";
import { VehicleOutputModel } from "./VehicleModel";
import { server } from "../Helpers/DatabaseConnectionHelper";

const router = Router();

async function AddVehicle(request: Request, response: Response) {
    const data = request.body;
    const sessionKey = request.headers['session-key'] as string;

    if (!sessionKey) {
        response.status(200).send(new VehicleOutputModel(undefined, undefined, {
            Field: "session",
            Message: "Sessão não fornecida."
        }));
        return;
    }

    // Buscar user_id da sessão
    const sessionQuery = `
        SELECT user_id FROM user_sessions 
        WHERE session_key = $1 AND expirationdatetime > NOW()
    `;
    const sessionResult = await server.query(sessionQuery, [sessionKey]);
    
    if (sessionResult.rows.length === 0) {
        response.status(200).send(new VehicleOutputModel(undefined, undefined, {
            Field: "session",
            Message: "Sessão inválida ou expirada."
        }));
        return;
    }

    const userId = sessionResult.rows[0].user_id;

    if (!data.license_plate) {
        response.status(200).send(new VehicleOutputModel(undefined, undefined, {
            Field: "license_plate",
            Message: "Matrícula é obrigatória."
        }));
        return;
    }

    const result = await VehicleManager.addVehicle({
        user_id: userId,  // ← Agora tem user_id
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
    const sessionKey = request.headers['session-key'] as string;

    if (!sessionKey) {
        response.status(200).send(new VehicleOutputModel(undefined, undefined, {
            Field: "session",
            Message: "Sessão não fornecida."
        }));
        return;
    }

    // Buscar user_id da sessão
    const sessionQuery = `
        SELECT user_id FROM user_sessions 
        WHERE session_key = $1 AND expirationdatetime > NOW()
    `;
    const sessionResult = await server.query(sessionQuery, [sessionKey]);
    
    if (sessionResult.rows.length === 0) {
        response.status(200).send(new VehicleOutputModel(undefined, undefined, {
            Field: "session",
            Message: "Sessão inválida ou expirada."
        }));
        return;
    }

    const userId = sessionResult.rows[0].user_id;
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
    const sessionKey = request.headers['session-key'] as string;

    if (!sessionKey) {
        response.status(400).json({ success: false, error: "Sessão não fornecida." });
        return;
    }

    const sessionQuery = `
        SELECT user_id FROM user_sessions 
        WHERE session_key = $1 AND expirationdatetime > NOW()
    `;
    const sessionResult = await server.query(sessionQuery, [sessionKey]);
    
    if (sessionResult.rows.length === 0) {
        response.status(400).json({ success: false, error: "Sessão inválida." });
        return;
    }

    const userId = sessionResult.rows[0].user_id;

    if (!vehicleId) {
        response.status(400).json({ success: false, error: "ID do veículo inválido." });
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