import dotenv from "dotenv";
dotenv.config({ path: ".env.test" });
import { beforeEach, afterAll, beforeAll } from '@jest/globals';
import { execSync } from "child_process";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function ensureTestDatabase() {
    try {
        await prisma.$queryRaw`SELECT 1`;
    } catch (err) {
        console.log("Banco de teste não existe. Criando...");
        execSync("npx prisma db push --accept-data-loss", {
            stdio: "inherit",
            env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL },
        });
        console.log("Banco de teste criado ✅");
    }

    execSync("npx prisma migrate deploy", {
        stdio: "inherit",
        env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL },
    });
}

beforeAll(async () => {
    await ensureTestDatabase();
});

beforeEach(async () => {
    await prisma.booking.deleteMany();
    await prisma.variation.deleteMany();
    await prisma.service.deleteMany();
    await prisma.user.deleteMany();
});

afterAll(async () => {
    await prisma.$disconnect();
});
