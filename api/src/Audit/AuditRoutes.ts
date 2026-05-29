import { Request, Response, Router } from "express";
import AuditManager from "./AuditManager";

const router = Router();

async function GetLogs(request: Request, response: Response) {
    try {
        const limit = parseInt(request.query.limit as string) || 100;
        const action = request.query.action as string;
        const userId = request.query.userId as string;
        const date = request.query.date as string;

        let logs;
        if (action) {
            logs = await AuditManager.getLogsByAction(action, limit);
        } else if (userId) {
            logs = await AuditManager.getLogsByUser(parseInt(userId), limit);
        } else if (date) {
            logs = await AuditManager.getLogsByDate(date, limit);
        } else {
            logs = await AuditManager.getLogs(limit);
        }

        response.status(200).json({ Logs: logs, HasError: false });
    } catch (error: any) {
        console.error('AuditLogs error:', error);
        response.status(500).json({ Logs: [], HasError: true, Error: { Message: "Erro ao carregar logs." } });
    }
}

async function CreateLog(request: Request, response: Response) {
    try {
        const { userId, action, email, details } = request.body;
        await AuditManager.createLog(userId, action, email, details);
        response.status(201).json({ HasError: false, Message: "Log criado." });
    } catch (error: any) {
        response.status(500).json({ HasError: true, Error: { Message: "Erro ao criar log." } });
    }
}

router.get("/", GetLogs);
router.post("/", CreateLog);

export default router;