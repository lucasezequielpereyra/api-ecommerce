import { ObjectId } from 'mongoose';

export interface ICart {
  _id: ObjectId;
  user: ObjectId;
  products: Array<Object>;
  total: number;
  address: string;
  createdAt: Date;
  updatedAt: Date;
}
