// src/Staff/StaffRoutes.ts
import { Request, Response, Router } from "express";
import StaffManager from "./StaffManager";
import { StaffOutputModel, ErrorModel } from "./StaffModel";

const router = Router();

async function GetAllStaff(request: Request, response: Response) {
    try {
        const staff = await StaffManager.getAllStaff();
        response.status(200).json(new StaffOutputModel(staff, "Staff carregado com sucesso."));
    } catch (error: any) {
        console.error('Staff error:', error);
        response.status(500).json(new StaffOutputModel(undefined, undefined, new ErrorModel("Server", "Erro ao carregar staff.")));
    }
}

async function GetStaffById(request: Request, response: Response) {
    try {
        const id = parseInt(request.params.id);
        const staff = await StaffManager.getStaffById(id);
        
        if (!staff) {
            response.status(404).json(new StaffOutputModel(undefined, undefined, new ErrorModel("Staff", "Staff não encontrado.")));
            return;
        }
        
        response.status(200).json(new StaffOutputModel([staff]));
    } catch (error: any) {
        response.status(500).json(new StaffOutputModel(undefined, undefined, new ErrorModel("Server", "Erro ao carregar staff.")));
    }
}

async function UpdateRole(request: Request, response: Response) {
    try {
        const { id, role } = request.body;
        
        if (!id || !role) {
            response.status(400).json(new StaffOutputModel(undefined, undefined, new ErrorModel("Input", "ID e role obrigatórios.")));
            return;
        }
        
        await StaffManager.updateRole(id, role);
        response.status(200).json({ HasError: false, Message: "Role atualizada." });
    } catch (error: any) {
        response.status(500).json(new StaffOutputModel(undefined, undefined, new ErrorModel("Server", "Erro ao atualizar role.")));
    }
}

async function RemoveStaff(request: Request, response: Response) {
    try {
        const id = parseInt(request.params.id);
        await StaffManager.removeStaff(id);
        response.status(200).json({ HasError: false, Message: "Staff removido." });
    } catch (error: any) {
        response.status(500).json(new StaffOutputModel(undefined, undefined, new ErrorModel("Server", "Erro ao remover staff.")));
    }
}

router.get("/", GetAllStaff);
router.get("/:id", GetStaffById);
router.put("/Role", UpdateRole);
router.delete("/:id", RemoveStaff);

export default router;