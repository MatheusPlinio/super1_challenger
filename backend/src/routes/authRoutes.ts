import express from 'express';
import { validateData } from '../middleware/validationMiddleware';
import { userRegistrationSchema, userLoginSchema } from '../schemas/userSchemas';
import { AuthController } from '../controllers/AuthController';
import { PrismaUserRepository } from '../repositories/prisma/PrismaUserRepository';

const authRoutes = express.Router();
const userRepo = new PrismaUserRepository();

const authController = new AuthController(userRepo);

authRoutes.post('/register', validateData(userRegistrationSchema), authController.create.bind(authController));
authRoutes.post('/login', validateData(userLoginSchema), authController.login.bind(authController));

export default authRoutes;