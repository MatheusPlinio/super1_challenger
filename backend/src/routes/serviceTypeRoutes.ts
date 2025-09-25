
import express from 'express';
import { validateData } from '../middleware/validationMiddleware';
import { PrismaServiceTypeRepository } from '../repositories/prisma/PrismaServiceTypeRepository';
import { ServiceTypeController } from '../controllers/ServiceTypeController';
import { createServiceTypeInput, updateServiceTypeInput } from '../schemas/serviceTypeSchemas';
import { adminMiddleware } from '../middleware/adminMiddleware';
import { authMiddleware } from '../middleware/authMiddleware';

const authRoutes = express.Router();
const serviceTypeRepo = new PrismaServiceTypeRepository();

const serviceTypeController = new ServiceTypeController(serviceTypeRepo);

authRoutes.use(authMiddleware, adminMiddleware)

authRoutes.post('/store', validateData(createServiceTypeInput), serviceTypeController.store.bind(serviceTypeController));
authRoutes.post('/show/:id', serviceTypeController.show.bind(serviceTypeController));
authRoutes.post('/update/:id', validateData(updateServiceTypeInput), serviceTypeController.update.bind(serviceTypeController));
authRoutes.post('/destroy/:id', serviceTypeController.destroy.bind(serviceTypeController));

export default authRoutes;