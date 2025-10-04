import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { AuthRequest } from "../types/AuthRequest";

const prisma = new PrismaClient();

interface JwtPayload {
    id: number;
    email?: string;
    name?: string;
}

export async function authMiddleware(
    req: AuthRequest,
    res: Response,
    next: NextFunction
) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ error: "Token missing" });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as JwtPayload;

        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
        });

        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: "User not found" });
        }

        req.user = user;

        return next();
    } catch (err) {
        console.error("Auth error:", err);
        return res.status(StatusCodes.UNAUTHORIZED).json({ error: "Invalid token" });
    }
}
