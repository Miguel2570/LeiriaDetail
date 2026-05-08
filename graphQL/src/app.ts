import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import dotenv from 'dotenv';
// Importamos o schema e os resolvers que definiste (ou vais definir)
import { typeDefs } from './schema/schema'; 
import { resolvers } from './resolvers/teste';

dotenv.config();

const app = express();
// Usamos a porta 4001 para não chocar com o teu outro projeto (4000)
const PORT = Number(process.env.PORT) || 4001;

async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  // É obrigatório iniciar o Apollo antes de aplicar o middleware
  await server.start();

    app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    express.json(),
    expressMiddleware(server) as any
    );

  app.listen(PORT, () => {
    console.log(`🚀 GraphQL Server ready at http://localhost:${PORT}/graphql`);
  });
}

startServer().catch((err) => {
  console.error('Erro ao iniciar o servidor:', err);
});