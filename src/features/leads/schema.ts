import { z } from 'zod';

export const LEAD_STAGES = [
    'New Inquiry',
    'Qualified',
    'Discovery Scheduled',
    'Discovery Completed',
    'Negotiation'
] as const;

export const createLeadSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    company: z.string().optional(),
    email: z.string().email("Invalid email").optional().or(z.literal('')),
    phone: z.string().optional(),
    source: z.enum(['Website', 'LinkedIn', 'Referral', 'Event']),
    status: z.enum(LEAD_STAGES).default('New Inquiry'),
    expectedValue: z.number().min(0).default(0),
    notes: z.string().optional(),
});

export const updateLeadSchema = createLeadSchema.partial();
