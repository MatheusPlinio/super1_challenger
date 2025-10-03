import { Cart, CartItem, Service } from '@prisma/client';
import { IBaseRepository } from '../IBaseRepository';

export interface ICartRepository extends IBaseRepository<Cart> {
    getUserCart(userId: number): Promise<Cart & { items: (CartItem & { variation: any })[] }>;
    
    addItem(userId: number, variationId: number, quantity: number): Promise<CartItem>;

    updateItem(cartItemId: number, quantity: number): Promise<CartItem>;

    removeItem(cartItemId: number): Promise<void>;
}