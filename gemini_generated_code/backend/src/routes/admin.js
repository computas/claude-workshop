const express = require('express');
const { getDb } = require('../utils/db');
const { technicalLogger, businessLogger } = require('../utils/logger');
const path = require('path');
const { exec } = require('child_process');

const router = express.Router();

// GET /admin/orders - with filtering by status
router.get('/orders', (req, res) => {
  const db = getDb();
  const { status } = req.query;

  let sql = 'SELECT * FROM orders';
  const params = [];

  if (status) {
    sql += ' WHERE status = ?';
    params.push(status);
  }

  sql += ' ORDER BY orderDate DESC';

  db.all(sql, params, (err, rows) => {
    if (err) {
      technicalLogger.error('Error fetching orders for admin:', err.message);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.json(rows);
    }
  });
});

// GET /admin/orders/:id/logs - Get logs for a specific order
router.get('/orders/:id/logs', (req, res) => {
    const { id } = req.params;
    const { includeTechnical } = req.query;
    const logsDir = path.join(__dirname, '../../logs');
    const businessLogPath = path.join(logsDir, 'business.log');
    const technicalLogPath = path.join(logsDir, 'technical.log');

    const readLogFile = (filePath) => {
        return new Promise((resolve, reject) => {
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) return reject(err);
                resolve(data);
            });
        });
    };

    const promises = [readLogFile(businessLogPath)];
    if (includeTechnical === 'true') {
        promises.push(readLogFile(technicalLogPath));
    }

    Promise.all(promises)
        .then(logs => {
            const combinedLogs = logs.join('\n');
            const orderLogs = combinedLogs.split('\n')
                .filter(line => line.includes(`order ${id}`) || line.includes(`Order ${id}`))
                .join('\n');
            res.type('text/plain').send(orderLogs);
        })
        .catch(err => {
            technicalLogger.error(`Error reading logs for order ${id}:`, err.message);
            res.status(500).json({ error: 'Internal server error' });
        });
});


// POST /admin/logs/open - Open the logs directory
router.post('/logs/open', (req, res) => {
  const logsDir = path.join(__dirname, '../../logs');
  let command;

  switch (process.platform) {
    case 'darwin':
      command = `open "${logsDir}"`;
      break;
    case 'win32':
      command = `explorer "${logsDir}"`;
      break;
    default:
      command = `xdg-open "${logsDir}"`;
  }

  exec(command, (err) => {
    if (err) {
      technicalLogger.error('Error opening logs directory:', err.message);
      return res.status(500).json({ error: 'Failed to open logs directory' });
    }
    res.json({ message: 'Logs directory opened' });
  });
});

module.exports = router;
