// src/resolvers/financial/financial.queries.ts
import { API } from '../../proxy/serviceproxy/api';

export const financialQueries = {
    financialData: async (_: any, __: any, context: any) => {
        try {
            const data = await API.GET<any>(context, "/Financial/");
            return {
                summary: data.Summary ? mapSummary(data.Summary) : null,
                revenue: (data.Revenue || []).map(mapRevenue),
                transactions: (data.Transactions || []).map(mapTransaction),
                message: data.Message,
                hasError: data.HasError || false,
                error: data.Error || null
            };
        } catch (error: any) {
            return { summary: null, revenue: [], transactions: [], message: null, hasError: true, error: { field: "server", message: error.message } };
        }
    },
    financialSummary: async (_: any, __: any, context: any) => {
        try {
            const data = await API.GET<any>(context, "/Financial/summary");
            return {
                summary: data.Summary ? mapSummary(data.Summary) : null,
                revenue: null, transactions: null,
                message: data.Message, hasError: data.HasError || false, error: data.Error || null
            };
        } catch (error: any) {
            return { summary: null, revenue: null, transactions: null, message: null, hasError: true, error: { field: "server", message: error.message } };
        }
    },
    financialTransactions: async (_: any, __: any, context: any) => {
        try {
            const data = await API.GET<any>(context, "/Financial/transactions");
            return {
                summary: null, revenue: null,
                transactions: (data.Transactions || []).map(mapTransaction),
                message: data.Message, hasError: data.HasError || false, error: data.Error || null
            };
        } catch (error: any) {
            return { summary: null, revenue: null, transactions: [], message: null, hasError: true, error: { field: "server", message: error.message } };
        }
    }
};

function mapSummary(s: any) {
    return {
        weeklyRevenue: s.weeklyRevenue,
        expectedIncome: s.expectedIncome,
        pendingPayments: s.pendingPayments,
        pendingCount: s.pendingCount
    };
}

function mapRevenue(r: any) {
    return { date: r.date, revenue: r.revenue };
}

function mapTransaction(t: any) {
    return {
        id: t.id?.toString(),
        bookingId: t.booking_id,
        userId: t.user_id,
        clientName: t.client_name,
        amount: t.amount,
        type: t.type,
        category: t.category,
        description: t.description,
        paymentMethod: t.payment_method,
        transactionDate: t.transaction_date
    };
}