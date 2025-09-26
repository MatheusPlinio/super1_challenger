import { z } from "zod";

export const VariationSchema = z.object({
    name: z.string().min(1, "is required"),
    price: z.number().positive("must be greater than zero"),
    duration: z.number().positive("must be greater than zero"),
});


export const VariationUpdateSchema = z.object({
    id: z.number().int().positive().optional(),
    name: z.string().min(1).optional(),
    price: z.number().positive().optional(),
    duration: z.number().positive().optional(),
});