import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { validate } from "../middlewares/validate";
import { createUserSchema, loginUserSchema } from "../validations/userValidation";

const router = Router();
const controller = new UserController();

router.post(
    "/",
    validate(createUserSchema),
    controller.create.bind(controller)
);

router.post(
    "/login",
    validate(loginUserSchema),
    controller.login.bind(controller)
);

export default router;
