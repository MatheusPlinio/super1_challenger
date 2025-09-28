import { Router } from "express";
import serviceTypeRoutes from "./serviceTypeRoutes";
import userRoutes from "./userRoutes";
import authRoutes from "./authRoutes";
import serviceRoutes from "./serviceRoutes";
import variationRoutes from "./variationRoutes";

const router = Router();

router.use("/auth", authRoutes)
router.use("/users", userRoutes);
router.use("/service-types", serviceTypeRoutes);
router.use("/service", serviceRoutes);
router.use("/variation", variationRoutes)

export default router;
