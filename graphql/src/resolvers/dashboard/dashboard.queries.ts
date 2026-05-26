// src/resolvers/dashboard/dashboard.queries.ts
import { API } from '../../proxy/serviceproxy/api';

export const dashboardQueries = {
  dashboard: async (_: any, __: any, context: any) => {
    try {
      const data: any = await API.GET<any>(context, "/Dashboard");
      
      if (data.HasError) {
        return {
          metrics: null,
          revenue: [],
          activityLogs: [],
          errors: [{
            field: "dashboard",
            message: data.Error?.Message || "Erro ao carregar dashboard",
            code: "DASHBOARD_ERROR"
          }]
        };
      }
      
      return {
        metrics: data.Metrics,
        revenue: data.Revenue || [],
        activityLogs: data.ActivityLogs || [],
        errors: []
      };
      
    } catch (error: any) {
      return {
        metrics: null,
        revenue: [],
        activityLogs: [],
        errors: [{
          field: "server",
          message: error.message || "Erro de conexão",
          code: "SERVER_ERROR"
        }]
      };
    }
  }
};