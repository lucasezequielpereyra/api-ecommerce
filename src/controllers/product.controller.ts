import { IProduct } from './../interfaces/product.interface';
import { ProductModel } from '../models/product.model';
import { ProductService } from '../services/product.service';
import { Request, Response } from 'express';

const productService = new ProductService();

export class ProductController {
  async newProduct(req: Request, res: Response) {
    const { name, price, description, category } = req.body;
    const image: any = req.file;
    try {
      const newProduct = new ProductModel({
        name: name,
        price: parseFloat(price),
        description: description || '',
        category: category,
        image: image.path,
      });
      const product = await productService.newProduct(newProduct);

      return res.status(201).json(product);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async updateProduct(req: Request, res: Response) {
    const { id } = req.params;
    const { name, price, description, category } = req.body;
    const image: any = req.file;
    try {
      const findProduct: IProduct | null = await productService.getProduct(id);
      if (!findProduct) {
        return res.status(404).json({ error: 'Product not found' });
      } else {
        const newProduct = new ProductModel({
          name: name || findProduct.name,
          price: price || findProduct.price,
          description: description || findProduct.description,
          category: category || findProduct.category,
          image: image ? image.path : findProduct.image,
        });

        const updatedProduct = await productService.updateProduct(
          findProduct._id,
          newProduct,
        );

        return res.status(200).json(updatedProduct);
      }
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }

  async getProducts(req: Request, res: Response) {
    try {
      const products = await productService.getProducts();
      return res.status(200).json(products);
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }

  async getProduct(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const product = await productService.getProduct(id);
      if (product === null) {
        return res.status(404).json({ error: 'Product not found' });
      }
      return res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  async deleteProduct(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const product = await productService.deleteProduct(id);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      return res.status(200).json(product);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }

  async getProductByCategory(req: Request, res: Response) {
    const { category } = req.params;
    try {
      const products = await productService.getProductByCategory(category);
      res.status(200).json(products);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }
}
