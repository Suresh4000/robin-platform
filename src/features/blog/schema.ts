import { z } from 'zod';

export const createBlogSchema = z.object({
    title: z.string().min(2, "Title is required"),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "URL safe slug required (lowercase & hyphens only)"),
    excerpt: z.string().min(10, "Excerpt is required"),
    content: z.string().min(20, "Content must be provided"),
    coverImage: z.string().url("Must be a valid URL").optional().or(z.literal('')),
    category: z.string().default("Thoughts"),
    status: z.enum(['Draft', 'Published']).default('Draft'),
});

export const updateBlogSchema = createBlogSchema.partial();
