import { Variation } from '@prisma/client';
import { IBaseRepository, IPaginatedResult } from '../IBaseRepository';

export interface IProductRepository extends IBaseRepository<Variation> {
    findById(id: number): Promise<Variation | null>;
    search(query: string): Promise<IPaginatedResult<Variation>>;
}
