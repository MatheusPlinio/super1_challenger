import { Prisma, PrismaClient, ServiceType } from "@prisma/client";
import { IServiceTypeRepository } from "../contracts/IServiceTypeRepository";
import { BaseRepository } from "../BaseRepository";

const prisma = new PrismaClient();

export class PrismaServiceTypeRepository extends BaseRepository<ServiceType> implements IServiceTypeRepository {
    constructor() {
        super(prisma.serviceType)
    }

    async create(data: Prisma.ServiceTypeCreateInput): Promise<ServiceType> {
        return prisma.serviceType.create({ data });
    }

    async findById(id: number): Promise<ServiceType | null> {
        return prisma.serviceType.findUnique({ where: { id } });
    }

    async update(id: number, data: Prisma.ServiceTypeUpdateInput): Promise<ServiceType> {
        return prisma.serviceType.update({ where: { id }, data });
    }

    async destroy(id: number): Promise<ServiceType> {
        return prisma.serviceType.delete({ where: { id } });
    }
}