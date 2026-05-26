import { Request, Response, Router } from "express";
import AppointmentManager from "./AppointmentManager";
import { AppointmentOutputModel, ErrorModel } from "./AppointmentModel";

const router = Router();

// GET - Todas as marcações
async function GetAppointments(request: Request, response: Response) {
    try {
        const date = request.query.date as string;
        const data = await AppointmentManager.getAppointments(date);
        response.status(200).json(new AppointmentOutputModel(data));
    } catch (error: any) {
        console.error('Appointments error:', error);
        response.status(500).json(new AppointmentOutputModel(undefined, new ErrorModel("Server", "Erro ao carregar marcações")));
    }
}

// POST - Mover booking para um bay
async function MoveBooking(request: Request, response: Response) {
    try {
        const { bookingId, toBayId, status } = request.body;
        
        if (!bookingId || !toBayId) {
            response.status(400).json(new AppointmentOutputModel(undefined, new ErrorModel("Input", "bookingId e toBayId obrigatórios")));
            return;
        }
        
        await AppointmentManager.moveBooking(bookingId, toBayId, status || 'EM_PROGRESSO');
        response.status(200).json({ HasError: false, Message: "Marcação movida com sucesso" });
    } catch (error: any) {
        console.error('MoveBooking error:', error);
        response.status(500).json(new AppointmentOutputModel(undefined, new ErrorModel("Server", "Erro ao mover marcação")));
    }
}

// POST - Criar nova marcação
async function CreateBooking(request: Request, response: Response) {
    try {
        const { userId, vehicleId, serviceId, bookingDate, bookingTime } = request.body;
        
        if (!userId || !vehicleId || !serviceId || !bookingDate || !bookingTime) {
            response.status(400).json(new AppointmentOutputModel(undefined, new ErrorModel("Input", "Campos obrigatórios em falta")));
            return;
        }
        
        const bookingId = await AppointmentManager.createBooking(userId, vehicleId, serviceId, bookingDate, bookingTime);
        response.status(201).json({ HasError: false, BookingId: bookingId });
    } catch (error: any) {
        console.error('CreateBooking error:', error);
        response.status(500).json(new AppointmentOutputModel(undefined, new ErrorModel("Server", "Erro ao criar marcação")));
    }
}

// PUT - Atualizar status
async function UpdateStatus(request: Request, response: Response) {
    try {
        const { bookingId, status } = request.body;
        
        await AppointmentManager.updateBookingStatus(bookingId, status);
        response.status(200).json({ HasError: false, Message: "Status atualizado" });
    } catch (error: any) {
        console.error('UpdateStatus error:', error);
        response.status(500).json(new AppointmentOutputModel(undefined, new ErrorModel("Server", "Erro ao atualizar status")));
    }
}

router.get("/", GetAppointments);
router.post("/Move", MoveBooking);
router.post("/", CreateBooking);
router.put("/Status", UpdateStatus);

export default router;