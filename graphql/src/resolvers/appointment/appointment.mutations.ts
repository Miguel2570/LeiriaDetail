import { API } from '../../proxy/serviceproxy/api';

export const appointmentMutations = {
  createBooking: async (_: any, { input }: any, context: any) => {
    try {
      const data: any = await API.POST<any>(context, "/Appointments", input);
      
      return {
        hasError: data.HasError || false,
        message: data.HasError
          ? data.Error?.Message
          : "Marcação criada com sucesso!"
      };
      
    } catch (error: any) {
      return {
        hasError: true,
        message: error.message || "Erro ao criar marcação"
      };
    }
  },

  moveBooking: async (_: any, { input }: any, context: any) => {
    try {
      const data: any = await API.POST<any>(context, "/Appointments/Move", input);
      
      return {
        hasError: data.HasError || false,
        message: data.HasError
          ? data.Error?.Message
          : "Marcação movida com sucesso!"
      };
      
    } catch (error: any) {
      return {
        hasError: true,
        message: error.message || "Erro ao mover marcação"
      };
    }
  },

  updateBookingStatus: async (_: any, { input }: any, context: any) => {
    try {
      const data: any = await API.PUT<any>(context, "/Appointments/Status", input);
      
      return {
        hasError: data.HasError || false,
        message: data.HasError
          ? data.Error?.Message
          : "Status atualizado com sucesso!"
      };
      
    } catch (error: any) {
      return {
        hasError: true,
        message: error.message || "Erro ao atualizar status"
      };
    }
  }
};