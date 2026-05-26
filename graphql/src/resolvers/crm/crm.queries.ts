// src/resolvers/crm/crm.queries.ts
import { API } from '../../proxy/serviceproxy/api';

export const crmQueries = {
  crmClients: async (_: any, __: any, context: any) => {
    try {
      const data: any = await API.GET<any>(context, "/CRM");
      
      if (data.HasError) {
        return {
          clients: null,
          client: null,
          errors: [{
            field: "crm",
            message: data.Error?.Message || "Erro ao carregar clientes",
            code: "CRM_ERROR"
          }]
        };
      }
      
      return {
        clients: data.Clients || [],
        client: null,
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

  crmClient: async (_: any, { id }: { id: number }, context: any) => {
    try {
      const data: any = await API.GET<any>(context, `/CRM/${id}`);
      
      if (data.HasError) {
        return {
          clients: null,
          client: null,
          errors: [{
            field: "crm",
            message: data.Error?.Message || "Cliente não encontrado",
            code: "CLIENT_NOT_FOUND"
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
  }
};