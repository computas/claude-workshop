import express from 'express';
import { technicalLogger } from './utils/logger.js';
import { requestLogger } from './middleware/requestLogger.js';
import { errorHandler } from './middleware/errorHandler.js';
import productsRouter from './routes/products.js';
import cartRouter from './routes/cart.js';
import ordersRouter from './routes/orders.js';
import adminRouter from './routes/admin.js';
import paymentsRouter from './routes/payments.js';
import { getDb } from './database/db.js';

const app = express();
const PORT = process.env.PORT ?? 3111;

app.use(express.json());
app.use(requestLogger);

// CORS for local dev
app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.options('*', (_req, res) => { res.sendStatus(204); });

app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/admin', adminRouter);
app.use('/api/payments', paymentsRouter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

// Initialize DB on startup
getDb();

app.listen(PORT, () => {
  technicalLogger.info('Server started', { port: PORT });
  console.log(`Backend running on http://localhost:${PORT}`);
});

export default app;
