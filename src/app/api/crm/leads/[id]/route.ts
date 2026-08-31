import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { updateLeadSchema } from '@/features/leads/schema';

const prisma = new PrismaClient();

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
    const params = await context.params;
    try {
        const body = await request.json();
        const validatedData = updateLeadSchema.parse(body);

        const oldLead = await prisma.lead.findUnique({ where: { id: params.id } });
        if (!oldLead) {
            return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
        }

        const updatedLead = await prisma.lead.update({
            where: { id: params.id },
            data: validatedData,
        });

        if (validatedData.status === 'Discovery Scheduled' && oldLead.status !== 'Discovery Scheduled') {
            const notes = oldLead.notes || '';
            const dateMatch = notes.match(/Booking Date:\s*([^\n\r]+)/);
            const timeMatch = notes.match(/Booking Time:\s*([^\n\r]+)/);

            const bookingDate = dateMatch ? dateMatch[1].trim() : null;
            const bookingTime = timeMatch ? timeMatch[1].trim() : null;

            if (bookingDate && bookingTime) {
                const eventDateTime = new Date(`${bookingDate}T${bookingTime}:00`);

                await prisma.event.create({
                    data: {
                        title: `Discovery Call: ${oldLead.name}`,
                        type: 'Discovery Call',
                        date: eventDateTime,
                        duration: 30,
                        location: 'Virtual',
                        description: `Discovery Call scheduled for ${oldLead.name}.\n\nLead Details:\nCompany: ${oldLead.company || 'N/A'}\nPhone: ${oldLead.phone || 'N/A'}\n\nEnquiry Notes:\n${oldLead.notes}`,
                        capacity: 2,
                        status: 'Published',
                        attendees: {
                            create: {
                                name: oldLead.name,
                                email: oldLead.email || 'no-email@example.com'
                            }
                        }
                    }
                });
            }
        }

        return NextResponse.json({ data: updatedLead });
    } catch (error: any) {
        if (error.code === 'P2025') {
            return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
        }
        return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 });
    }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
    const params = await context.params;
    try {
        await prisma.lead.delete({
            where: { id: params.id },
        });
        return NextResponse.json({ success: true });
    } catch (error: any) {
        if (error.code === 'P2025') {
            return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
        }
        return NextResponse.json({ error: 'Failed to delete lead' }, { status: 500 });
    }
}
