import { z } from 'zod';

export const createServiceTypeInput = z.object({
    name: z
        .string({
            error: "Name is required",
        })
        .min(3, "Name must have at least 3 characters")
        .max(50, "Name must have at most 50 characters"),
});

export const updateServiceTypeInput = z.object({
    name: z
        .string()
        .min(3, "Name must have at least 3 characters")
        .max(50, "Name must have at most 50 characters")
        .optional()
});