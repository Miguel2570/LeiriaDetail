// api/src/Payment/PaymentRoutes.ts
import { Request, Response, Router } from "express";
import PaymentManager from "./PaymentManager";
import { PaymentOutputModel, ErrorModel } from "./PaymentModel";
import { server } from "../Helpers/DatabaseConnectionHelper";
import logger from "../Helpers/Logger";
import { CreatePaymentSchema, validate } from "../Helpers/ValidationSchemas";

const router = Router();

async function CreatePayment(request: Request, response: Response) {
    try {
        const sessionKey = request.headers['session-key'] as string;
        if (!sessionKey) { response.status(401).send(new PaymentOutputModel(undefined, undefined, new ErrorModel("Session", "Sessão não fornecida."))); return; }
        const sessionResult = await server.query(`SELECT user_id FROM user_sessions WHERE session_key = $1::uuid AND expirationdatetime > NOW()`, [sessionKey]);
        if (sessionResult.rows.length === 0) { response.status(401).send(new PaymentOutputModel(undefined, undefined, new ErrorModel("Session", "Sessão inválida."))); return; }

        const validation = validate(CreatePaymentSchema, request.body);
        if (!validation.success) { response.status(400).send(new PaymentOutputModel(undefined, undefined, new ErrorModel("Validation", validation.error))); return; }

        const userId = sessionResult.rows[0].user_id;
        const { bookingId, amount, method, mbwayPhone, invoiceNIF, invoiceName, invoiceAddress } = validation.data;
        const payment = await PaymentManager.createPayment(bookingId, userId, amount, method, mbwayPhone, invoiceNIF, invoiceName, invoiceAddress);
        response.status(201).send(new PaymentOutputModel(payment, "Pagamento criado com sucesso."));
    } catch (error: any) { response.status(500).send(new PaymentOutputModel(undefined, undefined, new ErrorModel("Server", "Erro ao processar pagamento."))); }
}

async function GetPayment(request: Request, response: Response) {
    try {
        const payment = await PaymentManager.getPaymentByBooking(parseInt(request.params.bookingId));
        if (!payment) { response.status(404).send(new PaymentOutputModel(undefined, undefined, new ErrorModel("Payment", "Pagamento não encontrado."))); return; }
        response.status(200).send(new PaymentOutputModel(payment));
    } catch (error: any) { response.status(500).send(new PaymentOutputModel(undefined, undefined, new ErrorModel("Server", "Erro ao carregar pagamento."))); }
}

async function ConfirmPayment(request: Request, response: Response) {
    try { await PaymentManager.confirmPayment(request.body.paymentId); response.status(200).send({ HasError: false, Message: "Pagamento confirmado." }); }
    catch (error: any) { response.status(500).send(new PaymentOutputModel(undefined, undefined, new ErrorModel("Server", "Erro ao confirmar pagamento."))); }
}

async function GenerateMultibanco(request: Request, response: Response) {
    try { response.status(200).send(PaymentManager.generateMultibancoRef(request.body.amount)); }
    catch (error: any) { response.status(500).send({ HasError: true, Error: { Message: "Erro ao gerar referência." } }); }
}

async function PaymentWebhook(request: Request, response: Response) {
    try {
        const webhookKey = request.headers['x-webhook-key'] as string;
        if (webhookKey !== process.env.WEBHOOK_SECRET) { logger.warn('Webhook: Chave inválida'); response.status(403).send({ HasError: true, Error: { Message: "Acesso negado." } }); return; }
        const { paymentId, status, bookingId } = request.body;
        if (!paymentId || !status) { response.status(400).send({ HasError: true, Error: { Message: "Dados inválidos." } }); return; }
        if (status === 'PAGO' || status === 'CONFIRMED') { await PaymentManager.confirmPayment(paymentId); logger.info('Webhook: Pagamento confirmado', { paymentId, bookingId }); }
        else if (status === 'CANCELADO' || status === 'FAILED') { await PaymentManager.cancelPayment(paymentId); logger.info('Webhook: Pagamento cancelado', { paymentId, bookingId }); }
        response.status(200).send({ HasError: false, Message: "Webhook processado." });
    } catch (error: any) { logger.error('Erro no webhook', { error: error.message }); response.status(500).send({ HasError: true, Error: { Message: "Erro ao processar webhook." } }); }
}

router.post("/", CreatePayment);
router.get("/:bookingId", GetPayment);
router.post("/confirm", ConfirmPayment);
router.post("/multibanco", GenerateMultibanco);
router.post("/Webhook", PaymentWebhook);
export default router;