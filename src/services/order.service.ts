import { IOrder } from '../interfaces/order.interface';
import { OrderModel } from '../models/order.model';

export class OrderService {
  async newOrder(order: IOrder): Promise<IOrder> {
    const newOrder = new OrderModel(order);
    return await newOrder.save();
  }

  async getOrderQuantity(): Promise<number> {
    return await OrderModel.countDocuments();
  }
}
