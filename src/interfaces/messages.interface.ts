import { ObjectId } from 'mongoose';

export interface IMessages {
  _id: ObjectId;
  email: string;
  user: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}
