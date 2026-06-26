// api/src/Settings/SettingsRoutes.ts
import { Request, Response, Router } from "express";
import SettingsManager from "./SettingsManager";

const router = Router();

// GET - PÚBLICO: Obter configurações para o frontend
async function GetPublicSettings(request: Request, response: Response) {
    try {
        const raw = await SettingsManager.getAll();
        
        const settings = {
            companyName: raw.company_name || 'LeiriaDetail',
            companyAddress: raw.company_address || 'Leiria, Portugal'
        };
        
        response.status(200).json({ Settings: settings, HasError: false });
    } catch (error: any) {
        response.status(500).json({ HasError: true, Error: { Message: "Erro ao carregar configurações." } });
    }
}

// GET - Obter todas as configurações (admin)
async function GetAll(request: Request, response: Response) {
    try {
        const raw = await SettingsManager.getAll();
        
        const settings = {
            companyName: raw.company_name || 'LeiriaDetail',
            companyAddress: raw.company_address || 'Leiria, Portugal'
        };
        
        response.status(200).json({ Settings: settings, HasError: false });
    } catch (error: any) {
        response.status(500).json({ HasError: true, Error: { Message: "Erro ao carregar configurações." } });
    }
}

// GET - Obter uma configuração específica
async function GetOne(request: Request, response: Response) {
    try {
        const key = request.params.key;
        const value = await SettingsManager.get(key);
        response.status(200).json({ key, value, HasError: false });
    } catch (error: any) {
        response.status(500).json({ HasError: true, Error: { Message: "Erro ao carregar configuração." } });
    }
}

// PUT - Atualizar configurações (admin)
async function Update(request: Request, response: Response) {
    try {
        const settings = request.body;
        
        if (settings.companyName !== undefined) {
            await SettingsManager.set('company_name', settings.companyName);
        }
        if (settings.companyAddress !== undefined) {
            await SettingsManager.set('company_address', settings.companyAddress);
        }

        const raw = await SettingsManager.getAll();
        const updatedSettings = {
            companyName: raw.company_name || '',
            companyAddress: raw.company_address || ''
        };
        
        response.status(200).json({ Settings: updatedSettings, Message: "Configurações atualizadas.", HasError: false });
    } catch (error: any) {
        response.status(500).json({ HasError: true, Error: { Message: "Erro ao atualizar configurações." } });
    }
}

// Rota pública para o frontend
router.get("/public", GetPublicSettings);

// Rotas admin
router.get("/", GetAll);
router.get("/:key", GetOne);
router.put("/", Update);

export default router;