// api/src/Helpers/HttpLogger.ts
import { Request, Response, NextFunction } from 'express';
import logger from './Logger';

export const httpLogger = (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    
    res.on('finish', () => {
        const duration = Date.now() - start;
        logger.info('HTTP Request', {
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            duration: `${duration}ms`,
            ip: req.ip,
        });
    });
    
    next();
};