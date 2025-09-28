import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { PrismaUserRepository } from "../repositories/prisma/PrismaUserRepository";
import { authMiddleware } from "../middleware/authMiddleware";
import { adminMiddleware } from "../middleware/adminMiddleware";
import { validateData } from "../middleware/validationMiddleware";
import { UserUpdateInput } from "../schemas/userSchemas";

const userRoutes = Router();
const userRepo = new PrismaUserRepository();
const userController = new UserController(userRepo);

userRoutes.use(authMiddleware, adminMiddleware);

userRoutes.get("/", userController.index.bind(userController));
userRoutes.get("/show/:id", userController.show.bind(userController));
userRoutes.put("/update/:id", validateData(UserUpdateInput), userController.update.bind(userController));
userRoutes.delete("/destroy/:id", userController.destroy.bind(userController));

export default userRoutes;