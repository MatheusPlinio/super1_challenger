import express from 'express';
import { ProductController } from '../controllers/ProductController';
import { PrismaProductRepository } from '../repositories/prisma/PrismaProductRepository';

const productRoutes = express.Router();
const productRepo = new PrismaProductRepository();
const productController = new ProductController(productRepo);

productRoutes.get('/', productController.index.bind(productController));
productRoutes.get('/:id', productController.show.bind(productController));

export default productRoutes;