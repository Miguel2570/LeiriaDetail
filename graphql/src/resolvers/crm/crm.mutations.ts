// src/resolvers/crm/crm.mutations.ts
import { API } from '../../proxy/serviceproxy/api';

export const crmMutations = {
  addClient: async (_: any, { input }: any, context: any) => {
    try {
      const data: any = await API.POST<any>(context, "/CRM", input);
      
      if (data.HasError) {
        return {
          clients: null,
          client: null,
          errors: [{
            field: data.Error?.Field || "crm",
            message: data.Error?.Message || "Erro ao criar cliente",
            code: "CREATE_CLIENT_ERROR"
          }]
        };
      }
      
      return {
        clients: null,
        client: data.Client || null,
        errors: []
      };
      
    } catch (error: any) {
      return {
        clients: null,
        client: null,
        errors: [{
          field: "server",
          message: error.message || "Erro de conexão",
          code: "SERVER_ERROR"
        }]
      };
    }
  },

  // ✅ Renomeado para addClientVehicle
  addClientVehicle: async (_: any, { input }: any, context: any) => {
    try {
      const data: any = await API.POST<any>(context, "/CRM/Vehicle", input);
      
      return {
        hasError: data.HasError || false,
        message: data.HasError
          ? data.Error?.Message
          : "Veículo adicionado com sucesso!"
      };
      
    } catch (error: any) {
      return {
        hasError: true,
        message: error.message || "Erro ao adicionar veículo"
      };
    }
  }
};