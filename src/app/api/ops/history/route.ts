import { NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const take = parseInt(searchParams.get('take') || '30', 10);
        const skip = parseInt(searchParams.get('skip') || '0', 10);

        // Fetch recent global system logs with pagination
        const auditLogs = await prisma.auditLog.findMany({
            orderBy: { createdAt: 'desc' },
            take: take + 1, // Fetch one extra to determine if hasMore is true
            skip: skip
        });

        const hasMore = auditLogs.length > take;
        const subsetToReturn = auditLogs.slice(0, take);

        const historyItems = subsetToReturn.map((log: any) => {
            let itemIdentifier = 'a record';

            try {
                if (log.details) {
                    const parsed = JSON.parse(log.details);
                    // Extract meaningful identifier if present
                    if (parsed.title) itemIdentifier = `"${parsed.title}"`;
                    else if (parsed.name) itemIdentifier = `"${parsed.name}"`;
                    else if (parsed.invoiceNumber) itemIdentifier = `Invoice #${parsed.invoiceNumber}`;
                }
            } catch (e) { }

            let formattedAction = "Modified";
            if (log.action === "CREATE") formattedAction = "Created new";
            if (log.action === "UPDATE") formattedAction = "Updated details for";
            if (log.action === "DELETE") formattedAction = "Permanently deleted";
            if (log.action === "DELETE_MANY") formattedAction = "Bulk deleted multiple";
            if (log.action === "UPDATE_MANY") formattedAction = "Bulk updated multiple";

            let descriptiveTitle = `${formattedAction} ${log.entity || 'System'} ${itemIdentifier !== 'a record' ? itemIdentifier : 'record'}`;
            if (log.action.includes("MANY")) {
                descriptiveTitle = `${formattedAction} ${log.entity} records`;
            }

            return {
                id: log.id,
                type: log.entity,
                title: descriptiveTitle,
                date: log.createdAt,
            };
        });

        return NextResponse.json({ data: historyItems, hasMore });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
