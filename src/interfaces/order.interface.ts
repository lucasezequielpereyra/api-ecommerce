import { ObjectId } from 'mongoose';

export interface IOrder {
  _id: ObjectId;
  items: Array<Object>;
  orderNumber: number;
  createdAt: Date;
  updatedAt: Date;
  state: string;
  email: string;
}
