import { Request, Response } from "express";
import { IUserRepository } from "../../src/repositories/contracts/UserInterfaceRepository";
import { UserController } from "../../src/controllers/UserController";
import { Role, User } from "@prisma/client";

describe("UserController", () => {
    let userRepo: jest.Mocked<IUserRepository>;
    let controller: UserController;

    const mockUser: User = {
        id: 1,
        name: "Test User",
        email: "test@example.com",
        password: "hashed",
        role: Role.CLIENT,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const makeReq = (params = {}, query = {}, body = {}) =>
        ({ params, query, body } as Partial<Request>);

    const makeRes = () => {
        const res: Partial<Response> = {};
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        res.send = jest.fn().mockReturnValue(res);
        return res as Response;
    };

    beforeEach(() => {
        userRepo = {
            findById: jest.fn(),
            findAll: jest.fn(),
            findAllRaw: jest.fn(),
            updateUser: jest.fn(),
            deleteUser: jest.fn(),
            createUser: jest.fn(),
            findUserByEmail: jest.fn(),
            page: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            skip: jest.fn().mockReturnThis(),
            paginateFromReq: jest.fn().mockReturnThis(),
        } as unknown as jest.Mocked<IUserRepository>;

        controller = new UserController(userRepo);
    });

    // ======== INDEX ========
    describe("index", () => {
        it("returns paginated users", async () => {
            const mockResult = {
                data: [mockUser],
                total: 1,
                page: 1,
                limit: 10,
                lastPage: 1,
            };
            userRepo.paginateFromReq.mockReturnThis();
            userRepo.findAll.mockResolvedValue(mockResult);

            const req = makeReq({}, { page: "1", limit: "10" });
            const res = makeRes();

            await controller.index(req as Request, res);

            expect(res.json).toHaveBeenCalledWith({
                data: mockResult.data,
                meta: {
                    total: mockResult.total,
                    page: mockResult.page,
                    limit: mockResult.limit,
                    lastPage: mockResult.lastPage,
                },
            });
        });

        it("returns raw users when no query params", async () => {
            userRepo.findAll.mockResolvedValue([mockUser]);

            const req = makeReq();
            const res = makeRes();

            await controller.index(req as Request, res);

            expect(res.json).toHaveBeenCalledWith({ data: [mockUser] });
        });

        it("returns 500 on error", async () => {
            userRepo.findAll.mockRejectedValue(new Error("DB fail"));
            const req = makeReq();
            const res = makeRes();

            await controller.index(req as Request, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: "DB fail" });
        });
    });

    // ======== SHOW ========
    describe("show", () => {
        it("returns a user when found", async () => {
            userRepo.findById.mockResolvedValue(mockUser);
            const req = makeReq({ id: "1" });
            const res = makeRes();

            await controller.show(req as Request, res);
            expect(res.json).toHaveBeenCalledWith({ data: mockUser });
        });

        it("returns 404 if not found", async () => {
            userRepo.findById.mockResolvedValue(null);
            const req = makeReq({ id: "1" });
            const res = makeRes();

            await controller.show(req as Request, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: "Usuário não encontrado" });
        });

        it("returns 400 if invalid id", async () => {
            const req = makeReq({ id: "abc" });
            const res = makeRes();

            await controller.show(req as Request, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: "ID inválido" });
        });
    });

    // ======== UPDATE ========
    describe("update", () => {
        it("updates user successfully", async () => {
            userRepo.findById.mockResolvedValue(mockUser);
            userRepo.updateUser.mockResolvedValue(mockUser);

            const req = makeReq({ id: "1" }, {}, { name: "Updated" });
            const res = makeRes();

            await controller.update(req as Request, res);

            expect(res.json).toHaveBeenCalledWith({ data: mockUser });
        });

        it("returns 404 if not found", async () => {
            userRepo.findById.mockResolvedValue(null);

            const req = makeReq({ id: "1" }, {}, { name: "Updated" });
            const res = makeRes();

            await controller.update(req as Request, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: "Usuário não encontrado" });
        });
    });

    // ======== DESTROY ========
    describe("destroy", () => {

        const makeMockUser = (overrides: Partial<User> = {}): User => ({
            id: 1,
            name: "Test User",
            email: "test@example.com",
            password: "hashedpassword",
            role: Role.CLIENT,
            createdAt: new Date(),
            updatedAt: new Date(),
            ...overrides,
        });

        it("deletes user successfully", async () => {
            userRepo.findById.mockResolvedValue(mockUser);
            userRepo.deleteUser.mockResolvedValue(makeMockUser({ id: 2 }));

            const req = makeReq({ id: "1" });
            const res = makeRes();

            await controller.destroy(req as Request, res);

            expect(res.status).toHaveBeenCalledWith(204);
            expect(res.send).toHaveBeenCalled();
        });

        it("returns 404 if not found", async () => {
            userRepo.findById.mockResolvedValue(null);

            const req = makeReq({ id: "1" });
            const res = makeRes();

            await controller.destroy(req as Request, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: "Usuário não encontrado" });
        });

        it("returns 400 if invalid id", async () => {
            const req = makeReq({ id: "abc" });
            const res = makeRes();

            await controller.destroy(req as Request, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: "ID inválido" });
        });
    });
});
