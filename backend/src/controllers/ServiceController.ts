import { Request, Response } from "express";
import { AuthRequest } from "../types/AuthRequest";
import { prisma } from "../lib/prismaClient";
import { IServiceRepository } from "../repositories/contracts/IServiceRepository";
import { StatusCodes } from "http-status-codes";

export class ServiceController {

    constructor(private repo: IServiceRepository) { }

    async store(req: AuthRequest, res: Response) {
        try {

            const service = await this.repo.store(req.body);

            if (!service) {
                return res.status(StatusCodes.BAD_REQUEST).json({ error: "Failed to create service" })
            }

            return res.status(StatusCodes.CREATED).json(service);
        } catch (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Failed to create service" });
        }
    }

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
        } catch (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Failed to list services" });
        }
    }

    async show(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);

            if (isNaN(id)) {
                return res.status(StatusCodes.BAD_REQUEST).json({ error: "ID invalid" });
            }

            const service = await this.repo.findById(id);

            if (!service) return res.status(StatusCodes.NOT_FOUND).json({ error: "Service not found" });

            return res.status(StatusCodes.OK).json(service);
        } catch (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Failed to get service" });
        }
    }

    async update(req: AuthRequest, res: Response) {
        try {
            const id = parseInt(req.params.id);

            if (isNaN(id)) {
                return res.status(StatusCodes.BAD_REQUEST).json({ error: "ID invalid" });
            }

            const service = await this.repo.update(id, req.body);

            if (!service) {
                return res.status(StatusCodes.NOT_FOUND).json({ error: "Service type not found" });
            }

            res.status(StatusCodes.OK).json(service);
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Failed to update service type" });
        }
    }

    async destroy(req: AuthRequest, res: Response) {
        try {
            const id = parseInt(req.params.id);

            if (isNaN(id)) {
                return res.status(StatusCodes.BAD_REQUEST).json({ error: "ID invalid" });
            }

            const service = await this.repo.findById(id);
            if (!service) return res.status(StatusCodes.NOT_FOUND).json({ error: "Service not found" });

            if (service.providerId !== req.user?.id)
                return res.status(StatusCodes.UNAUTHORIZED).json({ error: "Not authorized" });

            await prisma.service.delete({ where: { id: Number(id) } });

            return res.status(StatusCodes.NO_CONTENT).send();
        } catch (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Failed to delete service" });
        }
    }
}
