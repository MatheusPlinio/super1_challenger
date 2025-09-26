
import express from 'express';
import { validateData } from '../middleware/validationMiddleware';
import { PrismaServiceTypeRepository } from '../repositories/prisma/PrismaServiceTypeRepository';
import { ServiceTypeController } from '../controllers/ServiceTypeController';
import { createServiceTypeInput, updateServiceTypeInput } from '../schemas/serviceTypeSchemas';
import { adminMiddleware } from '../middleware/adminMiddleware';
import { authMiddleware } from '../middleware/authMiddleware';

const serviceTypeRoutes = express.Router();
const serviceTypeRepo = new PrismaServiceTypeRepository();

const serviceTypeController = new ServiceTypeController(serviceTypeRepo);

serviceTypeRoutes.use(authMiddleware, adminMiddleware, function () {
    serviceTypeRoutes.post('/store', validateData(createServiceTypeInput), serviceTypeController.store.bind(serviceTypeController));
    serviceTypeRoutes.post('/show/:id', serviceTypeController.show.bind(serviceTypeController));
    serviceTypeRoutes.post('/update/:id', validateData(updateServiceTypeInput), serviceTypeController.update.bind(serviceTypeController));
    serviceTypeRoutes.post('/destroy/:id', serviceTypeController.destroy.bind(serviceTypeController));
})

export default serviceTypeRoutes;