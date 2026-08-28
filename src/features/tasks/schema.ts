import { z } from 'zod';

export const createTaskSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    status: z.enum(['Todo', 'In Progress', 'Done']).default('Todo'),
    dueDate: z.string().datetime().optional().nullable(),
    projectId: z.string().min(1, "Project ID is required"),
});

export const updateTaskSchema = createTaskSchema.partial();
