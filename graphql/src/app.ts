import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { Request, Response } from 'express';

import typeDefs from './schema/schema-manager';
import resolvers from './resolvers';

// Mantemos o 4001 porque é o que tens no teu docker-compose.yml
const PORT = process.env.PORT || 4001;

/**
 * Lista de origins permitidas, separadas por vírgula no .env
 * Como o teu frontend do Vite corre na porta 5174, vamos incluí-lo como default.
 */
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5174,http://localhost:5173')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

async function startServer() {
  const app = express();

  /**
   * Configuração de CORS
   */
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

  /**
   * Permite ler cookies (útil para Autenticação JWT)
   */
  app.use(cookieParser());

  /**
   * Aumentar o limite para permitir uploads de fotos (Base64) ou requests grandes
   */
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

  /**
   * Configuração do Apollo Server
   */
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  /**
   * Middleware do GraphQL com injeção do contexto
   */
  app.use(
  '/graphql',
    expressMiddleware(server, {
      context: async ({ req, res }: { req: Request; res: Response }) => ({ 
        req, 
        res 
      }),
    })
  );

  /**
   * Arranque do servidor GraphQL
   */
  app.listen(PORT, () => {
    console.log(`🚀 GraphQL server running at http://localhost:${PORT}/graphql`);
  });
}

startServer();