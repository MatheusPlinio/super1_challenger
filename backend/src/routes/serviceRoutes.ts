
import express from 'express';
import { validateData } from '../middleware/validationMiddleware';
import { adminMiddleware } from '../middleware/adminMiddleware';
import { authMiddleware } from '../middleware/authMiddleware';
import { ServiceController } from '../controllers/ServiceController';
import { PrismaServiceRepository } from '../repositories/prisma/PrismaServiceRepository';
import { ServiceCreateSchema, ServiceUpdateSchema, } from '../schemas/serviceSchemas';

const serviceRoutes = express.Router();
const serviceRepo = new PrismaServiceRepository();

const serviceController = new ServiceController(serviceRepo);

serviceRoutes.use(authMiddleware, adminMiddleware, function () {
    serviceRoutes.post('/store', validateData(ServiceCreateSchema), serviceController.store.bind(serviceController));
    serviceRoutes.post('/show/:id', serviceController.show.bind(serviceController));
    serviceRoutes.post('/update/:id', validateData(ServiceUpdateSchema), serviceController.update.bind(serviceController));
    serviceRoutes.post('/destroy/:id', serviceController.destroy.bind(serviceController));
})

export default serviceRoutes;