import winston from "winston";
import path from "path";
import fs from "fs";

export function setupLogger() {
  const logDir = path.join(process.cwd(), "logs");
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
  }

  const technicalLogPath = path.join(logDir, "technical.log");
  const businessLogPath = path.join(logDir, "business.log");

  const technicalLogger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    transports: [
      new winston.transports.File({ filename: technicalLogPath }),
      new winston.transports.Console()
    ]
  });

  const businessLogger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.printf(({ timestamp, level, message, orderId, ...meta }) => {
        return `${timestamp} [${level.toUpperCase()}] ${orderId ? `[Order: ${orderId}] ` : ""}${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ""}`;
      })
    ),
    transports: [
      new winston.transports.File({ filename: businessLogPath }),
      new winston.transports.Console()
    ]
  });

  return {
    logger: technicalLogger, // Default logger
    technicalLogger,
    businessLogger
  };
}
