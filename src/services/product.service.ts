import { ProductModel } from '../models/product.model';
import { IProduct } from '../interfaces/product.interface';
import { ObjectId } from 'mongoose';
import logger from '../config/logger';

export class ProductService {
  async newProduct(product: IProduct): Promise<IProduct | undefined> {
    try {
      const newProduct = new ProductModel(product);
      return await newProduct.save();
    } catch (error) {
      logger.error.error(error);
    }
  }

  async updateProduct(
    id: ObjectId,
    product: IProduct,
  ): Promise<IProduct | null> {
    try {
      return ProductModel.findOneAndUpdate(
        { _id: id },
        {
          name: product.name,
          price: product.price,
          description: product.description,
          category: product.category,
          image: product.image,
        },
        { new: true },
      );
    } catch (error) {
      return null;
    }
  }

  async getProducts(): Promise<IProduct[]> {
    return await ProductModel.find();
  }

  async getProduct(id: string): Promise<IProduct | null> {
    try {
      return await ProductModel.findById(id);
    } catch (error) {
      return null;
    }
  }

  async deleteProduct(id: string): Promise<IProduct | null> {
    try {
      return await ProductModel.findByIdAndDelete(id);
    } catch (error) {
      return null;
    }
  }

  async getProductByCategory(category: string): Promise<IProduct[]> {
    return await ProductModel.find({ category });
  }

  async getMultipleProducts(ids: ObjectId[]): Promise<IProduct[]> {
    return await ProductModel.find({ _id: { $in: ids } });
  }
}
