import { Cart, CartItem } from '@prisma/client';
import { IBaseRepository } from '../IBaseRepository';
import { CartForFrontend } from '../prisma/PrismaCartRepository';

export interface ICartRepository extends IBaseRepository<Cart> {
    getUserCart(userId: number): Promise<Cart & { items: (CartItem & { variation: any })[] }>;

    getCart(userId: number): Promise<CartForFrontend>;

    addItem(userId: number, variationId: number, quantity: number): Promise<CartItem>;

    updateItem(cartItemId: number, quantity: number): Promise<CartItem>;

    removeItem(cartItemId: number): Promise<void>;
}