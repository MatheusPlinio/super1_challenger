import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { IUserRepository } from "../repositories/contracts/UserInterfaceRepository";
import { StatusCodes } from "http-status-codes";

const prisma = new PrismaClient();

export class AuthController {
    constructor(private repo: IUserRepository) { }

    async create(req: Request, res: Response) {
        try {
            const { name, email, password } = req.body;

            const userExist = await this.repo.findUserByEmail(email);

            if (userExist) {
                return res.status(StatusCodes.CONFLICT).json({ error: "Usuário já existe" });
            }

            const user = await this.repo.createUser({
                name,
                email,
                password: await bcrypt.hash(password, 10)
            });

            if (!user) {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Erro ao criar usuário" })
            }

            res.status(StatusCodes.CREATED).json({
                id: user.id,
                name: user.name,
                email: user.email
            });

        } catch (err: any) {
            res.status(500).json({ error: err.message });
        }
    }

    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            const user = await prisma.user.findUnique({ where: { email } });
            if (!user) return res.status(StatusCodes.UNAUTHORIZED).json({ error: "Credenciais inválidas" });

            const valid = await bcrypt.compare(password, user.password);
            if (!valid) return res.status(StatusCodes.UNAUTHORIZED).json({ error: "Credenciais inválidas" });

            const token = jwt.sign(
                { id: user.id, email: user.email },
                process.env.JWT_SECRET || "secret",
                { expiresIn: "1d" }
            );

            res.json({ token });
        } catch (err: any) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
        }
    }
}
