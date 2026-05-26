// api/src/Payment/PaymentRoutes.ts
import { Request, Response, Router } from "express";
import PaymentManager from "./PaymentManager";
import { PaymentOutputModel, ErrorModel, MultibancoData } from "./PaymentModel";
import { server } from "../Helpers/DatabaseConnectionHelper";

const router = Router();

async function CreatePayment(request: Request, response: Response) {
    try {
        const sessionKey = request.headers['session-key'] as string;
        if (!sessionKey) {
            response.status(401).send(new PaymentOutputModel(undefined, undefined, new ErrorModel("Session", "Sessão não fornecida.")));
            return;
        }

        const sessionQuery = `SELECT user_id FROM user_sessions WHERE session_key = $1::uuid AND expirationdatetime > NOW()`;
        const sessionResult = await server.query(sessionQuery, [sessionKey]);
        if (sessionResult.rows.length === 0) {
            response.status(401).send(new PaymentOutputModel(undefined, undefined, new ErrorModel("Session", "Sessão inválida.")));
            return;
        }

        const userId = sessionResult.rows[0].user_id;
        const { bookingId, amount, method, mbwayPhone, invoiceNIF, invoiceName, invoiceAddress } = request.body;

        if (!bookingId || !amount || !method) {
            response.status(400).send(new PaymentOutputModel(undefined, undefined, new ErrorModel("Input", "Campos obrigatórios em falta.")));
            return;
        }

        const payment = await PaymentManager.createPayment(
            bookingId, userId, amount, method, mbwayPhone, invoiceNIF, invoiceName, invoiceAddress
        );

        response.status(201).send(new PaymentOutputModel(payment, "Pagamento criado com sucesso."));
    } catch (error: any) {
        console.error('CreatePayment error:', error);
        response.status(500).send(new PaymentOutputModel(undefined, undefined, new ErrorModel("Server", "Erro ao processar pagamento.")));
    }
}

async function GetPayment(request: Request, response: Response) {
    try {
        const bookingId = parseInt(request.params.bookingId);
        const payment = await PaymentManager.getPaymentByBooking(bookingId);

        if (!payment) {
            response.status(404).send(new PaymentOutputModel(undefined, undefined, new ErrorModel("Payment", "Pagamento não encontrado.")));
            return;
        }

        response.status(200).send(new PaymentOutputModel(payment));
    } catch (error: any) {
        response.status(500).send(new PaymentOutputModel(undefined, undefined, new ErrorModel("Server", "Erro ao carregar pagamento.")));
    }
}

async function ConfirmPayment(request: Request, response: Response) {
    try {
        const { paymentId } = request.body;
        await PaymentManager.confirmPayment(paymentId);
        response.status(200).send({ HasError: false, Message: "Pagamento confirmado." });
    } catch (error: any) {
        response.status(500).send(new PaymentOutputModel(undefined, undefined, new ErrorModel("Server", "Erro ao confirmar pagamento.")));
    }
}

async function GenerateMultibanco(request: Request, response: Response) {
    try {
        const { amount } = request.body;
        const data = PaymentManager.generateMultibancoRef(amount);
        response.status(200).send(data);
    } catch (error: any) {
        response.status(500).send({ HasError: true, Error: { Message: "Erro ao gerar referência." } });
    }
}

router.post("/", CreatePayment);
router.get("/:bookingId", GetPayment);
router.post("/confirm", ConfirmPayment);
router.post("/multibanco", GenerateMultibanco);

export default router;