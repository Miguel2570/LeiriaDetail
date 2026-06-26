// src/Registos/RegistosRoutes.ts
import { Request, Response, Router } from "express";
import RegistosManager from "./RegistosManager";
import { RegistosOutputModel, ErrorModel } from "./RegistosModel";

const router = Router();

// GET - Todos os serviços com filtros opcionais
async function GetServices(request: Request, response: Response) {
    try {
        const { status, clientId, date } = request.query;
        const services = await RegistosManager.getAllServices(
            status as string | undefined,
            clientId ? parseInt(clientId as string) : undefined,
            date as string | undefined
        );
        
        response.status(200).json(
            new RegistosOutputModel(services, undefined, undefined)
        );
    } catch (error: any) {
        console.error('Registos error:', error);
        response.status(500).json(
            new RegistosOutputModel(
                undefined, undefined, undefined,
                new ErrorModel("Server", "Erro ao carregar serviços")
            )
        );
    }
}

// GET - Serviços ativos
async function GetActiveServices(request: Request, response: Response) {
    try {
        const services = await RegistosManager.getActiveServices();
        response.status(200).json(
            new RegistosOutputModel(services, undefined, undefined)
        );
    } catch (error: any) {
        console.error('Registos error:', error);
        response.status(500).json(
            new RegistosOutputModel(
                undefined, undefined, undefined,
                new ErrorModel("Server", "Erro ao carregar serviços ativos")
            )
        );
    }
}

// GET - Serviço específico
async function GetService(request: Request, response: Response) {
    try {
        const serviceId = parseInt(request.params.id);
        const service = await RegistosManager.getServiceById(serviceId);
        
        if (!service) {
            response.status(404).json(
                new RegistosOutputModel(
                    undefined, undefined, undefined,
                    new ErrorModel("Service", "Serviço não encontrado")
                )
            );
            return;
        }
        
        response.status(200).json(
            new RegistosOutputModel(undefined, service, undefined)
        );
    } catch (error: any) {
        console.error('Registos error:', error);
        response.status(500).json(
            new RegistosOutputModel(
                undefined, undefined, undefined,
                new ErrorModel("Server", "Erro ao carregar serviço")
            )
        );
    }
}

// GET - Estatísticas
async function GetStats(request: Request, response: Response) {
    try {
        const stats = await RegistosManager.getStats();
        response.status(200).json(
            new RegistosOutputModel(undefined, undefined, stats)
        );
    } catch (error: any) {
        console.error('Registos error:', error);
        response.status(500).json(
            new RegistosOutputModel(
                undefined, undefined, undefined,
                new ErrorModel("Server", "Erro ao carregar estatísticas")
            )
        );
    }
}

// GET - Histórico de serviços de um cliente
async function GetClientServiceHistory(request: Request, response: Response) {
    try {
        const clientId = parseInt(request.params.clientId);
        const services = await RegistosManager.getServiceHistory(clientId);
        
        response.status(200).json(
            new RegistosOutputModel(services, undefined, undefined)
        );
    } catch (error: any) {
        console.error('Registos error:', error);
        response.status(500).json(
            new RegistosOutputModel(
                undefined, undefined, undefined,
                new ErrorModel("Server", "Erro ao carregar histórico")
            )
        );
    }
}

// POST - Criar nova entrada de serviço
async function CreateService(request: Request, response: Response) {
    try {
        const { clientId, vehicleId, serviceType, observations, entryChecks, estimatedValue } = request.body;
        
        if (!clientId || !vehicleId || !serviceType) {
            response.status(400).json(
                new RegistosOutputModel(
                    undefined, undefined, undefined,
                    new ErrorModel("Input", "Campos obrigatórios em falta: clientId, vehicleId, serviceType")
                )
            );
            return;
        }
        
        const serviceId = await RegistosManager.createServiceEntry({
            clientId,
            vehicleId,
            serviceType,
            observations: observations || '',
            entryChecks: entryChecks || [],
            estimatedValue: estimatedValue || 0
        });
        
        const service = await RegistosManager.getServiceById(serviceId);
        
        response.status(201).json(
            new RegistosOutputModel(undefined, service, undefined)
        );
    } catch (error: any) {
        console.error('CreateService error:', error);
        response.status(500).json(
            new RegistosOutputModel(
                undefined, undefined, undefined,
                new ErrorModel("Server", "Erro ao criar serviço")
            )
        );
    }
}

// POST - Iniciar serviço
async function StartService(request: Request, response: Response) {
    try {
        const serviceId = parseInt(request.params.id);
        const service = await RegistosManager.startService(serviceId);
        
        if (!service) {
            response.status(400).json(
                new RegistosOutputModel(
                    undefined, undefined, undefined,
                    new ErrorModel("Service", "Serviço não pode ser iniciado")
                )
            );
            return;
        }
        
        response.status(200).json(
            new RegistosOutputModel(undefined, service, undefined)
        );
    } catch (error: any) {
        console.error('StartService error:', error);
        response.status(500).json(
            new RegistosOutputModel(
                undefined, undefined, undefined,
                new ErrorModel("Server", "Erro ao iniciar serviço")
            )
        );
    }
}

// PUT - Atualizar checklist
async function UpdateChecklist(request: Request, response: Response) {
    try {
        const serviceId = parseInt(request.params.id);
        const { checklist, notes, progress } = request.body;
        
        const service = await RegistosManager.updateChecklist(
            serviceId,
            checklist || [],
            notes || '',
            progress || 0
        );
        
        if (!service) {
            response.status(404).json(
                new RegistosOutputModel(
                    undefined, undefined, undefined,
                    new ErrorModel("Service", "Serviço não encontrado")
                )
            );
            return;
        }
        
        response.status(200).json(
            new RegistosOutputModel(undefined, service, undefined)
        );
    } catch (error: any) {
        console.error('UpdateChecklist error:', error);
        response.status(500).json(
            new RegistosOutputModel(
                undefined, undefined, undefined,
                new ErrorModel("Server", "Erro ao atualizar checklist")
            )
        );
    }
}

// POST - Concluir serviço
async function CompleteService(request: Request, response: Response) {
    try {
        const serviceId = parseInt(request.params.id);
        const { totalValue } = request.body;
        
        // O Manager agora trata de tudo, incluindo sincronizar o booking
        const service = await RegistosManager.completeService(serviceId, totalValue);
        
        if (!service) {
            response.status(400).json(
                new RegistosOutputModel(
                    undefined, undefined, undefined,
                    new ErrorModel("Service", "Serviço não pode ser concluído")
                )
            );
            return;
        }
        
        response.status(200).json(
            new RegistosOutputModel(undefined, service, undefined)
        );
        
    } catch (error: any) {
        console.error('CompleteService error:', error);
        response.status(500).json(
            new RegistosOutputModel(
                undefined, undefined, undefined,
                new ErrorModel("Server", "Erro ao concluir serviço")
            )
        );
    }
}

router.get("/", GetServices);
router.get("/Active", GetActiveServices);
router.get("/Stats", GetStats);
router.get("/Client/:clientId", GetClientServiceHistory);
router.get("/:id", GetService);
router.post("/", CreateService);
router.post("/:id/Start", StartService);
router.put("/:id/Checklist", UpdateChecklist);
router.post("/:id/Complete", CompleteService);

export default router;