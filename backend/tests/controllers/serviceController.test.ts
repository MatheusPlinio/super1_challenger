
import { StatusCodes } from "http-status-codes";
import { ServiceController } from "../../src/controllers/ServiceController";
import { prisma } from "../../src/lib/prismaClient";

jest.mock("../../src/lib/prismaClient", () => ({
    prisma: {
        service: {
            delete: jest.fn(),
        },
    },
}));

describe("ServiceController - Error cases", () => {
    let controller: ServiceController;
    let mockRepo: any;
    let mockReq: any;
    let mockRes: any;

    beforeEach(() => {
        mockRepo = {
            store: jest.fn(),
            update: jest.fn(),
            findById: jest.fn(),
            paginateFromReq: jest.fn(() => ({ findAll: jest.fn() })),
        };

        controller = new ServiceController(mockRepo);

        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis(),
        };
        (prisma.service.delete as jest.Mock) = jest.fn();
    });

    describe("store", () => {
        it("should return 400 if repo returns null", async () => {
            mockRepo.store.mockResolvedValue(null);
            mockReq = { body: {}, user: { id: 1 } };

            await controller.store(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
            expect(mockRes.json).toHaveBeenCalledWith({ error: "Failed to create service" });
        });

        it("should return 500 if repo throws", async () => {
            mockRepo.store.mockRejectedValue(new Error("DB fail"));
            mockReq = { body: {}, user: { id: 1 } };

            await controller.store(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
            expect(mockRes.json).toHaveBeenCalledWith({ error: "Failed to create service" });
        });
    });

    describe("show", () => {
        it("should return 400 for invalid ID", async () => {
            mockReq = { params: { id: "abc" } };

            await controller.show(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
            expect(mockRes.json).toHaveBeenCalledWith({ error: "ID invalid" });
        });

        it("should return 404 if service not found", async () => {
            mockRepo.findById.mockResolvedValue(null);
            mockReq = { params: { id: "1" } };

            await controller.show(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
            expect(mockRes.json).toHaveBeenCalledWith({ error: "Service not found" });
        });

        it("should return 500 if repo throws", async () => {
            mockRepo.findById.mockRejectedValue(new Error("DB fail"));
            mockReq = { params: { id: "1" } };

            await controller.show(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
            expect(mockRes.json).toHaveBeenCalledWith({ error: "Failed to get service" });
        });
    });

    describe("update", () => {
        it("should return 400 for invalid ID", async () => {
            mockReq = { params: { id: "abc" }, body: {}, user: { id: 1 } };

            await controller.update(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
            expect(mockRes.json).toHaveBeenCalledWith({ error: "ID invalid" });
        });

        it("should return 404 if update fails", async () => {
            mockRepo.update.mockResolvedValue(null);
            mockReq = { params: { id: "1" }, body: {}, user: { id: 1 } };

            await controller.update(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
            expect(mockRes.json).toHaveBeenCalledWith({ error: "Service type not found" });
        });

        it("should return 500 if repo throws", async () => {
            mockRepo.update.mockRejectedValue(new Error("DB fail"));
            mockReq = { params: { id: "1" }, body: {}, user: { id: 1 } };

            await controller.update(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
            expect(mockRes.json).toHaveBeenCalledWith({ error: "Failed to update service type" });
        });
    });

    describe("destroy", () => {
        it("should return 400 for invalid ID", async () => {
            mockReq = { params: { id: "abc" }, user: { id: 1 } };

            await controller.destroy(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
            expect(mockRes.json).toHaveBeenCalledWith({ error: "ID invalid" });
        });

        it("should return 404 if service not found", async () => {
            mockRepo.findById.mockResolvedValue(null);
            mockReq = { params: { id: "1" }, user: { id: 1 } };

            await controller.destroy(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
            expect(mockRes.json).toHaveBeenCalledWith({ error: "Service not found" });
        });

        it("should return 401 if user is not provider", async () => {
            mockRepo.findById.mockResolvedValue({ id: 1, providerId: 2 });
            mockReq = { params: { id: "1" }, user: { id: 1 } };

            await controller.destroy(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED);
            expect(mockRes.json).toHaveBeenCalledWith({ error: "Not authorized" });
        });

        it("should return 500 if prisma delete throws", async () => {
            mockRepo.findById.mockResolvedValue({ id: 1, providerId: 1 });
            (prisma.service.delete as jest.Mock).mockRejectedValue(new Error("DB fail"));
            mockReq = { params: { id: "1" }, user: { id: 1 } };

            await controller.destroy(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
            expect(mockRes.json).toHaveBeenCalledWith({ error: "Failed to delete service" });
        });
    });
});
