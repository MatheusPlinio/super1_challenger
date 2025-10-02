import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import { IUserRepository } from "../repositories/contracts/IUserRepository";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../lib/prismaClient";
import { AuthRequest } from "../types/AuthRequest";

interface MyJwtPayload extends JwtPayload {
    id: number;
}

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
                { id: user.id },
                process.env.JWT_SECRET || "secret",
                { expiresIn: "1d" }
            );

            res.cookie('auth_token', token, {
                httpOnly: true,
                path: '/',
                maxAge: 1000 * 60 * 60 * 24,
                secure: false,
                sameSite: 'lax'
            });

            res.json({ message: 'Login realizado com sucesso' });
        } catch (err: any) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
        }
    }

    async me(req: AuthRequest, res: Response) {
        try {
            const token = req.cookies["auth_token"];

            if (!token) {
                return res.status(401).json({ error: "Not authenticated" });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as MyJwtPayload;

            const user = await prisma.user.findUnique({
                where: { id: decoded.id },
                select: { id: true, name: true, email: true, role: true }
            });

            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }

            return res.json(user);
        } catch (err) {
            return res.status(401).json({ error: "Invalid token" });
        }
    }
}
