// src/Financial/FinancialRoutes.ts
import { Request, Response, Router } from "express";
import FinancialManager from "./FinancialManager";
import { FinancialOutputModel, ErrorModel } from "./FinancialModel";
import { server } from "../Helpers/DatabaseConnectionHelper";

const router = Router();

async function GetFinancialData(request: Request, response: Response) {
    try {
        const [summary, revenue, transactions] = await Promise.all([
            FinancialManager.getSummary(),
            FinancialManager.getRevenueChart(7),
            FinancialManager.getTransactions(20)
        ]);
        
        response.status(200).json(new FinancialOutputModel(summary, revenue, transactions, "Dados financeiros carregados."));
    } catch (error: any) {
        console.error('Financial error:', error);
        response.status(500).json(new FinancialOutputModel(undefined, undefined, undefined, undefined, new ErrorModel("Server", "Erro ao carregar dados financeiros.")));
    }
}

async function GetSummary(request: Request, response: Response) {
    try {
        const summary = await FinancialManager.getSummary();
        response.status(200).json(new FinancialOutputModel(summary, undefined, undefined, "Resumo carregado."));
    } catch (error: any) {
        response.status(500).json(new FinancialOutputModel(undefined, undefined, undefined, undefined, new ErrorModel("Server", "Erro ao carregar resumo.")));
    }
}

async function GetTransactions(request: Request, response: Response) {
    try {
        const transactions = await FinancialManager.getTransactions();
        response.status(200).json(new FinancialOutputModel(undefined, undefined, transactions, "Transações carregadas."));
    } catch (error: any) {
        response.status(500).json(new FinancialOutputModel(undefined, undefined, undefined, undefined, new ErrorModel("Server", "Erro ao carregar transações.")));
    }
}

// POST - Criar transação
async function CreateTransaction(request: Request, response: Response) {
    try {
        const { bookingId, userId, amount, type, category, description, paymentMethod, transactionDate } = request.body;
        
        if (!amount || !type) {
            response.status(400).json(new FinancialOutputModel(undefined, undefined, undefined, undefined, 
                new ErrorModel("Input", "Amount e type obrigatórios.")));
            return;
        }
        
        const result = await server.query(
            `INSERT INTO transactions (booking_id, user_id, amount, type, category, description, payment_method, transaction_date)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             RETURNING *`,
            [bookingId || null, userId || null, amount, type, category || null, description || null, paymentMethod || null, transactionDate || new Date().toISOString().split('T')[0]]
        );
        
        response.status(201).json(new FinancialOutputModel(undefined, undefined, [result.rows[0]], "Transação criada."));
    } catch (error: any) {
        console.error('CreateTransaction error:', error);
        response.status(500).json(new FinancialOutputModel(undefined, undefined, undefined, undefined, 
            new ErrorModel("Server", "Erro ao criar transação.")));
    }
}


router.get("/", GetFinancialData);
router.get("/summary", GetSummary);
router.get("/transactions", GetTransactions);
router.post("/transaction", CreateTransaction);
export default router;