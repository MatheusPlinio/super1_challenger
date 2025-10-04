import { Cart, CartItem } from "@prisma/client";
import { BaseRepository } from "../BaseRepository";
import { prisma } from "../../lib/prismaClient";
import { ICartRepository } from "../contracts/ICartRepository";

export interface CartItemForFrontend {
    id: number;
    variationId: number;
    name: string;
    price: number;
    quantity: number;
}

export interface CartForFrontend {
    id: number;
    userId: number;
    items: CartItemForFrontend[];
}


export class PrismaCartRepository extends BaseRepository<Cart> implements ICartRepository {
    constructor() {
        super(prisma.serviceType)
    }

    public async findAll(extraArgs: any = {}) {
        if (!this._usePagination) {
            return this.model.findMany({
                ...extraArgs,
            });
        }

        const data = await this.model.findMany({
            skip: this._skip,
            take: this._limit,
            ...extraArgs,
        });

        const total = await this.model.count({ where: extraArgs.where });
        const lastPage = Math.ceil(total / this._limit);

        return {
            data,
            total,
            page: this._page,
            limit: this._limit,
            lastPage,
        };
    }

    async getUserCart(userId: number): Promise<Cart & { items: (CartItem & { variation: any })[] }> {
        let cart = await prisma.cart.findFirst({
            where: { userId },
            include: { items: { include: { variation: true } } },
        });

        if (!cart) {
            cart = await prisma.cart.create({
                data: { userId },
                include: { items: { include: { variation: true } } },
            });
        }

        return cart;
    }

    async addItem(userId: number, variationId: number, quantity: number): Promise<CartItem> {
        const cart = await this.getUserCart(userId);

        const existingItem = await prisma.cartItem.findFirst({
            where: { cartId: cart.id, variationId },
        });

        if (existingItem) {
            return prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: existingItem.quantity + quantity },
            });
        }

        return prisma.cartItem.create({
            data: { cartId: cart.id, variationId, quantity },
        });
    }

    async updateItem(cartItemId: number, quantity: number): Promise<CartItem> {
        return prisma.cartItem.update({
            where: { id: cartItemId },
            data: { quantity },
            include: { variation: true }
        });
    }

    async removeItem(cartItemId: number): Promise<void> {
        await prisma.cartItem.delete({ where: { id: cartItemId } });
    }

    async getCart(userId: number): Promise<CartForFrontend> {
        const cart = await prisma.cart.findFirst({
            where: { userId },
            include: {
                items: {
                    include: {
                        variation: {
                            include: { service: { include: { serviceType: true } } }
                        }
                    }
                }
            }
        });

        if (!cart) throw new Error("Cart not found");

        const formattedItems: CartItemForFrontend[] = cart.items.map(item => ({
            id: item.id,
            variationId: item.variationId,
            name: `${item.variation.service.name} - ${item.variation.name}`,
            price: item.variation.price,
            quantity: item.quantity
        }));

        return {
            id: cart.id,
            userId: cart.userId,
            items: formattedItems
        };
    }
}