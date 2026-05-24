import { Request, Response, Router } from "express";
import BookingManager from "./BookingManager";

const router = Router();

async function CreateBooking(request: Request, response: Response) {
    const { user_id, vehicle_id, service_id, booking_date, booking_time } = request.body;

    if (!user_id || !vehicle_id || !service_id || !booking_date || !booking_time) {
        response.status(400).send({
            HasError: true,
            Error: { Field: "body", Message: "Todos os campos são obrigatórios." }
        });
        return;
    }

    const result = await BookingManager.CreateBooking({
        user_id, vehicle_id, service_id, booking_date, booking_time
    });
    response.status(200).send(result);
}

async function GetUserBookings(request: Request, response: Response) {
    const userId = parseInt(request.query.user_id as string) ||
        parseInt(request.headers['user-id'] as string);

    if (!userId) {
        response.status(400).send({
            HasError: true,
            Error: { Message: "Utilizador não identificado." }
        });
        return;
    }

    const result = await BookingManager.GetUserBookings(userId);
    response.status(200).send(result);
}

async function GetAvailableSlots(request: Request, response: Response) {
    const date = request.query.date as string;

    if (!date) {
        response.status(400).send({
            HasError: true,
            Error: { Message: "Data não fornecida." }
        });
        return;
    }

    const result = await BookingManager.GetAvailableSlots(date);
    response.status(200).send(result);
}

async function CalculatePrice(request: Request, response: Response) {
    const vehicleId = parseInt(request.query.vehicle_id as string);
    const serviceId = parseInt(request.query.service_id as string);

    if (!vehicleId || !serviceId) {
        response.status(400).send({
            HasError: true,
            Error: { Message: "Veículo e serviço são obrigatórios." }
        });
        return;
    }

    const result = await BookingManager.CalculatePrice(vehicleId, serviceId);
    response.status(200).send(result);
}

router.post("/", CreateBooking);
router.get("/", GetUserBookings);
router.get("/slots", GetAvailableSlots);
router.get("/price", CalculatePrice);

export default router;