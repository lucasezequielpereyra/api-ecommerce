import { ObjectId } from 'mongoose';

export interface IProduct {
  _id: ObjectId;
  name: string;
  price: number;
  description: string;
  image: string;
  category: ObjectId;
}
