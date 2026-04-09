import { createApp } from './app.js';
import { initializeDatabase } from './db.js';
import { technicalLogger } from './logger.js';

const app = createApp();
const PORT = 3001;

// Initialize database then start server
async function start() {
  try {
    await initializeDatabase();
    technicalLogger.info('Database initialized successfully');

    app.listen(PORT, () => {
      technicalLogger.info('Server started', {
        port: PORT,
        environment: process.env.NODE_ENV || 'production',
        timestamp: new Date().toISOString(),
      });
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();
