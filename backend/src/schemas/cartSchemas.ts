import { z } from "zod";

export const addToCartSchema = z.object({
    variationId: z.number().int().positive(),
    quantity: z.number().int().min(1).default(1),
});

export const updateCartItemSchema = z.object({
    quantity: z.number().int().min(0),
});

export const removeCartItemSchema = z.object({
    params: z.object({
        id: z.string().regex(/^\d+$/).transform(Number),
    }),
});
