export interface FinancialSummary {
    periodRevenue: number;
    weeklyRevenue: number;
    expectedIncome: number;
    pendingPayments: number;
    pendingCount: number;
}

export interface RevenueDataPoint {
    date: string;
    revenue: number;
}

export interface Transaction {
    id: number;
    booking_id: number | null;
    user_id: number | null;
    client_name: string | null;
    amount: number;
    type: string;
    category: string | null;
    description: string | null;
    payment_method: string | null;
    transaction_date: string;
}

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

export class FinancialOutputModel {
    Summary?: FinancialSummary;
    Revenue?: RevenueDataPoint[];
    Transactions?: Transaction[];
    Message?: string;
    HasError: boolean;
    Error?: ErrorModel;

    constructor(
        summary?: FinancialSummary,
        revenue?: RevenueDataPoint[],
        transactions?: Transaction[],
        message?: string,
        error?: ErrorModel
    ) {
        this.Summary = summary;
        this.Revenue = revenue;
        this.Transactions = transactions;
        this.Message = message;
        this.Error = error;
        this.HasError = error != undefined;
    }
}