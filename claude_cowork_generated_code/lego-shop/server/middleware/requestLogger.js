import { technicalLogger } from '../logger.js';

export function requestLogger(req, res, next) {
  const startTime = Date.now();

  // Capture the original send function
  const originalSend = res.send;

  // Override send to capture status code
  res.send = function (data) {
    res.send = originalSend;

    const duration = Date.now() - startTime;
    const statusCode = res.statusCode;

    technicalLogger.info('HTTP Request', {
      method: req.method,
      url: req.originalUrl,
      status: statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
    });

    return res.send(data);
  };

  next();
}
