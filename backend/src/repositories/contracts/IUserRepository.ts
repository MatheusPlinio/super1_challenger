import { Prisma, User } from '@prisma/client';
import { IBaseRepository } from '../IBaseRepository';

export interface IUserRepository extends IBaseRepository<User> {
    createUser(data: Prisma.UserCreateInput): Promise<User>
    findUserByEmail(email: string): Promise<User | null>
    count(): Promise<number>;
    findById(id: number): Promise<User | null>;
    updateUser(id: number, data: Prisma.UserUpdateInput): Promise<User>;
    deleteUser(id: number): Promise<User>;
}
