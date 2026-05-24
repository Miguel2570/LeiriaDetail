declare module '@apollo/server/express4' {
  import { Request, Response, NextFunction } from 'express';
  import { ApolloServer, BaseContext } from '@apollo/server';

  export function expressMiddleware<TContext extends BaseContext>(
    server: ApolloServer<TContext>,
    options?: {
      context?: (args: { req: Request; res: Response }) => Promise<TContext> | TContext;
    }
  ): (req: Request, res: Response, next: NextFunction) => void;
}