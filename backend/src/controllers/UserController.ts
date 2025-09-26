import { Request, Response } from "express";
import { IUserRepository } from "../repositories/contracts/IUserRepository";
import { StatusCodes } from "http-status-codes";

export class UserController {
    constructor(private repo: IUserRepository) { }

    async index(req: Request, res: Response) {
        try {
            const result = await this.repo.paginateFromReq?.(req)?.findAll?.();

            if (result && 'data' in result) {
                return res.json({
                    data: result.data,
                    meta: {
                        total: result.total,
                        page: result.page,
                        limit: result.limit,
                        lastPage: result.lastPage,
                    },
                });
            }

            return res.status(StatusCodes.OK).json({ data: result })
        } catch (err: any) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message || "Internal Server Error" });
        }
    }

    async show(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(StatusCodes.BAD_REQUEST).json({ error: "ID inválido" });
            }

            const user = await this.repo.findById(id);

            if (!user) {
                return res.status(StatusCodes.NOT_FOUND).json({ error: "Usuário não encontrado" });
            }

            return res.json({ data: user });
        } catch (err: any) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message || "Internal Server Error" });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) return res.status(StatusCodes.BAD_REQUEST).json({ error: "ID inválido" });

            const existingUser = await this.repo.findById(id);
            if (!existingUser) return res.status(StatusCodes.NOT_FOUND).json({ error: "Usuário não encontrado" });

            const updatedUser = await this.repo.updateUser(id, req.body);

            return res.json({ data: updatedUser });
        } catch (err: any) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message || "Internal Server Error" });
        }
    }

    async destroy(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) return res.status(StatusCodes.BAD_REQUEST).json({ error: "ID inválido" });

            const existingUser = await this.repo.findById(id);
            if (!existingUser) return res.status(StatusCodes.NOT_FOUND).json({ error: "Usuário não encontrado" });

            await this.repo.deleteUser(id);

            return res.status(StatusCodes.NO_CONTENT).send();
        } catch (err: any) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message || "Internal Server Error" });
        }
    }
}