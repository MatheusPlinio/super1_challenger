import { Request, Response, NextFunction } from "express";
import { User } from "@prisma/client";

export interface AuthRequest extends Request {
    user?: User;
}