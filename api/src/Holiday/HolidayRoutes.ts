// api/src/Holiday/HolidayRoutes.ts
import { Request, Response, Router } from "express";
import HolidayManager from "./HolidayManager";

const router = Router();

async function GetAll(request: Request, response: Response) {
    try {
        const dates = await HolidayManager.getAll();
        response.json({ Dates: dates, HasError: false });
    } catch (error: any) {
        response.status(500).json({ HasError: true, Error: { Message: "Erro ao carregar feriados." } });
    }
}

async function CheckDate(request: Request, response: Response) {
    const date = request.query.date as string;
    if (!date) { response.json({ blocked: false }); return; }
    const blocked = await HolidayManager.isBlocked(date);
    response.json({ blocked });
}

async function Add(request: Request, response: Response) {
    const { date, reason, isRecurring } = request.body;
    if (!date || !reason) { response.status(400).json({ HasError: true }); return; }
    try {
        const result = await HolidayManager.add(date, reason, isRecurring || false);
        response.status(201).json({ Date: result, HasError: false });
    } catch (error: any) {
        response.status(500).json({ HasError: true, Error: { Message: error.message } });
    }
}

async function Remove(request: Request, response: Response) {
    try {
        await HolidayManager.remove(parseInt(request.params.id));
        response.json({ HasError: false, Message: "Removido." });
    } catch (error: any) {
        response.status(500).json({ HasError: true, Error: { Message: error.message } });
    }
}

router.get("/", GetAll);
router.get("/check", CheckDate);
router.post("/", Add);
router.delete("/:id", Remove);

export default router;