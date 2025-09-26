import { Prisma, Service } from "@prisma/client";
import { BaseRepository } from "../BaseRepository";
import { prisma } from "../../lib/prismaClient";
import { IServiceRepository } from "../contracts/IServiceRepository";

export class PrismaServiceRepository extends BaseRepository<Service> implements IServiceRepository {
    constructor() {
        super(prisma.serviceType)
    }

    async store(
        data: Prisma.ServiceCreateInput & {
            variationIds?: number[];
            variationsData?: { name: string; price: number; duration: number }[];
        }
    ): Promise<Service> {
        const { variationIds, variationsData, ...rest } = data;

        return prisma.service.create({
            data: {
                ...rest,
                variations: {
                    connect: variationIds?.map((id) => ({ id })) || [],
                    create: variationsData || [],
                },
            },
            include: {
                variations: true,
                serviceType: true,
                provider: true,
            },
        });
    }

    async findById(id: number): Promise<Service | null> {
        return prisma.service.findUnique({ where: { id } });
    }

    async update(
        id: number,
        data: Prisma.ServiceUpdateInput & {
            variationIds?: number[];
            variationsData?: { name: string; price: number; duration: number }[];
        }
    ): Promise<Service | null> {
        const { variationIds, variationsData, ...rest } = data;

        return prisma.service.update({
            where: { id },
            data: {
                ...rest,
                variations: {
                    connect: variationIds?.map((vid) => ({ id: vid })),
                    create: variationsData,
                },
            },
            include: {
                variations: true,
                serviceType: true,
                provider: true,
            },
        });
    }

    async destroy(id: number): Promise<Service> {
        return prisma.service.delete({ where: { id } });
    }
}

