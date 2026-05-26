// src/Financial/FinancialModel.ts

export class ErrorModel {
    Field?: string;
    Message: string;
    HasError: boolean;

    constructor(field: string | undefined, message: string) {
        this.Field = field;
        this.Message = message;
        this.HasError = true;
    }
}

export interface Transaction {
    id: number;
    booking_id: number;
    user_id: number;
    client_name: string;
    amount: number;
    type: string;
    category: string;
    description: string;
    payment_method: string;
    transaction_date: string;
}

export interface FinancialSummary {
    weeklyRevenue: number;
    expectedIncome: number;
    pendingPayments: number;
    pendingCount: number;
}

export interface RevenueDataPoint {
    date: string;
    revenue: number;
}

export class FinancialOutputModel {
    HasError: boolean;
    Error?: ErrorModel;
    Summary?: FinancialSummary;
    Revenue?: RevenueDataPoint[];
    Transactions?: Transaction[];
    Message?: string;

    constructor(Summary?: FinancialSummary, Revenue?: RevenueDataPoint[], Transactions?: Transaction[], Message?: string, Error?: ErrorModel) {
        this.Summary = Summary;
        this.Revenue = Revenue;
        this.Transactions = Transactions;
        this.Message = Message;
        this.Error = Error;
        this.HasError = (Error != undefined);
    }
}