import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';
import { verifyToken, verifyUserRole } from '../middlewares/verifyJwt';

export const router: Router = Router();

const orderController = new OrderController();

router.post('/new', [verifyToken, verifyUserRole], orderController.newOrder);
router.put('/check', [verifyToken, verifyUserRole], orderController.checkOrder);
router.get(
  '/orders',
  [verifyToken, verifyUserRole],
  orderController.getOrdersByUser,
);
