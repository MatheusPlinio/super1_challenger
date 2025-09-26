import { Prisma, Service, User } from '@prisma/client';
import { IBaseRepository } from '../IBaseRepository';

export interface IServiceRepository extends IBaseRepository<Service> {
    store(data: Prisma.ServiceCreateInput & {
        variationIds?: number[];
        variationsData?: { name: string; price: number; duration: number }[]
    }): Promise<Service>

    findById(id: number): Promise<Service | null>;

    update(
        id: number,
        data: Prisma.ServiceUpdateInput & {
            variationIds?: number[];
            variationsData?: { name: string; price: number; duration: number }[];
        }
    ): Promise<Service | null>

    destroy(id: number): Promise<Service>
}