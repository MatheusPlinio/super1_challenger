import { prisma } from '../../lib/prismaClient';
import { BaseRepository } from '../BaseRepository';
import { IProductRepository } from '../contracts/IProductRepository';
import { Variation } from '@prisma/client';
import { IPaginatedResult } from '../IBaseRepository';

export class PrismaProductRepository extends BaseRepository<Variation> implements IProductRepository {
    constructor() {
        super(prisma.variation);
    }

    async findById(id: number): Promise<Variation | null> {
        return prisma.variation.findUnique({
            where: { id },
            include: { service: true },
        });
    }

    async search(query: string): Promise<IPaginatedResult<Variation>> {
        return this.findAll({
            where: {
                service: {
                    name: {
                        contains: query,
                        mode: 'insensitive',
                    },
                },
            },
            include: { service: true },
            orderBy: { id: 'asc' },
        });
    }
}
