import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { technicalLogger } from '../logger.js';
import os from 'os';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logsDir = path.join(__dirname, '..', 'logs');

// GET /api/logs/technical - Read technical log
router.get('/technical', (req, res) => {
  try {
    const lines = parseInt(req.query.lines) || 100;
    const logFile = path.join(logsDir, 'technical.log');

    if (!fs.existsSync(logFile)) {
      return res.json({ logs: [], totalLines: 0 });
    }

    const content = fs.readFileSync(logFile, 'utf8');
    const logLines = content.split('\n').filter(line => line.trim());

    // Return last N lines
    const lastNLines = logLines.slice(Math.max(0, logLines.length - lines));
    const parsedLogs = lastNLines.map(line => {
      try {
        return JSON.parse(line);
      } catch {
        return { message: line };
      }
    });

    res.json({
      logs: parsedLogs,
      totalLines: logLines.length,
      displayedLines: parsedLogs.length,
    });
  } catch (error) {
    technicalLogger.error('Error reading technical log', { error: error.message });
    res.status(500).json({ error: 'Failed to read technical log' });
  }
});

// GET /api/logs/business - Read business log
router.get('/business', (req, res) => {
  try {
    const lines = parseInt(req.query.lines) || 100;
    const logFile = path.join(logsDir, 'business.log');

    if (!fs.existsSync(logFile)) {
      return res.json({ logs: [], totalLines: 0 });
    }

    const content = fs.readFileSync(logFile, 'utf8');
    const logLines = content.split('\n').filter(line => line.trim());

    // Return last N lines
    const lastNLines = logLines.slice(Math.max(0, logLines.length - lines));
    const parsedLogs = lastNLines.map(line => {
      try {
        return JSON.parse(line);
      } catch {
        return { message: line };
      }
    });

    res.json({
      logs: parsedLogs,
      totalLines: logLines.length,
      displayedLines: parsedLogs.length,
    });
  } catch (error) {
    technicalLogger.error('Error reading business log', { error: error.message });
    res.status(500).json({ error: 'Failed to read business log' });
  }
});

// GET /api/logs/orders/:orderId - Read order-specific log
router.get('/orders/:orderId', (req, res) => {
  try {
    const { orderId } = req.params;
    const logFile = path.join(logsDir, 'orders', `${orderId}.log`);

    if (!fs.existsSync(logFile)) {
      return res.json({ orderId, logs: [], totalLines: 0 });
    }

    const content = fs.readFileSync(logFile, 'utf8');
    const logLines = content.split('\n').filter(line => line.trim());

    const parsedLogs = logLines.map(line => {
      try {
        return JSON.parse(line);
      } catch {
        return { message: line };
      }
    });

    res.json({
      orderId,
      logs: parsedLogs,
      totalLines: logLines.length,
    });
  } catch (error) {
    technicalLogger.error('Error reading order log', { error: error.message, orderId: req.params.orderId });
    res.status(500).json({ error: 'Failed to read order log' });
  }
});

// POST /api/logs/open-directory - Open logs directory in OS file manager
router.post('/open-directory', (req, res) => {
  try {
    const platform = process.platform;
    let command;

    if (platform === 'darwin') {
      // macOS
      command = `open "${logsDir}"`;
    } else if (platform === 'linux') {
      // Linux
      command = `xdg-open "${logsDir}"`;
    } else if (platform === 'win32') {
      // Windows
      command = `explorer "${logsDir}"`;
    } else {
      return res.status(400).json({ error: 'Unsupported platform' });
    }

    exec(command, (error) => {
      if (error) {
        technicalLogger.error('Error opening logs directory', { error: error.message });
        return res.status(500).json({ error: 'Failed to open logs directory' });
      }

      res.json({ message: 'Logs directory opened', path: logsDir });
    });
  } catch (error) {
    technicalLogger.error('Error opening directory', { error: error.message });
    res.status(500).json({ error: 'Failed to open directory' });
  }
});

export default router;
