// api/src/PendingBookings/PendingBookingsRoutes.ts
import { Request, Response, Router } from "express";
import PendingBookingsManager from "./PendingBookingManager";

const router = Router();

// POST - Criar booking pendente
async function Create(request: Request, response: Response) {
    try {
        const data = request.body;
        console.log('📥 POST /PendingBookings - Body:', JSON.stringify(data, null, 2));
        
        const pending = await PendingBookingsManager.create(data);
        
        console.log('✅ Resultado:', JSON.stringify(pending, null, 2));
        
        response.status(201).json({ 
            PendingBooking: pending,
            message: "Pagamento pendente criado.", 
            HasError: false 
        });
    } catch (error: any) {
        console.error('💥 ERRO 500:', error.message);
        console.error('Stack:', error.stack);
        response.status(500).json({ 
            HasError: true, 
            Error: { Message: error.message || "Erro ao criar pagamento pendente." } 
        });
    }
}

// GET - Verificar se slot está bloqueado
async function CheckSlot(request: Request, response: Response) {
    try {
        const { date, time } = request.query;
        if (!date || !time) {
            response.status(400).json({ HasError: true, Error: { Message: "Data e hora obrigatórios." } });
            return;
        }
        const isBlocked = await PendingBookingsManager.isSlotBlocked(date as string, time as string);
        response.json({ blocked: isBlocked, HasError: false });
    } catch (error: any) {
        response.status(500).json({ HasError: true, Error: { Message: "Erro ao verificar slot." } });
    }
}

// GET - Slots bloqueados para uma data
async function BlockedSlots(request: Request, response: Response) {
    try {
        const { date } = request.query;
        if (!date) {
            response.status(400).json({ HasError: true, Error: { Message: "Data obrigatória." } });
            return;
        }
        const slots = await PendingBookingsManager.getBlockedSlotsForDate(date as string);
        response.json({ blockedSlots: slots, HasError: false });
    } catch (error: any) {
        response.status(500).json({ HasError: true, Error: { Message: "Erro ao carregar slots." } });
    }
}

// GET - Booking pendente do utilizador
async function GetUserPending(request: Request, response: Response) {
    try {
        const userId = parseInt(request.query.userId as string);
        if (!userId) {
            response.status(400).json({ HasError: true, Error: { Message: "userId obrigatório." } });
            return;
        }
        const pending = await PendingBookingsManager.getByUserId(userId);
        response.json({ pendingBookings: pending, HasError: false });
    } catch (error: any) {
        response.status(500).json({ HasError: true, Error: { Message: "Erro ao carregar." } });
    }
}

// PUT - Marcar como pago
async function MarkPaid(request: Request, response: Response) {
    try {
        const { id, paymentMethod } = request.body;
        await PendingBookingsManager.markAsPaid(id, paymentMethod);
        response.json({ message: "Pagamento confirmado.", HasError: false });
    } catch (error: any) {
        response.status(500).json({ HasError: true, Error: { Message: "Erro ao confirmar pagamento." } });
    }
}

// DELETE - Cancelar booking pendente
async function Cancel(request: Request, response: Response) {
    try {
        const { id } = request.params;
        const cancelled = await PendingBookingsManager.cancel(id);
        if (!cancelled) {
            response.status(404).json({ HasError: true, Error: { Message: "Booking pendente não encontrado." } });
            return;
        }
        response.json({ message: "Booking pendente cancelado.", HasError: false });
    } catch (error: any) {
        response.status(500).json({ HasError: true, Error: { Message: "Erro ao cancelar." } });
    }
}

async function GetById(request: Request, response: Response) {
    try {
        const { id } = request.params;
        const pending = await PendingBookingsManager.getById(id);
        if (!pending) {
            response.status(404).json({ HasError: true, Error: { Message: "Booking pendente não encontrado ou já expirado." } });
            return;
        }
        response.json({ PendingBooking: pending, HasError: false });
    } catch (error: any) {
        response.status(500).json({ HasError: true, Error: { Message: "Erro ao carregar." } });
    }
}


router.post("/", Create);
router.get("/check-slot", CheckSlot);
router.get("/blocked-slots", BlockedSlots);
router.get("/user", GetUserPending);
router.put("/mark-paid", MarkPaid);
router.delete("/:id", Cancel);
router.get("/:id", GetById);

export default router;