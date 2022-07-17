import { Request, Response } from 'express';
import { CategoryService } from '../services/category.service';
import logger from '../config/logger';

const categoryService = new CategoryService();

export class CategoryController {
  async newCategory(req: Request, res: Response) {
    try {
      const { name }: any = req.body;
      const category = await categoryService.newCategory(name);
      return res.status(201).json(category);
    } catch (err: any) {
      logger.error.error(err);
      return res.status(500).json({
        message: err.message,
      });
    }
  }

  async listCategories(req: Request, res: Response) {
    try {
      const categories = await categoryService.listCategories();
      return res.status(200).json(categories);
    } catch (err: any) {
      logger.error.error(err);
      return res.status(500).json({
        message: err.message,
      });
    }
  }
}
