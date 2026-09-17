import { NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';

export async function GET(request: Request) {
    try {
        const deletedLeads = await prisma.lead.findMany({
            where: { isDeleted: true },
            select: { id: true, name: true, email: true, createdAt: true, updatedAt: true }
        });
        const deletedProjects = await prisma.project.findMany({
            where: { isDeleted: true },
            select: { id: true, title: true, createdAt: true, updatedAt: true }
        });
        const deletedTasks = await prisma.task.findMany({
            where: { isDeleted: true },
            select: { id: true, title: true, createdAt: true, updatedAt: true }
        });
        const deletedInvoices = await prisma.invoice.findMany({
            where: { isDeleted: true },
            include: { client: { select: { name: true } } }
        });
        const deletedEvents = await prisma.event.findMany({
            where: { status: 'Trash' },
            select: { id: true, title: true, type: true, createdAt: true, updatedAt: true }
        });

        const historyItems = [
            ...deletedLeads.map(item => ({ type: 'Lead', id: item.id, title: item.name || item.email, date: item.updatedAt })),
            ...deletedProjects.map(item => ({ type: 'Project', id: item.id, title: item.title, date: item.updatedAt })),
            ...deletedTasks.map(item => ({ type: 'Task', id: item.id, title: item.title, date: item.updatedAt })),
            ...deletedInvoices.map(item => ({ type: 'Invoice', id: item.id, title: `INV-${item.id.slice(-6).toUpperCase()} - ${item.client?.name || 'Unknown'}`, date: item.updatedAt })),
            ...deletedEvents.map(item => ({ type: 'Event', id: item.id, title: `${item.title} (${item.type})`, date: item.updatedAt }))
        ];

        // Sort descending by updated date
        historyItems.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        return NextResponse.json({ data: historyItems });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    // Handling bulk delete/restore
    try {
        const { items, action } = await request.json(); // action = 'restore' | 'delete'
        // items: { id: string, type: string }[]
        for (const item of items) {
            const { id, type } = item;
            if (action === 'restore') {
                if (type === 'Lead') await prisma.lead.update({ where: { id }, data: { isDeleted: false } });
                if (type === 'Project') await prisma.project.update({ where: { id }, data: { isDeleted: false } });
                if (type === 'Task') await prisma.task.update({ where: { id }, data: { isDeleted: false } });
                if (type === 'Invoice') await prisma.invoice.update({ where: { id }, data: { isDeleted: false } });
                if (type === 'Event') await prisma.event.update({ where: { id }, data: { status: 'Draft' } });
            } else if (action === 'delete') {
                if (type === 'Lead') await prisma.lead.delete({ where: { id } });
                if (type === 'Project') await prisma.project.delete({ where: { id } });
                if (type === 'Task') await prisma.task.delete({ where: { id } });
                if (type === 'Invoice') await prisma.invoice.delete({ where: { id } });
                if (type === 'Event') await prisma.event.delete({ where: { id } });
            }
        }
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
