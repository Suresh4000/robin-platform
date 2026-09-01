import { NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';
import { z } from 'zod';

const generateInvoiceSchema = z.object({
    clientId: z.string(),
    timeEntryIds: z.array(z.string()).min(1, "At least one time entry must be selected"),
    hourlyRate: z.number().min(1, "Hourly rate is required"),
    dueDate: z.string().datetime().or(z.string()),
});

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const clientId = searchParams.get('clientId');

        let whereClause = {};
        if (clientId) {
            whereClause = { clientId };
        }

        const invoices = await prisma.invoice.findMany({
            where: whereClause,
            include: {
                client: { select: { name: true, company: true, email: true } },
                timeEntries: { include: { project: true } },
                _count: { select: { timeEntries: true } }
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ data: invoices });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { clientId, timeEntryIds, hourlyRate, dueDate } = generateInvoiceSchema.parse(body);

        // Fetch validated time entries
        const timeEntries = await prisma.timeEntry.findMany({
            where: {
                id: { in: timeEntryIds },
                isBillable: true,
                invoiceId: null,
                project: { clientId }
            }
        });

        if (timeEntries.length !== timeEntryIds.length) {
            return NextResponse.json({ error: 'Some time entries are invalid or already invoiced.' }, { status: 400 });
        }

        // Calculate total amount
        const totalHours = timeEntries.reduce((sum, entry) => sum + entry.hours, 0);
        const totalAmount = totalHours * hourlyRate;

        // Perform transaction
        const result = await prisma.$transaction(async (tx) => {
            const invoice = await tx.invoice.create({
                data: {
                    status: 'Draft',
                    totalAmount,
                    dueDate: new Date(dueDate),
                    clientId,
                }
            });

            await tx.timeEntry.updateMany({
                where: { id: { in: timeEntryIds } },
                data: { invoiceId: invoice.id }
            });

            return invoice;
        });

        return NextResponse.json({ data: result }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json(
            { error: 'Failed to generate invoice', details: error.errors || error.message },
            { status: 400 }
        );
    }
}
