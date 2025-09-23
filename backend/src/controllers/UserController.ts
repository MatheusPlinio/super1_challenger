import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export class UserController {
    async create(req: Request, res: Response) {
        try {
            const { name, email, password } = req.body;

            const existingUser = await prisma.user.findUnique({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ error: "Usuário já cadastrado" });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await prisma.user.create({
                data: { name, email, password: hashedPassword },
            });

            res.status(201).json({
                id: user.id,
                name: user.name,
                email: user.email,
            });
        } catch (err: any) {
            res.status(500).json({ error: err.message });
        }
    }

    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            const user = await prisma.user.findUnique({ where: { email } });
            if (!user) return res.status(400).json({ error: "Usuário não encontrado" });

            const valid = await bcrypt.compare(password, user.password);
            if (!valid) return res.status(400).json({ error: "Senha inválida" });

            const token = jwt.sign(
                { id: user.id, email: user.email },
                process.env.JWT_SECRET || "secret",
                { expiresIn: "1d" }
            );

            res.json({ token });
        } catch (err: any) {
            res.status(500).json({ error: err.message });
        }
    }
}
