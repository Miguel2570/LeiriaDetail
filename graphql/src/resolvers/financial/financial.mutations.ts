// src/resolvers/financial/financial.mutations.ts
import { API } from '../../proxy/serviceproxy/api';

export const financialMutations = {
    createTransaction: async (_: any, { input }: any, context: any) => {
        try {
            const data = await API.POST<any>(context, "/Financial/transaction", input);
            return {
                summary: null,
                revenue: null,
                transactions: data.Transactions ? data.Transactions.map(mapTransaction) : null,
                message: data.Message,
                hasError: data.HasError || false,
                error: data.Error || null
            };
        } catch (error: any) {
            return {
                summary: null,
                revenue: null,
                transactions: null,
                message: null,
                hasError: true,
                error: { field: "server", message: error.message }
            };
        }
    }
};

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