import z from "zod";

export const createVariationSchema = z.object({
    name: z
        .string()
        .min(2, "Name must be at least 2 characters long")
        .max(100, "Name must be at most 100 characters long"),
    price: z
        .number()
        .positive("Price must be greater than 0"),
    duration: z
        .number()
        .int("Duration must be an integer")
        .positive("Duration must be greater than 0"),
    serviceId: z
        .number()
        .int("Service ID must be an integer")
        .positive("Service ID must be greater than 0"),
});

export const updateVariationSchema = z.object({
    name: z
        .string()
        .min(2, "Name must be at least 2 characters long")
        .max(100, "Name must be at most 100 characters long")
        .optional(),
    price: z
        .number()
        .positive("Price must be greater than 0")
        .optional(),
    duration: z
        .number()
        .int("Duration must be an integer")
        .positive("Duration must be greater than 0")
        .optional(),
});