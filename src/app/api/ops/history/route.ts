import { NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';

export async function GET(request: Request) {
    try {
        // Fetch 50 most recent global system logs
        const auditLogs = await prisma.auditLog.findMany({
            orderBy: { createdAt: 'desc' },
            take: 50
        });

        const historyItems = auditLogs.map(log => {
            let descriptiveTitle = `${log.action} action performed on ${log.entity}`;

            try {
                if (log.details) {
                    const parsed = JSON.parse(log.details);
                    // Extract meaningful identifier if present
                    if (parsed.title) descriptiveTitle = `[${log.action}] ${parsed.title}`;
                    else if (parsed.name) descriptiveTitle = `[${log.action}] ${parsed.name}`;
                    else if (parsed.invoiceNumber) descriptiveTitle = `[${log.action}] Invoice ${parsed.invoiceNumber}`;
                }
            } catch (e) { }

            return {
                id: log.id,
                type: log.entity,
                title: descriptiveTitle,
                date: log.createdAt,
            };
        });

        return NextResponse.json({ data: historyItems });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
