import { Prisma, Variation } from '@prisma/client';
import { IBaseRepository } from '../IBaseRepository';

export interface IVariationRepository extends IBaseRepository<Variation> {
    create(data: Prisma.VariationCreateInput): Promise<Variation>
    count(): Promise<number>;
    findById(id: number): Promise<Variation | null>;
    update(id: number, data: Prisma.VariationUpdateInput): Promise<Variation>;
    delete(id: number): Promise<Variation>;
}
