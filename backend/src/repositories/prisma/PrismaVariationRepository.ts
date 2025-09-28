import { Prisma, Variation } from "@prisma/client";
import { BaseRepository } from "../BaseRepository";
import { prisma } from "../../lib/prismaClient";
import { IVariationRepository } from "../contracts/IVariationRepository";

export class PrismaVariationRepository extends BaseRepository<Variation> implements IVariationRepository {
    constructor() {
        super(prisma.user)
    }

    async create(data: Prisma.VariationCreateInput): Promise<Variation> {
        return prisma.variation.create({ data })
    }

    async count(): Promise<number> {
        return prisma.user.count();
    }

    async findById(id: number): Promise<Variation | null> {
        return prisma.variation.findUnique({ where: { id } });
    }

    async update(id: number, data: Prisma.VariationUpdateInput): Promise<Variation> {
        return prisma.variation.update({
            where: { id },
            data,
        });
    }

    async delete(id: number): Promise<Variation> {
        return prisma.variation.delete({
            where: { id },
        });
    }
}