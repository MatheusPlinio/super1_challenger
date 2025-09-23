import request from "supertest";
import express from "express";
import { PrismaClient } from "@prisma/client";
import userRoutes from "../../src/routes/userRoutes";

const prisma = new PrismaClient();
const app = express();
app.use(express.json());
app.use("/api/users", userRoutes);

describe("UserController", () => {
    beforeAll(async () => {
        await prisma.booking.deleteMany();
        await prisma.variation.deleteMany();
        await prisma.service.deleteMany();
        await prisma.user.deleteMany();
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    it("POST /api/users - deve criar um novo usuário", async () => {
        const response = await request(app)
            .post("/api/users")
            .send({
                name: "Matheus",
                email: "matheus@example.com",
                password: "123456",
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
        expect(response.body.email).toBe("matheus@example.com");
    });

    it("POST /api/users/login - deve logar um usuário existente", async () => {
        await prisma.user.create({
            data: { name: "LoginUser", email: "login@example.com", password: "123456" },
        });

        const response = await request(app)
            .post("/api/users/login")
            .send({
                email: "login@example.com",
                password: "123456",
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("token");
    });
});
