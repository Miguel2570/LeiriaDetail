// graphql/src/resolvers/holiday/holiday.mutations.ts
import { API } from '../../proxy/serviceproxy/api';

export const holidayMutations = {
    addBlockedDate: async (_: any, { input }: any, context: any) => {
        try {
            const data: any = await API.POST<any>(context, "/Holiday", input);
            return {
                dates: data.Date ? [data.Date] : [],
                hasError: data.HasError || false,
                error: data.Error || null
            };
        } catch (error: any) {
            return { dates: [], hasError: true, error: { field: "server", message: error.message } };
        }
    },
    removeBlockedDate: async (_: any, { id }: any, context: any) => {
        try {
            const data: any = await API.DELETE<any>(context, `/Holiday/${id}`);
            return { hasError: data.HasError || false, message: data.Message || "Removido." };
        } catch (error: any) {
            return { hasError: true, message: error.message };
        }
    }
};