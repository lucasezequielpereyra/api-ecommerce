import { Router } from 'express';
import { CategoryController } from '../controllers/category.controller';
import { verifyToken, verifyAdminRole } from '../middlewares/verifyJwt';

const categoryController = new CategoryController();

export const router: Router = Router();

router.post(
  '/new',
  [verifyToken, verifyAdminRole],
  categoryController.newCategory,
);
router.get(
  '/',
  [verifyToken, verifyAdminRole],
  categoryController.listCategories,
);
