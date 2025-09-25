import { Role } from "@prisma/client";
import { Request, Response, NextFunction } from "express";

export function adminMiddleware(req: Request, res: Response, next: NextFunction) {
    if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    if (req.user.role !== Role.ADMIN) {
        return res.status(403).json({ error: "Forbidden: Admins only" });
    }

    next();
}
