// src/resolvers/holiday/holiday.queries.ts
import { API } from '../../proxy/serviceproxy/api';

export const holidayQueries = {
    blockedDates: async (_: any, __: any, context: any) => {
        try {
            const data: any = await API.GET<any>(context, "/Holiday/");
            return {
                dates: (data.Dates || []).map((d: any) => ({
                    id: d.id?.toString(),
                    date: d.date,
                    reason: d.reason,
                    isRecurring: d.is_recurring || false
                })),
                hasError: data.HasError || false,
                error: null
            };
        } catch (error: any) {
            return { dates: [], hasError: true, error: { field: "server", message: error.message } };
        }
    },

    isDateBlocked: async (_: any, { date }: { date: string }, context: any) => {
        try {
            const data: any = await API.GET<any>(context, `/Holiday/check?date=${date}`);
            return data.blocked || false;
        } catch (error: any) {
            return false;
        }
    }
};