// src/Helpers/AuthorizationMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import UserManager from '../Authentication/AuthenticationManager';

export const Authentication = async (req: Request, res: Response, next: NextFunction) => {
    const sessionKey = req.headers['session-key'] as string || 
                      req.headers['Session-Key'] as string ||
                      req.body?.sessionKey;
    
    // Rejeitar valores placeholder
    if (!sessionKey || sessionKey === '1234' || sessionKey === 'undefined' || sessionKey === 'null') {
        return res.status(401).json({ 
            HasError: true, 
            Error: { Message: "Session key is required" } 
        });
    }
    
    const result = await UserManager.ValidateToken(sessionKey);
    
    if (!result.isValid) {
        return res.status(401).json({ 
            HasError: true, 
            Error: { Message: result.message || "Invalid or expired session" } 
        });
    }
    
    (req as any).userId = result.userId;
    (req as any).sessionKey = sessionKey;
    
    next();
};

export const LoginValidationMiddleware = (publicRoutes: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const path = req.path;
        
        // Verificar se a rota é pública
        if (publicRoutes.some(route => path === route || path.startsWith(route))) {
            return next();
        }
        
        // Se não for pública, requer autenticação
        return Authentication(req, res, next);
    };
};