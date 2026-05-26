import { Request, Response, Router } from "express";
import StaffManager from "./StaffManager";
import { StaffOutputModel, ErrorModel } from "./StaffModel";
import { server } from '../Helpers/DatabaseConnectionHelper';

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

async function PromoteToStaff(request: Request, response: Response) {
    try {
        const { email, role } = request.body;
        
        if (!email || !role) {
            response.status(400).json({ HasError: true, Error: { Message: "Email e role obrigatórios." } });
            return;
        }
        
        const userResult = await server.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
        
        if (userResult.rows.length === 0) {
            response.status(404).json({ HasError: true, Error: { Message: "Utilizador não encontrado." } });
            return;
        }
        
        await server.query(
            'UPDATE users SET role = $1, updated_at = NOW() WHERE id = $2',
            [role, userResult.rows[0].id]
        );
        
        response.status(200).json({ HasError: false, Message: "Utilizador promovido com sucesso." });
    } catch (error: any) {
        response.status(500).json({ HasError: true, Error: { Message: error.message } });
    }
}

router.get("/", GetAllStaff);
router.get("/:id", GetStaffById);
router.put("/Role", UpdateRole);
router.delete("/:id", RemoveStaff);
router.post("/promote", PromoteToStaff);

export default router;