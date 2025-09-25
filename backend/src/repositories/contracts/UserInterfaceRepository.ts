import { Prisma, User } from '@prisma/client';

export interface IUserRepository {
    createUser(data: Prisma.UserCreateInput): Promise<User>

    findUserByEmail(email: string): Promise<User | null>
}
