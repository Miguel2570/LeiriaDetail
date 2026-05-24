// src/resolvers/auth/TS/auth.mutation.ts
import { API } from '../../proxy/serviceproxy/api';

export const authMutations = {
  // Register - Criar nova conta
  register: async (_: any, { input }: any, context: any) => {
    const { email, password, firstName, lastName } = input;
    
    try {
      const data: any = await API.POST<any>(context, "/Authentication/Register", {
        email,
        password,
        firstName,
        lastName
      });

      if (data.HasError) {
        return {
          user: null,
          tokens: null,
          message: null,
          emailSent: false,
          errors: [{
            field: data.Error?.Field || "general",
            message: data.Error?.Message || "Erro no registo",
            code: "REGISTRATION_ERROR",
          }],
        };
      }

      // ✅ Corrigido - retornando todos os campos obrigatórios do User
      return {
        user: {
          id: "0",
          email: email,
          username: email,
          firstName: firstName,
          lastName: lastName,
          isEmailVerified: false,
          createdAt: new Date().toISOString(),
          updatedAt: null
        },
        tokens: null,
        message: data.Message || "Email de verificação enviado com sucesso.",
        errors: [],
      };
    } catch (error: any) {
      return {
        user: null,
        tokens: null,
        message: null,
        errors: [{
          field: "general",
          message: error.message || "Erro no registo",
          code: "REGISTRATION_ERROR",
        }],
      };
    }
  },

  // Login - Autenticar utilizador
  login: async (_: any, { input }: any, context: any) => {
    const { email, password } = input;
    
    try {
      const data: any = await API.POST<any>(context, "/Authentication/Login", {
        email,
        password
      });

      console.log('Login response:', JSON.stringify(data)); // Debug

      if (data.HasError || !data.SessionKey) {
        return {
          user: null,
          tokens: null,
          errors: [{
            field: data?.Error?.Field || "auth",
            message: data?.Error?.Message || "Login failed",
            code: "INVALID_CREDENTIALS",
          }],
        };
      }

      // ✅ Login bem sucedido
      return {
        user: {
          id: data.CredencialKey?.toString() || "0",
          email: email,
          username: email,
          firstName: "",
          lastName: "",
          isEmailVerified: true,
          createdAt: new Date().toISOString(),
          updatedAt: null
        },
        tokens: {
          accessToken: data.SessionKey,
          refreshToken: data.SessionKey,
          expiresIn: 86400
        },
        errors: [],
      };

    } catch (error: any) {
      console.error('Login error:', error.message);
      
      const isConnectionError = error.message?.includes("TECHNICAL_ERROR") ||
                                error.message?.includes("ECONNREFUSED");

      return {
        user: null,
        tokens: null,
        errors: [{
          field: isConnectionError ? "server" : "auth",
          message: isConnectionError
            ? "Erro de conexão com API"
            : error.message || "Login failed",
          code: isConnectionError ? "SERVER_ERROR" : "INVALID_CREDENTIALS"
        }],
      };
    }
  },

  // Verify Account - Ativar conta por email
  verifyAccount: async (_: any, { token }: { token: string }, context: any) => {
    try {
      const data: any = await API.GET<any>(
        context,
        `/Authentication/Verify?token=${token}`
      );

      return {
        success: !data.HasError,
        message: data.HasError ? data.Error?.Message : "Conta ativada com sucesso!"
      };
    } catch (error) {
      return {
        success: false,
        message: "Erro ao conectar com o serviço de autenticação."
      };
    }
  },

  // Resend Verification Email - Reenviar email de verificação
  resendVerificationEmail: async (_: any, { email }: { email: string }, context: any) => {
    try {
      const data: any = await API.POST<any>(
        context,
        "/Authentication/Resend-Verification",
        { email }
      );

      return {
        hasError: data.HasError || false,
        message: data.HasError 
          ? data.Error?.Message 
          : data.Message || "Email de verificação reenviado com sucesso!"
      };
    } catch (error) {
      return {
        hasError: true,
        message: "Erro ao reenviar email de verificação"
      };
    }
  },

  // Recover Password - Iniciar recuperação de password
  recoverPassword: async (_: any, { email }: { email: string }, context: any) => {
    try {
      const data: any = await API.POST<any>(
        context,
        "/Authentication/Reset-Password",
        { email }
      );

      return {
        hasError: data.HasError || false,
        message: data.HasError
          ? data.Error?.Message || "Erro ao enviar email"
          : "E-mail de recuperação enviado! Verifica a tua caixa de entrada."
      };
    } catch (error) {
      return {
        hasError: true,
        message: "Erro ao conectar com o servidor."
      };
    }
  },

  // Change Password (com token de recuperação)
  changePassword: async (
    _: any, 
    { token, password }: { token: string; password: string }, 
    context: any
  ) => {
    try {
      const data: any = await API.POST<any>(
        context,
        "/Authentication/Change-Password",
        { securityToken: token, password }
      );

      return {
        hasError: data.HasError || false,
        message: data.HasError 
          ? data.Error?.Message 
          : "Password alterada com sucesso!"
      };
    } catch (error) {
      return {
        hasError: true,
        message: "Erro ao conectar com o servidor."
      };
    }
  },

  // Change Account Password (utilizador autenticado)
  changeAccountPassword: async (
    _: any,
    { currentPassword, newPassword }: { currentPassword: string; newPassword: string },
    context: any
  ) => {
    try {
      const data: any = await API.POST<any>(
        context,
        "/Authentication/Change-Account-Password",
        { currentPassword, newPassword }
      );

      return {
        hasError: data.HasError || false,
        message: data.HasError 
          ? data.Error?.Message 
          : "Password alterada com sucesso!"
      };
    } catch (error) {
      return {
        hasError: true,
        message: "Erro ao conectar com o servidor."
      };
    }
  },

  // Verify Password - Verificar password atual
  verifyPassword: async (
    _: any,
    { password }: { password: string },
    context: any
  ) => {
    try {
      const data: any = await API.POST<any>(
        context,
        "/Authentication/verify-password",
        { password }
      );

      if (data.success) {
        return { success: true, errors: [], hasError: false };
      }

      return {
        success: false,
        errors: [{ 
          field: "password", 
          message: data.error || "Invalid password", 
          code: "INVALID" 
        }],
        hasError: true
      };

    } catch (error: any) {
      return {
        success: false,
        errors: [{ 
          field: "server", 
          message: error.message, 
          code: "UNKNOWN_ERROR" 
        }],
        hasError: true
      };
    }
  },
};