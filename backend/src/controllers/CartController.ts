import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ICartRepository } from "../repositories/contracts/ICartRepository";
import { AuthRequest } from "../types/AuthRequest";

export class CartController {

    constructor(private repo: ICartRepository) { }

    async index(req: AuthRequest, res: Response) {
        try {
            const result = await this.repo.getCart(req.user?.id ?? 0)

            if (result && 'data' in result) {
                return res.status(StatusCodes.OK).json({ data: result.data })
            }

            return res.status(StatusCodes.OK).json({ data: result })
        } catch (err) {
            console.error("List services error:", err);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Failed to list services" });
        }
    }

    async addItem(req: AuthRequest, res: Response) {
        try {
            const userId = req.user!.id;
            const { variationId, quantity } = req.body;
            const item = await this.repo.addItem(userId, variationId, quantity);
            return res.status(StatusCodes.CREATED).json({ data: item });
        } catch (err) {
            console.error("Add item error:", err);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Failed to add item" });
        }
    }

    async updateItem(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params;
            const { quantity } = req.body;
            const item = await this.repo.updateItem(Number(id), quantity);
            return res.json({ data: item });
        } catch (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Failed to update item" });
        }
    }

    async removeItem(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params;
            await this.repo.removeItem(Number(id));
            return res.status(StatusCodes.NO_CONTENT).send();
        } catch (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Failed to remove item" });
        }
    }
}
