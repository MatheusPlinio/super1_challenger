import { Request, Response } from "express";
import { IServiceTypeRepository } from "../repositories/contracts/IServiceTypeRepository";
import { StatusCodes } from "http-status-codes";

export class ServiceTypeController {
    constructor(private repo: IServiceTypeRepository) { }

    async store(req: Request, res: Response) {
        try {
            const serviceType = await this.repo.create(req.body)

            if (!serviceType) {
                return res.status(StatusCodes.BAD_REQUEST).json({ error: "Failed to create service type" })
            }

            res.status(StatusCodes.CREATED).json(serviceType);
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Failed to create service type" })
        }
    }

    async show(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);

            if (isNaN(id)) {
                return res.status(StatusCodes.BAD_REQUEST).json({ error: "ID invalid" });
            }

            const serviceType = await this.repo.findById(id);

            if (!serviceType) {
                return res.status(StatusCodes.NOT_FOUND).json({ error: "Service type not found" });
            }

            res.status(StatusCodes.OK).json(serviceType);
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Failed to retrieve service type" });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);

            if (isNaN(id)) {
                return res.status(StatusCodes.BAD_REQUEST).json({ error: "ID invalid" });
            }

            const serviceType = await this.repo.update(id, req.body);

            if (!serviceType) {
                return res.status(StatusCodes.NOT_FOUND).json({ error: "Service type not found" });
            }

            res.status(StatusCodes.OK).json(serviceType);
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Failed to update service type" });
        }
    }

    async destroy(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);

            if (isNaN(id)) {
                return res.status(StatusCodes.BAD_REQUEST).json({ error: "ID invalid" });
            }

            const serviceType = await this.repo.destroy(id);

            if (!serviceType) {
                return res.status(StatusCodes.NOT_FOUND).json({ error: "Service type not found" });
            }

            return res.status(StatusCodes.NO_CONTENT).json({ message: "Service type deleted successfully" });
        }
        catch (err) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Failed to delete service type" });
        }
    }
}