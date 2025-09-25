import { Prisma, ServiceType } from "@prisma/client";

export interface IServiceTypeRepository {
    create(data: Prisma.ServiceTypeCreateInput): Promise<ServiceType | null>
    findById(id: number): Promise<ServiceType | null>;
    update(id: number, data: Prisma.ServiceTypeUpdateInput): Promise<ServiceType | null>;
    destroy(id: number): Promise<ServiceType | null>
}