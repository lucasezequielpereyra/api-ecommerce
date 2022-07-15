import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';

export const router: Router = Router();

const orderController = new OrderController();

router.post('/new', orderController.newOrder);
