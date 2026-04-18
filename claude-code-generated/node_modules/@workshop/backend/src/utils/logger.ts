import winston from 'winston';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const logsDir = join(__dirname, '..', '..', 'logs');
const ordersLogsDir = join(logsDir, 'orders');

if (!existsSync(logsDir)) mkdirSync(logsDir, { recursive: true });
if (!existsSync(ordersLogsDir)) mkdirSync(ordersLogsDir, { recursive: true });

export const logsDirectory = logsDir;

export const technicalLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: join(logsDir, 'technical.log') }),
    new winston.transports.Console({ format: winston.format.simple() }),
  ],
});

export function getOrderLogger(orderId: number): winston.Logger {
  const logFile = join(ordersLogsDir, `order-${orderId}.log`);
  return winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    transports: [
      new winston.transports.File({ filename: logFile }),
    ],
  });
}

export function logOrderEvent(orderId: number, event: string, details?: object): void {
  const logger = getOrderLogger(orderId);
  logger.info(event, { orderId, ...details });
}

export function getOrderLogPath(orderId: number): string {
  return join(ordersLogsDir, `order-${orderId}.log`);
}
