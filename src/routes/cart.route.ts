import { Router } from 'express';
import { CartController } from '../controllers/cart.controller';
import { verifyToken, verifyUserRole } from '../middlewares/verifyJwt';

const cartController = new CartController();

export const router: Router = Router();

router.post('/add', [verifyToken], cartController.newCart);
router.put('/update', [verifyToken, verifyUserRole], cartController.updateCart);
router.put(
  '/delete/:product',
  [verifyToken, verifyUserRole],
  cartController.deleteProduct,
);
router.post(
  '/checkout',
  [verifyToken, verifyUserRole],
  cartController.checkout,
);
