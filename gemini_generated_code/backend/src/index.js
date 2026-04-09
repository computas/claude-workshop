const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { technicalLogger, businessLogger } = require('./utils/logger');
const { initializeDatabase } = require('./utils/db');
const productsRouter = require('./routes/products');
const ordersRouter = require('./routes/orders');
const adminRouter = require('./routes/admin');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

// Middleware to log all incoming requests
app.use((req, res, next) => {
  technicalLogger.info(`${req.method} ${req.originalUrl}`);
  next();
});

app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/admin', adminRouter);

app.get('/', (req, res) => {
  res.send('Hello from the Lego Shopping Backend!');
});

// Initialize database and then start the server
initializeDatabase()
  .then(() => {
    app.listen(port, () => {
      technicalLogger.info(`Backend server listening at http://localhost:${port}`);
    });
  })
  .catch(err => {
    technicalLogger.error('Failed to initialize database:', err);
    process.exit(1);
  });
