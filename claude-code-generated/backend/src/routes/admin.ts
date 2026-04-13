import { Router } from 'express';
import { getAllOrders, updateOrderStatus, refundOrder } from '../services/orderService.js';
import { logsDirectory, getOrderLogPath } from '../utils/logger.js';
import type { OrderStatus } from '@workshop/shared';
import { readFileSync, existsSync } from 'fs';
import { exec } from 'child_process';
import { technicalLogger } from '../utils/logger.js';

const router = Router();

router.get('/orders', (req, res, next) => {
  try {
    const { status } = req.query as { status?: OrderStatus };
    const orders = getAllOrders(status);
    res.json(orders);
  } catch (err) {
    next(err);
  }
});

router.patch('/orders/:id/status', (req, res, next) => {
  try {
    const orderId = parseInt(req.params.id, 10);
    const { status } = req.body as { status: OrderStatus };
    if (!status) {
      res.status(400).json({ error: 'status is required' });
      return;
    }
    const order = updateOrderStatus(orderId, status);
    res.json(order);
  } catch (err) {
    next(err);
  }
});

router.post('/orders/:id/refund', (req, res, next) => {
  try {
    const orderId = parseInt(req.params.id, 10);
    const order = refundOrder(orderId);
    res.json(order);
  } catch (err) {
    next(err);
  }
});

router.get('/logs/:orderId', (req, res, next) => {
  try {
    const orderId = parseInt(req.params.orderId, 10);
    const { includeTechnical } = req.query as { includeTechnical?: string };

    const orderLogPath = getOrderLogPath(orderId);
    let orderLogs: string[] = [];
    if (existsSync(orderLogPath)) {
      orderLogs = readFileSync(orderLogPath, 'utf-8').trim().split('\n').filter(Boolean);
    }

    let technicalLogs: string[] = [];
    const techLogPath = `${logsDirectory}/technical.log`;
    if (includeTechnical === 'true' && existsSync(techLogPath)) {
      technicalLogs = readFileSync(techLogPath, 'utf-8').trim().split('\n').filter(Boolean);
    }

    res.json({
      orderLogs: orderLogs.map(line => { try { return JSON.parse(line); } catch { return line; } }),
      technicalLogs: includeTechnical === 'true'
        ? technicalLogs.map(line => { try { return JSON.parse(line); } catch { return line; } })
        : undefined,
    });
  } catch (err) {
    next(err);
  }
});

router.post('/logs/open-directory', (_req, res) => {
  const platform = process.platform;
  let command: string;

  if (platform === 'darwin') {
    command = `open "${logsDirectory}"`;
  } else if (platform === 'win32') {
    command = `explorer "${logsDirectory}"`;
  } else {
    command = `xdg-open "${logsDirectory}"`;
  }

  exec(command, (err) => {
    if (err) {
      technicalLogger.error('Failed to open logs directory', { error: err.message });
      res.status(500).json({ error: 'Failed to open logs directory' });
      return;
    }
    res.json({ success: true, path: logsDirectory });
  });
});

export default router;
