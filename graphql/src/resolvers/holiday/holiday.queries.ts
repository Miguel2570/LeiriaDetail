// graphql/src/resolvers/holiday/holiday.queries.ts
import { API } from '../../proxy/serviceproxy/api';

export const holidayQueries = {
    blockedDates: async (_: any, __: any, context: any) => {
        try {
            const data: any = await API.GET<any>(context, "/Holiday");
            return {
                dates: (data.Dates || []).map((d: any) => ({
                    id: d.id,
                    date: d.date,
                    reason: d.reason,
                    isRecurring: d.is_recurring ?? false,  // ✅ Garante que nunca é null
                })),
                hasError: data.HasError || false,
                error: data.Error || null
            };
        } catch (error: any) {
            return { dates: [], hasError: true, error: { field: "server", message: error.message } };
        }
    }
};