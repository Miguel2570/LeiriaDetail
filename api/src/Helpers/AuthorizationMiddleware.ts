// api/src/Helpers/AuthorizationMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import UserManager from '../Authentication/AuthenticationManager';
import logger from './Logger';

const roleHierarchy: Record<string, number> = {
    'superadmin': 4, 'admin': 3, 'manager': 2, 'operator': 1, 'customer': 0
};

export const Authentication = async (req: Request, res: Response, next: NextFunction) => {
    const sessionKey = req.headers['session-key'] as string || req.headers['Session-Key'] as string || req.body?.sessionKey;
    
    if (!sessionKey || sessionKey === '1234' || sessionKey === 'undefined' || sessionKey === 'null') {
        logger.warn('Tentativa de autenticação sem sessionKey');
        return res.status(401).json({ HasError: true, Error: { Message: "Session key is required" } });
    }
    
    const result = await UserManager.ValidateToken(sessionKey);
    
    if (!result.isValid) {
        logger.warn('Token inválido ou expirado');
        return res.status(401).json({ HasError: true, Error: { Message: result.message || "Invalid or expired session" } });
    }
    
    (req as any).userId = result.userId;
    (req as any).sessionKey = sessionKey;
    next();
};

export const LoginValidationMiddleware = (publicRoutes: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const path = req.path;
        if (publicRoutes.some(route => path === route || path.startsWith(route))) return next();
        return Authentication(req, res, next);
    };
};

/**
 * Verifica se o utilizador tem uma das roles especificadas.
 * Aceita múltiplas roles OU uma única role.
 * 
 * @param roles - Uma ou mais roles permitidas
 * 
 * Exemplos:
 *   requireRole('admin')                    // só admin+
 *   requireRole('operator', 'manager')      // operator+ OU manager+
 *   requireRole('operator', 'admin')        // operator+ OU admin+
 */
export const requireRole = (...roles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).userId;
        if (!userId) {
            return res.status(401).json({ HasError: true, Error: { Message: "Autenticação necessária." } });
        }
        
        try {
            const role = await UserManager.GetUserRole(userId);
            const userLevel = roleHierarchy[role] || 0;
            
            // Verifica se o utilizador tem o nível mínimo para PELO MENOS UMA das roles
            const hasAccess = roles.some(minRole => {
                const requiredLevel = roleHierarchy[minRole] || 0;
                return userLevel >= requiredLevel;
            });
            
            if (!hasAccess) {
                logger.warn('Permissão negada', { userId, role, required: roles.join(', ') });
                return res.status(403).json({ 
                    HasError: true, 
                    Error: { Message: `Acesso restrito. Requer uma das roles: ${roles.join(', ')}.` } 
                });
            }
            
            (req as any).userRole = role;
            next();
        } catch (error: any) {
            logger.error('Erro ao verificar permissões', { error: error.message });
            return res.status(500).json({ HasError: true, Error: { Message: "Erro ao verificar permissões." } });
        }
    };
};

export const AdminMiddleware = requireRole('admin');