// src/resolvers/registos/registos.mutations.ts
import { API } from '../../proxy/serviceproxy/api';

export const registosMutations = {
  createService: async (_: any, { input }: any, context: any) => {
    try {
      const data: any = await API.POST<any>(context, "/Registos", input);
      
      if (data.HasError) {
        return {
          services: null,
          service: null,
          stats: null,
          errors: [{
            field: data.Error?.Field || "registos",
            message: data.Error?.Message || "Erro ao criar serviço",
            code: "CREATE_SERVICE_ERROR"
          }]
        };
      }
      
      return {
        services: null,
        service: data.Service || null,
        stats: null,
        errors: []
      };
      
    } catch (error: any) {
      return {
        services: null,
        service: null,
        stats: null,
        errors: [{
          field: "server",
          message: error.message || "Erro de conexão",
          code: "SERVER_ERROR"
        }]
      };
    }
  },

  startService: async (_: any, { serviceId }: { serviceId: number }, context: any) => {
    try {
      const data: any = await API.POST<any>(context, `/Registos/${serviceId}/Start`, {});
      
      if (data.HasError) {
        return {
          services: null,
          service: null,
          stats: null,
          errors: [{
            field: data.Error?.Field || "registos",
            message: data.Error?.Message || "Erro ao iniciar serviço",
            code: "START_SERVICE_ERROR"
          }]
        };
      }
      
      return {
        services: null,
        service: data.Service || null,
        stats: null,
        errors: []
      };
      
    } catch (error: any) {
      return {
        services: null,
        service: null,
        stats: null,
        errors: [{
          field: "server",
          message: error.message || "Erro de conexão",
          code: "SERVER_ERROR"
        }]
      };
    }
  },

  updateServiceChecklist: async (_: any, { input }: any, context: any) => {
    try {
      const data: any = await API.PUT<any>(context, `/Registos/${input.serviceId}/Checklist`, {
        checklist: input.checklist,
        notes: input.notes,
        progress: input.progress
      });
      
      if (data.HasError) {
        return {
          services: null,
          service: null,
          stats: null,
          errors: [{
            field: data.Error?.Field || "registos",
            message: data.Error?.Message || "Erro ao atualizar checklist",
            code: "UPDATE_CHECKLIST_ERROR"
          }]
        };
      }
      
      return {
        services: null,
        service: data.Service || null,
        stats: null,
        errors: []
      };
      
    } catch (error: any) {
      return {
        services: null,
        service: null,
        stats: null,
        errors: [{
          field: "server",
          message: error.message || "Erro de conexão",
          code: "SERVER_ERROR"
        }]
      };
    }
  },

  completeService: async (_: any, { input }: any, context: any) => {
    try {
      const data: any = await API.POST<any>(context, `/Registos/${input.serviceId}/Complete`, {
        totalValue: input.totalValue
      });
      
      if (data.HasError) {
        return {
          services: null,
          service: null,
          stats: null,
          errors: [{
            field: data.Error?.Field || "registos",
            message: data.Error?.Message || "Erro ao concluir serviço",
            code: "COMPLETE_SERVICE_ERROR"
          }]
        };
      }
      
      return {
        services: null,
        service: data.Service || null,
        stats: null,
        errors: []
      };
      
    } catch (error: any) {
      return {
        services: null,
        service: null,
        stats: null,
        errors: [{
          field: "server",
          message: error.message || "Erro de conexão",
          code: "SERVER_ERROR"
        }]
      };
    }
  }
};