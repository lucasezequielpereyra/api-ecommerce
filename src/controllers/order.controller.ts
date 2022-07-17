import { Request, Response } from 'express';
import { OrderService } from '../services/order.service';
import { CartService } from '../services/cart.service';
import { AuthService } from '../services/auth.service';
import { OrderModel } from '../models/order.model';
import { newBuyerEmail } from '../services/mail.service';

const orderService = new OrderService();
const cartService = new CartService();
const authService = new AuthService();

declare module 'express-session' {
  interface SessionData {
    passport: any;
  }
}

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
        user: user,
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

  async checkOrder(req: Request, res: Response) {
    const user = req.session?.passport.user;

    try {
      // Get orders
      const order = await orderService.getOrderByUser(user);

      // Check orders
      if (!order) {
        return res.status(400).json({
          message: "User hasn't active orders",
        });
      }

      // Order Done
      const orderDone = await orderService.setOrderStatus(order._id);

      // Find user for email
      const userData = await authService.findUserById(user);

      // Send email
      if (userData !== null && orderDone !== null) {
        newBuyerEmail(userData, orderDone);
      }

      // Response
      return res.status(201).json({
        message: 'Orders found',
        orderDone,
      });
    } catch (error) {
      return res.status(400).json({
        message: 'Bad request',
      });
    }
  }

  async getOrdersByUser(req: Request, res: Response) {
    const user = req.session?.passport.user;

    try {
      // Get orders
      const orders = await orderService.getOrdersByUser(user);

      // Response
      return res.status(200).json({
        message: 'Orders found',
        orders,
      });
    } catch (error) {
      return res.status(400).json({
        message: 'Bad request',
      });
    }
  }
}
