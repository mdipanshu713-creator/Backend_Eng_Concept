import pino from 'pino';
import { env } from '../config/env';

// Development: readable logs; production: JSON logs
export const logger = pino({
    level: env.logLevel, // Minimum log level

    transport: env.isProduction
        ? undefined // Use default JSON output
        : {
            target: 'pino-pretty', // Human-readable logs
            options: {
                colorize: true, // Add colors to logs
                translateTime: 'SYS:standard', // Readable timestamps
            },
        },
});