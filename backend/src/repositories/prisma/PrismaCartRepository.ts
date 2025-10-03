import { Cart, CartItem } from "@prisma/client";
import { BaseRepository } from "../BaseRepository";
import { prisma } from "../../lib/prismaClient";
import { ICartRepository } from "../contracts/ICartRepository";

export class PrismaCartRepository extends BaseRepository<Cart> implements ICartRepository {
    constructor() {
        super(prisma.serviceType)
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
        });
    }

    async removeItem(cartItemId: number): Promise<void> {
        await prisma.cartItem.delete({ where: { id: cartItemId } });
    }
}

