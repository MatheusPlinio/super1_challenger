import express from 'express';
import { CartController } from '../controllers/CartController';
import { PrismaCartRepository } from '../repositories/prisma/PrismaCartRepository';
import { validateData } from '../middleware/validationMiddleware';
import { addToCartSchema, removeCartItemSchema, updateCartItemSchema } from '../schemas/cartSchemas';
import { authMiddleware } from '../middleware/authMiddleware';

const cartRoutes = express.Router();
const cartRepo = new PrismaCartRepository();

const cartController = new CartController(cartRepo);

cartRoutes.use(authMiddleware);

cartRoutes.get("/", cartController.index.bind(cartController));
cartRoutes.post("/items", validateData(addToCartSchema), cartController.addItem.bind(cartController));
cartRoutes.patch("/items/:id", validateData(updateCartItemSchema), cartController.updateItem.bind(cartController));
cartRoutes.delete("/items/:id", validateData(removeCartItemSchema), cartController.removeItem.bind(cartController));


export default cartRoutes;
