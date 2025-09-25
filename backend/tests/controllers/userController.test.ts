import request from "supertest";
import express from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import userRoutes from "../../src/routes/userRoutes";

const prisma = new PrismaClient();
const app = express();
app.use(express.json());
app.use("/api/users", userRoutes);

describe("UserController", () => {
    it("POST /api/users - deve criar um novo usuário", async () => {
        const response = await request(app)
            .post("/api/users/")
            .send({
                name: "Matheus",
                email: "matheus@example.com",
                password: "12345678910",
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
        expect(response.body.email).toBe("matheus@example.com");
    });

    it("POST /api/users/login - deve logar um usuário existente", async () => {
        const hashedPassword = await bcrypt.hash("12345678", 10);

        await prisma.user.create({
            data: { name: "Login User", email: "login@example.com", password: hashedPassword },
        });

        const response = await request(app)
            .post("/api/users/login")
            .send({
                email: "login@example.com",
                password: "12345678",
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("token");
    });
});

describe("UserController - Erros", () => {
    it("POST /api/users - deve falhar se o email for inválido", async () => {
        const response = await request(app)
            .post("/api/users")
            .send({
                name: "User",
                email: "email-invalido",
                password: "12345678"
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
    });

    it("POST /api/users - deve falhar se a senha for muito curta", async () => {
        const response = await request(app)
            .post("/api/users")
            .send({
                name: "User",
                email: "shortpass@example.com",
                password: "123",
            });

        expect(response.body.error).toBe("Invalid data");
        expect(response.body.details[0].message).toContain(">=8 characters");
    });

    it("POST /api/users - deve falhar se o email já existir", async () => {
        await prisma.user.create({
            data: { name: "Duplicado", email: "dup@example.com", password: "hashedpass" },
        });

        const response = await request(app)
            .post("/api/users")
            .send({
                name: "Outro",
                email: "dup@example.com",
                password: "12345678",
            });

        expect(response.status).toBe(409);
        expect(response.body.error).toContain("Usuário já existe");
    });

    it("POST /api/users/login - deve falhar com email não encontrado", async () => {
        const response = await request(app)
            .post("/api/users/login")
            .send({
                email: "naoexiste@example.com",
                password: "12345678",
            });

        expect(response.status).toBe(401);
        expect(response.body.error).toBe("Credenciais inválidas");
    });

    it("POST /api/users/login - deve falhar com senha incorreta", async () => {
        const hashedPassword = await bcrypt.hash("senhaCorreta123", 10);

        await prisma.user.create({
            data: { name: "Login Error", email: "loginerror@example.com", password: hashedPassword },
        });

        const response = await request(app)
            .post("/api/users/login")
            .send({
                email: "loginerror@example.com",
                password: "senhaErrada",
            });

        expect(response.status).toBe(401);
        expect(response.body.error).toBe("Credenciais inválidas");
    });
});
