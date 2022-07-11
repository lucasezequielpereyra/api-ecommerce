import { ProductModel } from '../models/product.model';
import { IProduct } from '../interfaces/product.interface';
import { ObjectId } from 'mongoose';

export class ProductService {
  async newProduct(product: IProduct): Promise<IProduct> {
    const newProduct = new ProductModel(product);
    return await newProduct.save();
  }

  async updateProduct(
    id: ObjectId,
    product: IProduct,
  ): Promise<IProduct | null> {
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
  }

  async getProducts(): Promise<IProduct[]> {
    return await ProductModel.find();
  }

  async getProduct(id: string): Promise<IProduct | null> {
    return await ProductModel.findById(id);
  }

  async deleteProduct(id: string): Promise<IProduct | null> {
    return await ProductModel.findByIdAndDelete(id);
  }

  async getProductByCategory(category: string): Promise<IProduct[]> {
    return await ProductModel.find({ category });
  }
}
