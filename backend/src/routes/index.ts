import { Router } from "express";
import serviceTypeRoutes from "./serviceTypeRoutes";
import userRoutes from "./userRoutes";
import authRoutes from "./authRoutes";

const router = Router();

router.use("/auth", authRoutes)
router.use("/users", userRoutes);
router.use("/service-types", serviceTypeRoutes);

export default router;
