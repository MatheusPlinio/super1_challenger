import { z } from 'zod';

export const userRegistrationSchema = z.object({
    name: z.string(),
    email: z.email(),
    password: z.string().min(8),
});

export const userLoginSchema = z.object({
    email: z.email(),
    password: z.string().min(8),
});

export const UserUpdateInput = z.object({
    name: z.string().optional(),
    email: z.email().optional(),
    password: z.string().min(8).optional(),
});
