// src/Helpers/AuthorizationMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import UserManager from '../Authentication/AuthenticationManager';

const roleHierarchy: Record<string, number> = {
    'superadmin': 4,
    'admin': 3,
    'manager': 2,
    'operator': 1,
    'customer': 0
};

export const Authentication = async (req: Request, res: Response, next: NextFunction) => {
    const sessionKey = req.headers['session-key'] as string || 
                      req.headers['Session-Key'] as string ||
                      req.body?.sessionKey;
    
    console.log('🔑 Authentication - sessionKey:', sessionKey ? sessionKey.substring(0, 10) + '...' : 'MISSING');
    
    if (!sessionKey || sessionKey === '1234' || sessionKey === 'undefined' || sessionKey === 'null') {
        console.log('❌ Authentication - sessionKey inválida');
        return res.status(401).json({ 
            HasError: true, 
            Error: { Message: "Session key is required" } 
        });
    }
    
    const result = await UserManager.ValidateToken(sessionKey);
    console.log('🔑 ValidateToken result:', { isValid: result.isValid, userId: result.userId });
    
    if (!result.isValid) {
        console.log('❌ Authentication - token inválido');
        return res.status(401).json({ 
            HasError: true, 
            Error: { Message: result.message || "Invalid or expired session" } 
        });
    }
    
    (req as any).userId = result.userId;
    (req as any).sessionKey = sessionKey;
    console.log('✅ Authentication OK - userId:', result.userId);
    
    next();
};

export const LoginValidationMiddleware = (publicRoutes: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const path = req.path;
        console.log('🛂 LoginValidation - path:', path);
        
        if (publicRoutes.some(route => path === route || path.startsWith(route))) {
            console.log('🟢 Rota pública, skip auth');
            return next();
        }
        
        console.log('🔴 Rota protegida, verificando auth...');
        return Authentication(req, res, next);
    };
};

export const requireRole = (minRole: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).userId;
        const sessionKey = (req as any).sessionKey;
        
        console.log('🔒 requireRole - minRole:', minRole, 'userId:', userId, 'sessionKey:', sessionKey ? 'present' : 'MISSING');
        
        if (!userId) {
            console.log('❌ requireRole - userId em falta!');
            return res.status(401).json({ 
                HasError: true, 
                Error: { Message: "Autenticação necessária." } 
            });
        }

        try {
            const role = await UserManager.GetUserRole(userId);
            const userLevel = roleHierarchy[role] || 0;
            const requiredLevel = roleHierarchy[minRole] || 0;
            
            console.log('🔒 requireRole - role:', role, 'userLevel:', userLevel, 'requiredLevel:', requiredLevel);
            
            if (userLevel < requiredLevel) {
                console.log('❌ requireRole - permissão negada');
                return res.status(403).json({ 
                    HasError: true, 
                    Error: { Message: `Acesso restrito. Requer role: ${minRole}. Tens: ${role}` } 
                });
            }
            
            (req as any).userRole = role;
            console.log('✅ requireRole OK');
            next();
        } catch (error) {
            console.log('💥 requireRole - erro:', error);
            return res.status(500).json({ 
                HasError: true, 
                Error: { Message: "Erro ao verificar permissões." } 
            });
        }
    };
};

export const AdminMiddleware = requireRole('admin');