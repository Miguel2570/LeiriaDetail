import { API } from '../../proxy/serviceproxy/api';

export const staffQueries = {
    staffList: async (_: any, __: any, context: any) => {
        try {
            const data: any = await API.GET<any>(context, "/Staff/");

            return {
                staff: (data.Staff || []).map(mapStaff),
                message: data.Message,
                hasError: data.HasError || false,
                error: data.Error || null
            };
        } catch (error: any) {
            return {
                staff: [],
                message: null,
                hasError: true,
                error: { field: "server", message: error.message }
            };
        }
    },

    staffById: async (_: any, { id }: { id: string }, context: any) => {
        try {
            const data: any = await API.GET<any>(context, `/Staff/${id}`);

            return {
                staff: (data.Staff || []).map(mapStaff),
                message: data.Message,
                hasError: data.HasError || false,
                error: data.Error || null
            };
        } catch (error: any) {
            return {
                staff: [],
                message: null,
                hasError: true,
                error: { field: "server", message: error.message }
            };
        }
    }
};

function mapStaff(s: any) {
    return {
        id: s.id?.toString(),
        name: s.name,
        email: s.email,
        role: s.role,
        status: s.status,
        tasks: s.tasks || 0
    };
}