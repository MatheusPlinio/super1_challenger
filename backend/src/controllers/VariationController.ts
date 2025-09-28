import { Request, Response } from "express";
import { AuthRequest } from "../types/AuthRequest";
import { IVariationRepository } from "../repositories/contracts/IVariationRepository";
import { StatusCodes } from "http-status-codes";

export class VariationController {
    constructor(private repo: IVariationRepository) { }

    async create(req: AuthRequest, res: Response) {
        try {
            const variation = await this.repo.create(req.body);

            if (!variation) {
                return res.status(StatusCodes.BAD_REQUEST).json({ error: "Failed to create variation" });
            }

            return res.status(StatusCodes.OK).json(variation);
        } catch (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Failed to create variation" });
        }
    }

    async show(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(StatusCodes.BAD_REQUEST).json({ error: "ID inválido" });
            }

            const variation = await this.repo.findById(id);

            if (!variation) {
                return res.status(StatusCodes.NOT_FOUND).json({ error: "Variation not found" });
            }

            return res.status(StatusCodes.OK).json(variation);
        } catch (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Failed to fetch variation" });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(StatusCodes.BAD_REQUEST).json({ error: "ID inválido" });
            }

            const variation = await this.repo.update(id, req.body);

            return res.status(StatusCodes.OK).json(variation);
        } catch (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Failed to update variation" });
        }
    }

    async destroy(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(StatusCodes.BAD_REQUEST).json({ error: "ID inválido" });
            }

            const variation = await this.repo.delete(id);

            if (!variation) {
                return res.status(StatusCodes.NOT_FOUND).json({ error: "Variation not found" });
            }

            return res.status(StatusCodes.NO_CONTENT).send();
        } catch (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Failed to delete variation" });
        }
    }
};