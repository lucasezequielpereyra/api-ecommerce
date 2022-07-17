import { CartModel } from '../models/cart.model';
import { CartService } from '../services/cart.service';
import { ProductService } from '../services/product.service';
import { Request, Response } from 'express';
import { ObjectId } from 'mongoose';
import { IProduct } from '../interfaces/product.interface';

const cartService = new CartService();
const productService = new ProductService();

declare module 'express-session' {
  interface SessionData {
    passport: any;
  }
}

export class CartController {
  async newCart(req: Request, res: Response) {
    const { products, address } = req.body;
    const user = req.session?.passport.user;

    try {
      if (!user || !products) {
        return res.status(400).json({
          message: 'Bad request',
        });
      }

      // check if user already has a cart
      const cart = await cartService.getCartByUser(user);
      if (cart) {
        return res.status(400).json({
          message: 'User already has a cart',
        });
      }

      // Declare auxiliary variables
      const arrProductsToCart: Array<Object> = [];
      let total: number = 0;

      // Get clear id of products
      const idProducts: Array<ObjectId> = [];
      products.forEach((product: any) => {
        idProducts.push(product.id);
      });

      // Get products from database
      let multipleProducts: Array<IProduct> = [];
      multipleProducts = await productService.getMultipleProducts(idProducts);

      // Check if products exist and cross quantity with products
      multipleProducts.map((product: IProduct) => {
        products.map((prdDataUser: any) => {
          if (product._id.toString() === prdDataUser.id) {
            const object = {
              quantity: prdDataUser.quantity,
              product: product._id,
              price: product.price,
            };
            arrProductsToCart.push(object);
            total += product.price * prdDataUser.quantity;
          }
        });
      });

      // Create new cart
      const newCart = new CartModel({
        user: user,
        products: arrProductsToCart,
        address: address,
        total: total,
      });

      // Save cart in database
      const saveCart = await cartService.newCart(newCart);

      // Return cart
      return res.status(201).json({
        message: 'Cart created',
        cart: saveCart,
      });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }

  async updateCart(req: Request, res: Response) {
    const { product } = req.body;
    const user = req.session?.passport.user;
    try {
      if (!user || !product) {
        return res.status(400).json({
          message: 'Bad request',
        });
      }

      // Find product price
      const productToUpdate = await productService.getProduct(product.id);

      // Check if product exists
      if (productToUpdate === null) {
        return res.status(400).json({
          message: 'Product not found',
        });
      }

      // Get cart from database
      const cart = await cartService.getCartByUser(user);
      if (!cart) {
        return res.status(400).json({
          message: 'User has no cart',
        });
      }

      // Check if product is already in cart
      const productsInCart: any = await cartService.getProductsInCart(user);
      const arrayIdProducts: Array<Object> = productsInCart.map(
        (x: any) => x.product._id,
      );
      let productExists: boolean = false;
      arrayIdProducts.forEach((id: any) => {
        if (id.valueOf() === product.id) {
          productExists = true;
        }
      });

      // If product is not in cart, add it
      if (!productExists) {
        // Declare auxiliary variables
        let total: number = cart.total;
        if (productToUpdate !== null) {
          total += productToUpdate.price + product.quantity;
        }

        const productToAdd: any = {
          quantity: product.quantity,
          product: productToUpdate._id,
          price: productToUpdate.price,
        };

        // Update cart
        const cartUpdated = await cartService.updateCart(
          user,
          productToAdd,
          total,
        );

        // Return cart
        return res.status(201).json({
          message: 'Cart updated',
          cart: cartUpdated,
        });
      }
      return res.status(400).json({
        message: 'Product already in cart',
      });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }

  async deleteProduct(req: Request, res: Response) {
    const user = req.session?.passport.user;
    const { product } = req.params;
    try {
      if (!user || !product) {
        return res.status(400).json({
          message: 'Bad request',
        });
      }

      // Get products in cart from database
      const productsInCart: any = await cartService.getProductsInCart(user);
      if (productsInCart === null) {
        return res.status(400).json({
          message: 'User has no cart',
        });
      }
      // Auxiliary Variables
      const newArrayProducts: Array<Object> = [];
      let total: number = 0;

      productsInCart.forEach((productInCart: any) => {
        if (productInCart.product.valueOf() !== product) {
          newArrayProducts.push(productInCart);
          total += productInCart.price * productInCart.quantity;
        }
      });

      // Update cart
      const cartUpdated = await cartService.removeProductInCart(
        user,
        newArrayProducts,
        total,
      );

      // Return cart
      return res.status(201).json({
        message: 'Cart updated',
        cart: cartUpdated,
      });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }

  async checkout(req: Request, res: Response) {
    const user = req.session?.passport.user;
    try {
      if (!user) {
        return res.status(400).json({
          message: 'Bad request',
        });
      }

      // Get cart from database
      const cart = await cartService.getCartByUser(user);
      if (!cart) {
        return res.status(400).json({
          message: 'User has no cart',
        });
      }

      return res.redirect(307, `/order/new`);
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }
}
