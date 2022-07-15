import { CartModel } from '../models/cart.model';
import { ICart } from '../interfaces/cart.interface';
import { ObjectId } from 'mongoose';

export class CartService {
  async newCart(cart: ICart): Promise<ICart> {
    const newCart = new CartModel(cart);
    return await newCart.save();
  }

  async getCarts(): Promise<ICart[]> {
    return await CartModel.find();
  }

  async getCart(id: ObjectId): Promise<ICart | null> {
    try {
      return await CartModel.findById(id);
    } catch (error) {
      return null;
    }
  }

  async getCartByUser(user: ObjectId): Promise<ICart | null> {
    try {
      return await CartModel.findOne({ user });
    } catch (error) {
      return null;
    }
  }

  async updateCart(
    user: string,
    product: Object,
    total: number,
  ): Promise<ICart | null> {
    try {
      return await CartModel.findOneAndUpdate(
        { user },
        {
          $push: {
            products: product,
          },
          total: total,
        },
        { new: true },
      );
    } catch (error) {
      return null;
    }
  }

  async getProductsInCart(user: ObjectId): Promise<Object[] | null> {
    try {
      const cart = await CartModel.findOne({ user });
      if (cart) {
        return cart.products;
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  async removeProductInCart(
    user: ObjectId,
    products: Array<Object>,
    total: number,
  ): Promise<ICart | null> {
    try {
      const cart = await CartModel.findOne({ user });
      if (cart) {
        return await CartModel.findOneAndUpdate(
          { user },
          {
            products: products,
            total: total,
          },
          { new: true },
        );
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  async deleteByUser(user: ObjectId): Promise<ICart | null> {
    try {
      return await CartModel.findOneAndDelete({ user });
    } catch (error) {
      return null;
    }
  }
}
