import { Prisma, PrismaClient, User } from "@prisma/client";
import { IUserRepository } from "../contracts/UserInterfaceRepository";

const prisma = new PrismaClient();

export class PrismaUserRepository implements IUserRepository {
    async createUser(data: Prisma.UserCreateInput): Promise<User> {
        return prisma.user.create({ data })
    }

    async findUserByEmail(email: string): Promise<User | null> {
        return prisma.user.findUnique({ where: { email } })
    }
}