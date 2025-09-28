import { Request, Response } from "express";
import { VariationController } from "../../src/controllers/VariationController";
import { IVariationRepository } from "../../src/repositories/contracts/IVariationRepository";
import { StatusCodes } from "http-status-codes";

describe("VariationController", () => {
    let mockRepo: jest.Mocked<IVariationRepository>;
    let controller: VariationController;
    let mockRes: Partial<Response>;

    beforeEach(() => {
        mockRepo = {
            create: jest.fn(),
            count: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findAll: jest.fn(),
            paginateFromReq: jest.fn(),
            page: jest.fn(),
            limit: jest.fn(),
            skip: jest.fn(),
        };

        controller = new VariationController(mockRepo);

        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn(),
        };
    });

    describe("create", () => {
        it("should create a variation successfully", async () => {
            const req = { body: { name: "Basic", price: 50, duration: 30, serviceId: 1 } } as any;
            const variation = { id: 1, ...req.body };
            mockRepo.create.mockResolvedValue(variation);

            await controller.create(req, mockRes as Response);

            expect(mockRepo.create).toHaveBeenCalledWith(req.body);
            expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.OK);
            expect(mockRes.json).toHaveBeenCalledWith(variation);
        });

        it("should return 400 if creation fails", async () => {
            const req = { body: { name: "Basic" } } as any;
            mockRepo.create.mockResolvedValue(null as any);

            await controller.create(req, mockRes as Response);

            expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
            expect(mockRes.json).toHaveBeenCalledWith({ error: "Failed to create variation" });
        });

        it("should return 500 if repository throws", async () => {
            const req = { body: {} } as any;
            mockRepo.create.mockRejectedValue(new Error("DB error"));

            await controller.create(req, mockRes as Response);

            expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
            expect(mockRes.json).toHaveBeenCalledWith({ error: "Failed to create variation" });
        });
    });

    describe("show", () => {
        it("should return a variation by ID", async () => {
            const req = { params: { id: "1" } } as any;
            const variation = { id: 1, name: "Basic", price: 50, duration: 30, serviceId: 1 };
            mockRepo.findById.mockResolvedValue(variation);

            await controller.show(req, mockRes as Response);

            expect(mockRepo.findById).toHaveBeenCalledWith(1);
            expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.OK);
            expect(mockRes.json).toHaveBeenCalledWith(variation);
        });

        it("should return 400 if ID is invalid", async () => {
            const req = { params: { id: "abc" } } as any;

            await controller.show(req, mockRes as Response);

            expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
            expect(mockRes.json).toHaveBeenCalledWith({ error: "ID inválido" });
        });

        it("should return 404 if variation not found", async () => {
            const req = { params: { id: "1" } } as any;
            mockRepo.findById.mockResolvedValue(null);

            await controller.show(req, mockRes as Response);

            expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
            expect(mockRes.json).toHaveBeenCalledWith({ error: "Variation not found" });
        });

        it("should return 500 on error", async () => {
            const req = { params: { id: "1" } } as any;
            mockRepo.findById.mockRejectedValue(new Error("DB error"));

            await controller.show(req, mockRes as Response);

            expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
            expect(mockRes.json).toHaveBeenCalledWith({ error: "Failed to fetch variation" });
        });
    });

    describe("update", () => {
        it("should update a variation successfully", async () => {
            const req = { params: { id: "1" }, body: { name: "Updated" } } as any;
            const variation = { id: 1, ...req.body };
            mockRepo.update.mockResolvedValue(variation);

            await controller.update(req, mockRes as Response);

            expect(mockRepo.update).toHaveBeenCalledWith(1, req.body);
            expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.OK);
            expect(mockRes.json).toHaveBeenCalledWith(variation);
        });

        it("should return 400 if ID is invalid", async () => {
            const req = { params: { id: "abc" }, body: {} } as any;

            await controller.update(req, mockRes as Response);

            expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
            expect(mockRes.json).toHaveBeenCalledWith({ error: "ID inválido" });
        });

        it("should return 500 if repo throws", async () => {
            const req = { params: { id: "1" }, body: {} } as any;
            mockRepo.update.mockRejectedValue(new Error("DB error"));

            await controller.update(req, mockRes as Response);

            expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
            expect(mockRes.json).toHaveBeenCalledWith({ error: "Failed to update variation" });
        });
    });

    describe("destroy", () => {
        it("should delete a variation successfully", async () => {
            const req = { params: { id: "1" } } as any;
            const variation = { id: 1, name: "Basic", price: 50, duration: 30, serviceId: 1 };
            mockRepo.delete.mockResolvedValue(variation);

            await controller.destroy(req, mockRes as Response);

            expect(mockRepo.delete).toHaveBeenCalledWith(1);
            expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.NO_CONTENT);
            expect(mockRes.send).toHaveBeenCalled();
        });

        it("should return 400 if ID is invalid", async () => {
            const req = { params: { id: "abc" } } as any;

            await controller.destroy(req, mockRes as Response);

            expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
            expect(mockRes.json).toHaveBeenCalledWith({ error: "ID inválido" });
        });

        it("should return 404 if variation not found", async () => {
            const req = { params: { id: "1" } } as any;
            mockRepo.delete.mockResolvedValue(null as any);

            await controller.destroy(req, mockRes as Response);

            expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
            expect(mockRes.json).toHaveBeenCalledWith({ error: "Variation not found" });
        });

        it("should return 500 if repo throws", async () => {
            const req = { params: { id: "1" } } as any;
            mockRepo.delete.mockRejectedValue(new Error("DB error"));

            await controller.destroy(req, mockRes as Response);

            expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
            expect(mockRes.json).toHaveBeenCalledWith({ error: "Failed to delete variation" });
        });
    });
});
