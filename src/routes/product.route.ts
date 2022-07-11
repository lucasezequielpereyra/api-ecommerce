import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import { verifyToken, verifyAdminRole } from '../middlewares/verifyJwt';
import multer from 'multer';

const uploadImage = multer({ dest: 'public/assets/uploads/products' });

const productController = new ProductController();

export const router: Router = Router();

router.post(
  '/new',
  [uploadImage.single('file'), verifyToken, verifyAdminRole],
  productController.newProduct,
);
router.get('/', verifyToken, productController.getProducts);
router.get('/:id', verifyToken, productController.getProduct);
router.put(
  '/:id',
  [uploadImage.single('file'), verifyToken, verifyAdminRole],
  productController.updateProduct,
);
router.delete('/:id', verifyToken, productController.deleteProduct);
router.get(
  '/category/:category',
  verifyToken,
  productController.getProductByCategory,
);
