import { z } from 'zod';

export const createClientSchema = z.object({
    name: z.string().min(2, "Name is required"),
    company: z.string().min(2, "Company is required"),
    email: z.string().email("Invalid email").optional().or(z.literal('')),
    phone: z.string().optional(),
    status: z.enum(['Active', 'On Hold', 'Completed']).default('Active'),
    engagementDate: z.string().datetime().optional().nullable(),
});

export const updateClientSchema = createClientSchema.extend({
    isDeleted: z.boolean().optional()
}).partial();
