import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { Request, Response } from 'express';
import { GraphQLError } from 'graphql';

import typeDefs from './schema/schema-manager';
import resolvers from './resolvers';

const PORT = process.env.PORT || 4001;

const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5174,http://localhost:5173')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

// 🔥 Plugin para formatar erros e definir status HTTP
const errorHandlerPlugin = {
  async requestDidStart() {
    return {
      async didEncounterErrors({ errors, response }: { errors: readonly GraphQLError[]; response: any }) {
        if (!errors || errors.length === 0) return;

        const error = errors[0];
        const message = (error.message || '').toLowerCase();
        const code = (error.extensions?.code as string) || '';

        // Definir status HTTP baseado no tipo de erro
        if (
          code === 'UNAUTHENTICATED' ||
          message.includes('session') ||
          message.includes('expired') ||
          message.includes('token inválido') ||
          message.includes('token is required') ||
          message.includes('session key is required') ||
          message.includes('unauthorized')
        ) {
          response.http.status = 401;
        }
        else if (
          code === 'FORBIDDEN' ||
          message.includes('acesso restrito') ||
          message.includes('access denied') ||
          message.includes('não tem permissões')
        ) {
          response.http.status = 403;
        }
        else if (
          message.includes('database') ||
          message.includes('connection refused') ||
          message.includes('unable to connect')
        ) {
          response.http.status = 503;
        }
        else if (
          message.includes('econnrefused') ||
          message.includes('fetch failed') ||
          message.includes('timeout')
        ) {
          response.http.status = 503;
        }
        else {
          response.http.status = 500;
        }
      },
    };
  },
};

async function startServer() {
  const app = express();

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(null, false);
        }
      },
      credentials: true,
    })
  );

  app.use(cookieParser());
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    // 🔥 Adicionar plugins
    plugins: [errorHandlerPlugin],
    // 🔥 Formatar erros para incluir código
    formatError: (formattedError, error) => {
      // Log do erro no servidor
      console.error('GraphQL Error:', {
        message: formattedError.message,
        code: formattedError.extensions?.code,
        path: formattedError.path,
      });

      // Retornar erro formatado para o cliente
      return {
        message: formattedError.message,
        extensions: {
          code: formattedError.extensions?.code || 'INTERNAL_SERVER_ERROR',
          status: formattedError.extensions?.status || 500,
        },
      };
    },
  });

  await server.start();

  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req, res }: { req: Request; res: Response }) => ({ 
        req, 
        res 
      }),
    })
  );

  // 🔥 Rota de health check
  app.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.listen(PORT, () => {
    console.log(`🚀 GraphQL server running at http://localhost:${PORT}/graphql`);
  });
}

startServer();