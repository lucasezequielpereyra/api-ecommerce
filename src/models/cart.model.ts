import { Schema, model } from 'mongoose';
import { ICart } from '../interfaces/cart.interface';

const cartSchema = new Schema<ICart>(
  {
    user: {
      ref: 'User',
      type: Schema.Types.ObjectId,
      required: true,
    },
    products: [
      {
        product: {
          ref: 'Product',
          type: Schema.Types.ObjectId,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        _id: false,
      },
    ],
    address: {
      type: String,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const CartModel = model<ICart>('Cart', cartSchema);
