import { Router } from "express";
import { VariationController } from "../controllers/VariationController";
import { PrismaVariationRepository } from "../repositories/prisma/PrismaVariationRepository";

const variationRoutes = Router();
const variationRepo = new PrismaVariationRepository();
const variationController = new VariationController(variationRepo)

variationRoutes.post("/store", variationController.create.bind(variationController));
variationRoutes.get("/show/:id", variationController.show.bind(variationController));
variationRoutes.put("/update/:id", variationController.update.bind(variationController));
variationRoutes.delete("/destroy/:id", variationController.destroy.bind(variationController));

export default variationRoutes;