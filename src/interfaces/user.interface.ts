import { ObjectId } from 'mongoose';
import { IRole } from '../interfaces/role.interface';

export interface IUser {
  _id: ObjectId;
  name: string;
  email: string;
  password: string;
  avatar: string;
  createdAt: Date;
  updatedAt: Date;
  role: ObjectId[];
}
