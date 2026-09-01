import { z } from 'zod';

export const createEventSchema = z.object({
    title: z.string().min(2, "Title is required"),
    type: z.enum(['Workshop', 'Webinar', 'Conference', 'Academy Program', 'Networking', 'Keynote']),
    date: z.coerce.date(),
    duration: z.coerce.number().min(5),
    location: z.string().min(1, "Location is required"),
    description: z.string().optional(),
    capacity: z.coerce.number().min(1).default(100),
    status: z.enum(['Draft', 'Published', 'Completed', 'Cancelled', 'Trash']).default('Draft'),
    bannerImage: z.string().optional()
});
export const updateEventSchema = createEventSchema.extend({
    isDeleted: z.boolean().optional()
}).partial();

