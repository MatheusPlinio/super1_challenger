import { Prisma, PrismaClient, User } from "@prisma/client";
import { IUserRepository } from "../contracts/IUserRepository";
import { BaseRepository } from "../BaseRepository";

const prisma = new PrismaClient();

export class PrismaUserRepository extends BaseRepository<User> implements IUserRepository {
    constructor() {
        super(prisma.user)
    }

    async createUser(data: Prisma.UserCreateInput): Promise<User> {
        return prisma.user.create({ data })
    }

    async findUserByEmail(email: string): Promise<User | null> {
        return prisma.user.findUnique({ where: { email } })
    }

    async count(): Promise<number> {
        return prisma.user.count();
    }

    async findById(id: number): Promise<User | null> {
        return prisma.user.findUnique({ where: { id } });
    }

    async updateUser(id: number, data: Prisma.UserUpdateInput): Promise<User> {
        return prisma.user.update({
            where: { id },
            data,
        });
    }

    async deleteUser(id: number): Promise<User> {
        return prisma.user.delete({
            where: { id },
        });
    }
}