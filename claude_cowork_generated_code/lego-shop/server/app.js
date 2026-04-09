import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Import database initializer and logger
import { technicalLogger } from './logger.js';

// Import middleware
import { requestLogger } from './middleware/requestLogger.js';

// Import routes
import productsRouter from './routes/products.js';
import ordersRouter from './routes/orders.js';
import paymentsRouter from './routes/payments.js';
import logsRouter from './routes/logs.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function createApp() {
  const app = express();

  // Create necessary directories
  const logsDir = path.join(__dirname, 'logs');
  const ordersLogsDir = path.join(logsDir, 'orders');
  const publicDir = path.join(__dirname, 'public');

  [logsDir, ordersLogsDir, publicDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  // Middleware
  app.use(express.json());
  app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }));

  // Static files - serve images from public directory.
  // If a .jpg product image exists (downloaded via download-product-images.js) serve it;
  // otherwise fall back to the .svg illustration so the app always shows something.
  app.use('/images', express.static(path.join(publicDir, 'images')));
  app.get('/images/products/:file', (req, res, next) => {
    const { file } = req.params;
    const imgDir = path.join(publicDir, 'images', 'products');
    // Already handled by static if the exact file exists; this catches .jpg → .svg fallback
    if (file.endsWith('.jpg')) {
      const svgPath = path.join(imgDir, file.replace('.jpg', '.svg'));
      if (fs.existsSync(svgPath)) return res.sendFile(svgPath);
    }
    next();
  });

  // Custom request logger middleware
  app.use(requestLogger);

  // API Routes
  app.use('/api/products', productsRouter);
  app.use('/api/orders', ordersRouter);
  app.use('/api/payments', paymentsRouter);
  app.use('/api/logs', logsRouter);

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
  });

  // Error handler
  app.use((err, req, res, next) => {
    technicalLogger.error('Unhandled error', { error: err.message, stack: err.stack });
    res.status(500).json({ error: 'Internal server error' });
  });

  return app;
}

export default createApp();
