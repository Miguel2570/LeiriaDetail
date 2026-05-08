import 'dotenv/config';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

const PORT = parseInt(process.env.PORT || '4001', 10);

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
  // Inicializamos apenas o Apollo
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  // O Standalone substitui o Express, o BodyParser e o expressMiddleware
  const { url } = await startStandaloneServer(server, {
    listen: { port: PORT },
    context: async ({ req, res }) => {
      return { req, res };
    },
  });

  console.log(`🚀 GraphQL running at ${url}`);
}

startServer();