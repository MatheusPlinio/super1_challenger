import express from 'express';
import { validateData } from '../middleware/validationMiddleware';
import { userRegistrationSchema, userLoginSchema } from '../schemas/userSchemas';
import { UserController } from '../controllers/UserController';
import { PrismaUserRepository } from '../repositories/prisma/PrismaUserRepository';

const userRouter = express.Router();
const userRepo = new PrismaUserRepository();

const userController = new UserController(userRepo);

userRouter.post('/', validateData(userRegistrationSchema), userController.create.bind(userController));
userRouter.post('/login', validateData(userLoginSchema), userController.login.bind(userController));

export default userRouter;