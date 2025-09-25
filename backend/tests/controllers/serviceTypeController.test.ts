import { Request, Response } from "express";
import { ServiceTypeController } from "../../src/controllers/ServiceTypeController";
import { IServiceTypeRepository } from "../../src/repositories/contracts/IServiceTypeRepository";
import { StatusCodes } from "http-status-codes";

describe("ServiceTypeController", () => {
    let mockRepo: jest.Mocked<IServiceTypeRepository>;
    let controller: ServiceTypeController;
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
        mockRepo = {
            create: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
            destroy: jest.fn(),
        };

        controller = new ServiceTypeController(mockRepo);

        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
    });

    it("should create a service type successfully", async () => {
        req.body = { name: "Cabelo" };
        const mockServiceType = { id: 1, name: "Cabelo" };
        mockRepo.create.mockResolvedValue(mockServiceType);

        await controller.store(req as Request, res as Response);

        expect(mockRepo.create).toHaveBeenCalledWith({ name: "Cabelo" });
        expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
        expect(res.json).toHaveBeenCalledWith(mockServiceType);
    });

    it("should return 400 if creation fails", async () => {
        req.body = { name: "Cabelo" };
        mockRepo.create.mockResolvedValue(null);

        await controller.store(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
        expect(res.json).toHaveBeenCalledWith({ error: "Failed to create service type" });
    });

    it("should return a service type by id", async () => {
        req.params = { id: "1" };
        const mockServiceType = { id: 1, name: "Unhas" };
        mockRepo.findById.mockResolvedValue(mockServiceType);

        await controller.show(req as Request, res as Response);

        expect(mockRepo.findById).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
        expect(res.json).toHaveBeenCalledWith(mockServiceType);
    });

    it("should return 400 if id is invalid", async () => {
        req.params = { id: "abc" };

        await controller.show(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
        expect(res.json).toHaveBeenCalledWith({ error: "ID invalid" });
    });

    it("should return 404 if service type not found", async () => {
        req.params = { id: "99" };
        mockRepo.findById.mockResolvedValue(null);

        await controller.show(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
        expect(res.json).toHaveBeenCalledWith({ error: "Service type not found" });
    });

    it("should update a service type successfully", async () => {
        req.params = { id: "1" };
        req.body = { name: "Massagem" };
        const updated = { id: 1, name: "Massagem" };
        mockRepo.update.mockResolvedValue(updated);

        await controller.update(req as Request, res as Response);

        expect(mockRepo.update).toHaveBeenCalledWith(1, { name: "Massagem" });
        expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
        expect(res.json).toHaveBeenCalledWith(updated);
    });

    it("should return 404 if service type not found on update", async () => {
        req.params = { id: "1" };
        req.body = { name: "Massagem" };
        mockRepo.update.mockResolvedValue(null);

        await controller.update(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
        expect(res.json).toHaveBeenCalledWith({ error: "Service type not found" });
    });

    it("should delete a service type successfully", async () => {
        req.params = { id: "1" };
        const deletedServiceType = { id: 1, name: "Cabelo" };
        mockRepo.destroy.mockResolvedValue(deletedServiceType);

        await controller.destroy(req as Request, res as Response);

        expect(mockRepo.destroy).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(StatusCodes.NO_CONTENT);
        expect(res.json).toHaveBeenCalledWith({ message: "Service type deleted successfully" });
    });

    it("should return 404 if service type not found on delete", async () => {
        req.params = { id: "1" };
        mockRepo.destroy.mockResolvedValue(null);

        await controller.destroy(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
        expect(res.json).toHaveBeenCalledWith({ error: "Service type not found" });
    });
});
