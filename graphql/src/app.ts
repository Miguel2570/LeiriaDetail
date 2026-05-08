import 'dotenv/config';

import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';

const PORT = process.env.PORT || 4001;

const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5174')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const typeDefs = `#graphql
  type Query {
    hello: String
    status: String
  }
`;

const resolvers = {
  Query: {
    hello: () => 'LeiriaDetail GraphQL OK 🚀',
    status: () => 'running'
  }
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
  });

  await server.start();

  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req, res }: { req: Request; res: Response }) => {
        return { req, res };
    },
    })
  );

  app.get('/health', (_, res) => {
    res.json({ status: 'ok', service: 'graphql' });
  });

  app.listen(PORT, () => {
    console.log(`🚀 GraphQL running at http://localhost:${PORT}/graphql`);
  });
}

startServer();