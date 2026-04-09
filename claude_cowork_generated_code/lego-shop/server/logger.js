import winston from 'winston';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logsDir = path.join(__dirname, 'logs');

// Ensure logs directory exists
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Ensure orders subdirectory exists
const ordersLogsDir = path.join(logsDir, 'orders');
if (!fs.existsSync(ordersLogsDir)) {
  fs.mkdirSync(ordersLogsDir, { recursive: true });
}

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const metaStr = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
    return `${timestamp} [${level}]: ${message} ${metaStr}`;
  })
);

// Technical Logger - HTTP calls, server startup, errors
export const technicalLogger = winston.createLogger({
  level: 'info',
  format: logFormat,
  transports: [
    new winston.transports.File({
      filename: path.join(logsDir, 'technical.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
});

// Add console transport in development
if (process.env.NODE_ENV === 'development') {
  technicalLogger.add(
    new winston.transports.Console({
      format: consoleFormat,
    })
  );
}

// Business Logger - order creation, status changes, payments
export const businessLogger = winston.createLogger({
  level: 'info',
  format: logFormat,
  transports: [
    new winston.transports.File({
      filename: path.join(logsDir, 'business.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
});

// Add console transport in development
if (process.env.NODE_ENV === 'development') {
  businessLogger.add(
    new winston.transports.Console({
      format: consoleFormat,
    })
  );
}

// Order Logger Factory - per-order events
export function orderLogger(orderId) {
  const logFile = path.join(ordersLogsDir, `${orderId}.log`);

  const logger = winston.createLogger({
    level: 'info',
    format: logFormat,
    transports: [
      new winston.transports.File({
        filename: logFile,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
      }),
    ],
  });

  // Add console transport in development
  if (process.env.NODE_ENV === 'development') {
    logger.add(
      new winston.transports.Console({
        format: consoleFormat,
      })
    );
  }

  return logger;
}
