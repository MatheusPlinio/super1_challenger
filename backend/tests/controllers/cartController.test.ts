// tests/controllers/cartController.test.ts
import { CartController } from "../../src/controllers/CartController";
import { ICartRepository } from "../../src/repositories/contracts/ICartRepository";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { AuthRequest } from "../../src/types/AuthRequest";

describe("CartController", () => {
    let mockRepo: jest.Mocked<ICartRepository>;
    let controller: CartController;
    let res: Response;

    beforeEach(() => {
        mockRepo = {
            paginateFromReq: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            addItem: jest.fn(),
            updateItem: jest.fn(),
            removeItem: jest.fn()
        } as any;

        controller = new CartController(mockRepo);

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis()
        } as any;
    });

    describe("index", () => {
        it("should return cart items with meta", async () => {
            const req = {} as Request;
            const paginate = jest.fn().mockReturnValue({
                findAll: jest.fn().mockResolvedValue({
                    data: [{ id: 1 }],
                    total: 1, page: 1, limit: 10, lastPage: 1
                })
            });
            mockRepo.paginateFromReq = paginate;

            await controller.index(req, res);

            expect(res.json).toHaveBeenCalledWith({
                data: [{ id: 1 }],
                meta: { total: 1, page: 1, limit: 10, lastPage: 1 }
            });
        });

        it("should handle errors", async () => {
            const req = {} as Request;
            mockRepo.paginateFromReq = jest.fn().mockImplementation(() => { throw new Error("fail") });

            await controller.index(req, res);

            expect(res.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
            expect(res.json).toHaveBeenCalledWith({ error: "Failed to list services" });
        });
    });

    describe("addItem", () => {
        it("should add an item", async () => {
            const req = { user: { id: 1 }, body: { variationId: 2, quantity: 3 } } as AuthRequest;
            const fakeItem = { id: 1, variationId: 2, quantity: 3 };
            mockRepo.addItem.mockResolvedValue(fakeItem as any);

            await controller.addItem(req, res);

            expect(mockRepo.addItem).toHaveBeenCalledWith(1, 2, 3);
            expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
            expect(res.json).toHaveBeenCalledWith({ data: fakeItem });
        });

        it("should handle errors", async () => {
            const req = { user: { id: 1 }, body: { variationId: 2, quantity: 3 } } as AuthRequest;
            mockRepo.addItem.mockRejectedValue(new Error("fail"));

            await controller.addItem(req, res);

            expect(res.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
            expect(res.json).toHaveBeenCalledWith({ error: "Failed to add item" });
        });
    });

    describe("updateItem", () => {
        it("should update an item", async () => {
            const req = { params: { id: "1" }, body: { quantity: 5 } } as any;
            const updatedItem = { id: 1, quantity: 5 };
            mockRepo.updateItem.mockResolvedValue(updatedItem as any);

            await controller.updateItem(req, res);

            expect(mockRepo.updateItem).toHaveBeenCalledWith(1, 5);
            expect(res.json).toHaveBeenCalledWith({ data: updatedItem });
        });

        it("should handle errors", async () => {
            const req = { params: { id: "1" }, body: { quantity: 5 } } as any;
            mockRepo.updateItem.mockRejectedValue(new Error("fail"));

            await controller.updateItem(req, res);

            expect(res.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
            expect(res.json).toHaveBeenCalledWith({ error: "Failed to update item" });
        });
    });

    describe("removeItem", () => {
        it("should remove an item", async () => {
            const req = { params: { id: "1" } } as any;

            mockRepo.removeItem.mockResolvedValue(undefined);

            await controller.removeItem(req, res);

            expect(mockRepo.removeItem).toHaveBeenCalledWith(1);
            expect(res.status).toHaveBeenCalledWith(StatusCodes.NO_CONTENT);
            expect(res.send).toHaveBeenCalled();
        });

        it("should handle errors", async () => {
            const req = { params: { id: "1" } } as any;
            mockRepo.removeItem.mockRejectedValue(new Error("fail"));

            await controller.removeItem(req, res);

            expect(res.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
            expect(res.json).toHaveBeenCalledWith({ error: "Failed to remove item" });
        });
    });
});
