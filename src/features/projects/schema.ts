import { z } from 'zod';

export const createProjectSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    status: z.enum(['Planning', 'In Progress', 'On Hold', 'Completed', 'Cancelled']).default('Planning'),
    category: z.string().optional(),
    clientId: z.string().min(1, "Client ID is required"),
});

export const updateProjectSchema = createProjectSchema.extend({
    isDeleted: z.boolean().optional()
}).partial();
