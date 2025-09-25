import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { AuthRequest } from "../types/AuthRequest";

const prisma = new PrismaClient();

interface JwtPayload {
    userId: number;
}

export async function authMiddleware(
    req: AuthRequest,
    res: Response,
    next: NextFunction
) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ error: "Token missing" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || "secret"
        ) as JwtPayload;

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
        });

        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: "User not found" });
        }

        req.user = user;
        next();
    } catch (err) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ error: "Invalid token" });
    }
}
