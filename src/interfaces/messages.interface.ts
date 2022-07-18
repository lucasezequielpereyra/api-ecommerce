import { ObjectId } from 'mongoose';

export interface IMessages {
  _id: ObjectId;
  email: string;
  user: ObjectId;
  typeUser: string;
  message: string;
  responseTo: string | null;
  createdAt: Date;
  updatedAt: Date;
}
