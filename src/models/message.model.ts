import { Schema, model } from 'mongoose';
import { IMessages } from '../interfaces/messages.interface';

const messagesSchema = new Schema<IMessages>(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    message: {
      type: String,
      required: true,
    },
    user: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const MessagesModel = model<IMessages>('Messages', messagesSchema);
