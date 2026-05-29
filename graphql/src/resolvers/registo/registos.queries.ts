// src/resolvers/registos/registos.queries.ts
import { API } from '../../proxy/serviceproxy/api';

export const registosQueries = {
  registosServices: async (_: any, { status, clientId }: any, context: any) => {
    try {
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      if (clientId) params.append('clientId', clientId.toString());
      
      const data: any = await API.GET<any>(context, `/Registos?${params.toString()}`);
      
      if (data.HasError) {
        return {
          services: null,
          service: null,
          stats: null,
          totalCount: 0,
          errors: [{
            field: "registos",
            message: data.Error?.Message || "Erro ao carregar serviços",
            code: "REGISTOS_ERROR"
          }]
        };
      }
      
      return {
        services: data.Services || [],
        service: null,
        stats: null,
        totalCount: data.Services?.length || 0,
        errors: []
      };
      
    } catch (error: any) {
      return {
        services: null,
        service: null,
        stats: null,
        totalCount: 0,
        errors: [{
          field: "server",
          message: error.message || "Erro de conexão",
          code: "SERVER_ERROR"
        }]
      };
    }
  },

  registosActiveServices: async (_: any, __: any, context: any) => {
    try {
      const data: any = await API.GET<any>(context, "/Registos/Active");
      
      if (data.HasError) {
        return {
          services: null,
          service: null,
          stats: null,
          errors: [{
            field: "registos",
            message: data.Error?.Message || "Erro ao carregar serviços ativos",
            code: "REGISTOS_ERROR"
          }]
        };
      }
      
      return {
        services: data.Services || [],
        service: null,
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

  registosService: async (_: any, { id }: { id: number }, context: any) => {
    try {
      const data: any = await API.GET<any>(context, `/Registos/${id}`);
      
      if (data.HasError) {
        return {
          services: null,
          service: null,
          stats: null,
          errors: [{
            field: "registos",
            message: data.Error?.Message || "Serviço não encontrado",
            code: "SERVICE_NOT_FOUND"
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

  registosStats: async (_: any, __: any, context: any) => {
    try {
      const data: any = await API.GET<any>(context, "/Registos/Stats");
      
      if (data.HasError) {
        return {
          services: null,
          service: null,
          stats: null,
          errors: [{
            field: "registos",
            message: data.Error?.Message || "Erro ao carregar estatísticas",
            code: "STATS_ERROR"
          }]
        };
      }
      
      return {
        services: null,
        service: null,
        stats: data.Stats || null,
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

  registosClientHistory: async (_: any, { clientId }: { clientId: number }, context: any) => {
    try {
      const data: any = await API.GET<any>(context, `/Registos/Client/${clientId}`);
      
      if (data.HasError) {
        return {
          services: null,
          service: null,
          stats: null,
          errors: [{
            field: "registos",
            message: data.Error?.Message || "Erro ao carregar histórico",
            code: "HISTORY_ERROR"
          }]
        };
      }
      
      return {
        services: data.Services || [],
        service: null,
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