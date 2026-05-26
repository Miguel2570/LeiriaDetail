// src/CRM/CRMRoutes.ts
import { Request, Response, Router } from "express";
import CRMManager from "./CRMManager";
import { CRMOutputModel, ErrorModel } from "./CRMModel";

const router = Router();

// GET - Todos os clientes
async function GetClients(request: Request, response: Response) {
    try {
        const clients = await CRMManager.getClients();
        response.status(200).json(new CRMOutputModel(clients));
    } catch (error: any) {
        console.error('CRM error:', error);
        response.status(500).json(new CRMOutputModel(undefined, undefined, new ErrorModel("Server", "Erro ao carregar clientes")));
    }
}

// GET - Cliente específico
async function GetClient(request: Request, response: Response) {
    try {
        const clientId = parseInt(request.params.id);
        const client = await CRMManager.getClientById(clientId);
        
        if (!client) {
            response.status(404).json(new CRMOutputModel(undefined, undefined, new ErrorModel("Client", "Cliente não encontrado")));
            return;
        }
        
        response.status(200).json(new CRMOutputModel(undefined, client));
    } catch (error: any) {
        console.error('CRM error:', error);
        response.status(500).json(new CRMOutputModel(undefined, undefined, new ErrorModel("Server", "Erro ao carregar cliente")));
    }
}

// POST - Adicionar cliente
async function AddClient(request: Request, response: Response) {
    try {
        const { firstName, lastName, email, phone } = request.body;
        
        if (!firstName || !lastName || !email) {
            response.status(400).json(new CRMOutputModel(undefined, undefined, new ErrorModel("Input", "Campos obrigatórios em falta")));
            return;
        }
        
        const clientId = await CRMManager.addClient(firstName, lastName, email, phone || '');
        const client = await CRMManager.getClientById(clientId);
        
        response.status(201).json(new CRMOutputModel(undefined, client));
    } catch (error: any) {
        console.error('AddClient error:', error);
        response.status(500).json(new CRMOutputModel(undefined, undefined, new ErrorModel("Server", "Erro ao criar cliente")));
    }
}

// POST - Adicionar veículo
async function AddVehicle(request: Request, response: Response) {
    try {
        const { userId, plate, brand, model, year, sizeCategory } = request.body;
        
        const vehicleId = await CRMManager.addVehicle(userId, plate, brand, model, year, sizeCategory);
        
        if (vehicleId === 0) {
            response.status(409).json(new CRMOutputModel(undefined, undefined, new ErrorModel("Vehicle", "Veículo já existe para este cliente")));
            return;
        }
        
        response.status(201).json({ HasError: false, VehicleId: vehicleId });
    } catch (error: any) {
        console.error('AddVehicle error:', error);
        response.status(500).json(new CRMOutputModel(undefined, undefined, new ErrorModel("Server", "Erro ao adicionar veículo")));
    }
}

router.get("/", GetClients);
router.get("/:id", GetClient);
router.post("/", AddClient);
router.post("/Vehicle", AddVehicle);

export default router;