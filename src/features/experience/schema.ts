import { z } from 'zod';

export const createPortfolioItemSchema = z.object({
    title: z.string().min(2, "Title is required"),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be URL safe (lowercase, hyphens only)"),
    summary: z.string().min(10, "Summary must be at least 10 characters"),
    content: z.string().min(20, "Content must be provided"),
    coverImage: z.string().url("Must be a valid URL").optional().or(z.literal('')),
    tags: z.string(), // Comma separated string
    status: z.enum(['Draft', 'Published']).default('Draft'),
});

export const updatePortfolioItemSchema = createPortfolioItemSchema.partial();
