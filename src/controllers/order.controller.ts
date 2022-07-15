import { Request, Response } from 'express';
import { OrderService } from '../services/order.service';
import { CartService } from '../services/cart.service';
import { AuthService } from '../services/auth.service';
import { OrderModel } from '../models/order.model';

const orderService = new OrderService();
const cartService = new CartService();
const authService = new AuthService();

export class OrderController {
  async newOrder(req: Request, res: Response) {
    const user = req.session?.passport.user;

    try {
      // Delete cart
      const cart = await cartService.deleteByUser(user);
      if (!cart) {
        return res.status(400).json({
          message: 'Cart not found',
        });
      }

      // Count orders
      const countOrders = await orderService.getOrderQuantity();

      // Get user email
      const userEmail = await authService.getUserEmail(user);

      // Create order
      const order = new OrderModel({
        items: cart.products,
        orderNumber: countOrders + 1,
        email: userEmail,
      });

      // Save order
      const saveOrder = await orderService.newOrder(order);

      // Response
      return res.status(201).json({
        message: 'Order created',
        order: saveOrder,
      });
    } catch (error) {
      return res.status(400).json({
        message: 'Bad request',
      });
    }
  }
}
