import { createLogger, transports, format } from 'winston';

export const logger = createLogger({
  transports: [
    new transports.File({
      filename: 'logs/backend.log',
      format: format.json(),
    }),
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    }),
  ],
});
