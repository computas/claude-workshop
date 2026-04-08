import { Router } from 'express';
import { router as productsRouter } from './products';
import { router as ordersRouter } from './orders';
import { router as paymentsRouter } from './payments';

export const router = Router();

router.use('/products', productsRouter);
router.use('/orders', ordersRouter);
router.use('/payments', paymentsRouter);
