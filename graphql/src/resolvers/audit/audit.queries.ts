import { API } from '../../proxy/serviceproxy/api';

export const auditQueries = {
    auditLogs: async (_: any, __: any, context: any) => {
        try {
            const data: any = await API.GET<any>(context, "/Audit");
            return {
                logs: (data.Logs || []).map((log: any) => ({
                    id: log.id,
                    userId: log.user_id,
                    email: log.email,
                    action: log.action,
                    details: log.details ? JSON.stringify(log.details) : '',
                    createdAt: log.created_at,
                })),
                hasError: data.HasError || false
            };
        } catch (error: any) {
            return { logs: [], hasError: true };
        }
    }
};