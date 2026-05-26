import { API } from '../../proxy/serviceproxy/api';

export const appointmentQueries = {
  appointments: async (_: any, { date }: { date?: string }, context: any) => {
    try {
      const url = date ? `/Appointments?date=${date}` : '/Appointments';
      const data: any = await API.GET<any>(context, url);
      
      if (data.HasError) {
        return {
          data: null,
          errors: [{
            field: "appointments",
            message: data.Error?.Message || "Erro ao carregar marcações",
            code: "APPOINTMENTS_ERROR"
          }]
        };
      }
      
      return {
        data: data.Data || { pending: [], bays: [] },
        errors: []
      };
      
    } catch (error: any) {
      return {
        data: null,
        errors: [{
          field: "server",
          message: error.message || "Erro de conexão",
          code: "SERVER_ERROR"
        }]
      };
    }
  }
};