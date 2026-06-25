// api/src/Bookings/BookingRoutes.ts
import { Request, Response, Router } from "express";
import BookingManager from "./BookingManager";
import { CreateBookingSchema, validate } from "../Helpers/ValidationSchemas";

const router = Router();

async function CreateBooking(request: Request, response: Response) {
    const validation = validate(CreateBookingSchema, request.body);
    if (!validation.success) { response.status(400).send({ HasError: true, Error: { Field: "body", Message: validation.error } }); return; }
    const { userId: user_id, vehicleId: vehicle_id, serviceId: service_id, bookingDate: booking_date, bookingTime: booking_time } = validation.data;
    const result = await BookingManager.CreateBooking({ user_id, vehicle_id, service_id, booking_date, booking_time });
    response.status(200).send(result);
}

async function GetUserBookings(request: Request, response: Response) {
    const userId = parseInt(request.query.user_id as string) || parseInt(request.headers['user-id'] as string);
    if (!userId) { response.status(400).send({ HasError: true, Error: { Message: "Utilizador não identificado." } }); return; }
    response.status(200).send(await BookingManager.GetUserBookings(userId));
}

async function GetAvailableSlots(request: Request, response: Response) {
    if (!request.query.date) { response.status(400).send({ HasError: true, Error: { Message: "Data não fornecida." } }); return; }
    response.status(200).send(await BookingManager.GetAvailableSlots(request.query.date as string));
}

async function CalculatePrice(request: Request, response: Response) {
    const vehicleId = parseInt(request.query.vehicle_id as string);
    const serviceId = parseInt(request.query.service_id as string);
    if (!vehicleId || !serviceId) { response.status(400).send({ HasError: true, Error: { Message: "Veículo e serviço obrigatórios." } }); return; }
    response.status(200).send(await BookingManager.CalculatePrice(vehicleId, serviceId));
}

async function CreatePendingBooking(request: Request, response: Response) {
    try {
        const result = await BookingManager.CreatePendingBooking(request.body);
        response.status(result.HasError ? 500 : 200).send(result);
    } catch (error: any) {
        response.status(500).send({ 
            HasError: true, 
            Error: { Message: error.message } 
        });
    }
}

router.post("/", CreatePendingBooking);
router.post("/", CreateBooking);
router.get("/", GetUserBookings);
router.get("/slots", GetAvailableSlots);
router.get("/price", CalculatePrice);
export default router;