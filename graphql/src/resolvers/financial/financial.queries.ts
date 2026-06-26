// src/resolvers/financial/financial.queries.ts
import { API } from '../../proxy/serviceproxy/api';

export const financialQueries = {
    financialData: async (_: any, { period }: { period?: string }, context: any) => {
        try {
            const queryParam = period ? `?period=${period}` : '';
            const data = await API.GET<any>(context, `/Financial/${queryParam}`);
            
            return {
                summary: data.Summary ? mapSummary(data.Summary) : null,
                revenue: (data.Revenue || []).map(mapRevenue),
                transactions: (data.Transactions || []).map(mapTransaction),
                message: data.Message,
                hasError: data.HasError || false,
                error: data.Error || null
            };
        } catch (error: any) {
            return { 
                summary: null, revenue: [], transactions: [], 
                message: null, hasError: true, 
                error: { field: "server", message: error.message } 
            };
        }
    },
    
    financialSummary: async (_: any, { period }: { period?: string }, context: any) => {
        try {
            const queryParam = period ? `?period=${period}` : '';
            const data = await API.GET<any>(context, `/Financial/summary${queryParam}`);
            
            return {
                summary: data.Summary ? mapSummary(data.Summary) : null,
                revenue: null, transactions: null,
                message: data.Message, hasError: data.HasError || false, 
                error: data.Error || null
            };
        } catch (error: any) {
            return { 
                summary: null, revenue: null, transactions: null, 
                message: null, hasError: true, 
                error: { field: "server", message: error.message } 
            };
        }
    },
    
    financialTransactions: async (_: any, __: any, context: any) => {
        try {
            const data = await API.GET<any>(context, "/Financial/transactions");
            
            return {
                summary: null, revenue: null,
                transactions: (data.Transactions || []).map(mapTransaction),
                message: data.Message, hasError: data.HasError || false, 
                error: data.Error || null
            };
        } catch (error: any) {
            return { 
                summary: null, revenue: null, transactions: [], 
                message: null, hasError: true, 
                error: { field: "server", message: error.message } 
            };
        }
    }
};

function mapSummary(s: any) {
    return {
        periodRevenue: s.periodRevenue || s.weeklyRevenue || 0,
        weeklyRevenue: s.weeklyRevenue || s.periodRevenue || 0,
        expectedIncome: s.expectedIncome || 0,
        pendingPayments: s.pendingPayments || 0,
        pendingCount: s.pendingCount || 0
    };
}

function mapRevenue(r: any) {
    return { date: r.date, revenue: r.revenue || 0 };
}

function mapTransaction(t: any) {
    return {
        id: t.id?.toString(),
        bookingId: t.booking_id,
        userId: t.user_id,
        clientName: t.client_name,
        amount: t.amount || 0,
        type: t.type,
        category: t.category,
        description: t.description,
        paymentMethod: t.payment_method,
        transactionDate: t.transaction_date
    };
}