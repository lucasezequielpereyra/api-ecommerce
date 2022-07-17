import { IOrder } from '../interfaces/order.interface';
import { OrderModel } from '../models/order.model';
import { ObjectId } from 'mongoose';

export class OrderService {
  async newOrder(order: IOrder): Promise<IOrder> {
    const newOrder = new OrderModel(order);
    return await newOrder.save();
  }

  async getOrderQuantity(): Promise<number> {
    return await OrderModel.countDocuments();
  }

  async getOrderByUser(user: ObjectId): Promise<IOrder | null> {
    return await OrderModel.findOne({ user: user, state: 'Generated' });
  }

  async setOrderStatus(orderId: ObjectId): Promise<IOrder | null> {
    try {
      const order = await OrderModel.findByIdAndUpdate(
        orderId,
        {
          state: 'Done',
        },
        { new: true },
      );
      if (!order) {
        return null;
      }
      return await order.save();
    } catch (error) {
      return null;
    }
  }

  async getOrdersByUser(user: ObjectId): Promise<IOrder[]> {
    try {
      return await OrderModel.find({ user: user }).sort({ createdAt: -1 });
    } catch (error) {
      return [];
    }
  }
}
