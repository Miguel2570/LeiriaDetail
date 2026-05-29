import winston from 'winston';

// Só importa Elasticsearch se estiveres em produção
let esTransport: any = null;
if (process.env.NODE_ENV === 'production') {
    const { ElasticsearchTransport } = require('winston-elasticsearch');
    esTransport = new ElasticsearchTransport({
        level: 'info',
        clientOpts: {
            node: process.env.ELASTIC_URL || 'http://localhost:9200',
        },
        indexPrefix: 'leiriadetail-logs',
        indexSuffixPattern: 'YYYY.MM.DD',
    });
}

const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),
    defaultMeta: { service: 'leiriadetail-api' },
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.printf(({ timestamp, level, message, ...meta }) => {
                    const metaStr = Object.keys(meta).length > 1 ? JSON.stringify(meta, null, 0) : '';
                    return `${timestamp} [${level}]: ${message} ${metaStr}`;
                })
            ),
        }),
        new winston.transports.File({ 
            filename: 'logs/error.log', 
            level: 'error',
            maxsize: 5242880,
            maxFiles: 5,
        }),
        new winston.transports.File({ 
            filename: 'logs/combined.log',
            maxsize: 5242880,
            maxFiles: 5,
        }),
    ],
});

// Adicionar Elasticsearch em produção
if (esTransport) {
    logger.add(esTransport);
}

export default logger;