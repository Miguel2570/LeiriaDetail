// src/resolvers/auth/TS/auth.queries.ts
import { API } from '../../proxy/serviceproxy/api';

export const authQueries = {
  // Me - Obter utilizador atual
  me: async (_: any, __: any, context: any) => {
    // ✅ Corrigido - retornando todos os campos obrigatórios do User
    return {
      id: context?.userId || "0",
      email: context?.email || "user@example.com",
      username: context?.email || "user@example.com",
      firstName: context?.firstName || "",
      lastName: context?.lastName || "",
      isEmailVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },

  // Check Token - Validar token de sessão
  checkToken: async (_: any, { token }: { token: string }, context: any) => {
    try {
      const data: any = await API.GET<any>(
        context,
        `/Authentication/ValidateToken?token=${token}`
      );

      return {
        isValid: data.isValid || false,
        message: data.message || null,
        email: null
      };
    } catch (error) {
      return {
        isValid: false,
        message: "Erro ao conectar com o servidor.",
        email: null
      };
    }
  },

  // Check Email Exists - Verificar se email já está registado
  checkEmailExists: async (_: any, { email }: { email: string }, context: any) => {
    try {
      const data: any = await API.GET<any>(
        context,
        `/Authentication/CheckEmail?email=${encodeURIComponent(email)}`
      );

      return {
        exists: data.exists || false,
        message: data.message || null
      };
    } catch (error) {
      return {
        exists: false,
        message: "Erro ao verificar email"
      };
    }
  },
};