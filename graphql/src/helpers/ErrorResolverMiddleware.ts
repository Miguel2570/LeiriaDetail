// graphql/src/helpers/Middleware.ts
import { GraphQLError } from 'graphql';

export function ErrorResolverMiddleware(errors: readonly GraphQLError[], response: any) {
  if (!errors || errors.length === 0) return;

  const error = errors[0];
  const message = error.message || '';
  const code = (error.extensions?.code as string) || '';

  // 🔥 Sessão expirada
  if (code === 'UNAUTHENTICATED' || 
      message.includes('session') || 
      message.includes('expired') ||
      message.includes('Token inválido') ||
      message.includes('Session key is required')) {
    response.http.status = 401;
    response.http.headers = response.http.headers || {};
    response.http.headers['X-Session-Expired'] = 'true';
  }
  // Acesso negado
  else if (code === 'FORBIDDEN' || message.includes('Acesso restrito')) {
    response.http.status = 403;
  }
  // Erro de base de dados
  else if (message.includes('database') || message.includes('Database')) {
    response.http.status = 503;
  }
  // Erro de serviço
  else if (message.includes('ECONNREFUSED') || message.includes('fetch failed')) {
    response.http.status = 503;
  }
  // Erro genérico
  else {
    response.http.status = 500;
  }
}