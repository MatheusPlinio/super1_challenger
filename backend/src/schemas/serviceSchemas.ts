import { z } from "zod";
import { VariationSchema, VariationUpdateSchema } from "./variationSchema";

export const ServiceCreateSchema = z.object({
    name: z.string().min(1, "is required"),
    description: z.string().min(1, "is required"),
    photos: z.array(z.string().url("must be a valid URL")).optional(),
    serviceTypeId: z.number().int().positive("must be a valid id"),
    providerId: z.number().int().positive("must be a valid id"),

    variations: z.array(VariationSchema).min(1, "At least one variation is required"),
});

export const ServiceUpdateSchema = z.object({
    name: z.string().min(1).optional(),
    description: z.string().optional(),
    photos: z.array(z.string().url()).optional(),
    serviceTypeId: z.number().int().positive().optional(),
    providerId: z.number().int().positive().optional(),

    variations: z.array(VariationUpdateSchema).optional(),
});
