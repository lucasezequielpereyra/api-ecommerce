import { IMessages } from '../interfaces/messages.interface';
import { MessagesModel } from '../models/message.model';
import { ObjectId } from 'mongoose';
import logger from '../config/logger';

export class MessageService {
  async newMessage(message: IMessages): Promise<IMessages | null> {
    try {
      const newMessage = new MessagesModel(message);
      return await newMessage.save();
    } catch (err: any) {
      logger.error.error(err);
      return null;
    }
  }

  async getMessages(): Promise<IMessages[]> {
    return await MessagesModel.find().sort({ createdAt: -1 }).limit(30);
  }

  async getMessagesByUser(user: ObjectId): Promise<IMessages[] | null> {
    try {
      return await MessagesModel.find({ user });
    } catch (err: any) {
      logger.error.error(err);
      return null;
    }
  }
}
