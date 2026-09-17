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
            let descriptiveTitle = `Updated system ${log.entity.toLowerCase()}`;

            try {
                if (log.details) {
                    const parsed = JSON.parse(log.details);

                    // Human readable formatting based on action type
                    if (log.action === "CREATE") {
                        if (log.entity === 'Lead') descriptiveTitle = `Captured a new lead enquiry from ${parsed.name || parsed.email}`;
                        else if (log.entity === 'Invoice') descriptiveTitle = `Drafted a new invoice for ${parsed.amount}`;
                        else descriptiveTitle = `Created a new ${log.entity.toLowerCase()} record for ${parsed.title || parsed.name || 'the system'}`;
                    }
                    else if (log.action === "UPDATE") {
                        if (log.entity === 'Lead' && parsed.status) descriptiveTitle = `Moved lead ${parsed.name || 'to'} to '${parsed.status}' stage`;
                        else descriptiveTitle = `Updated the ${log.entity.toLowerCase()} details for ${parsed.title || parsed.name || 'system record'}`;
                    }
                    else if (log.action === "DELETE") {
                        descriptiveTitle = `Permanently deleted the ${log.entity.toLowerCase()} for ${parsed.title || parsed.name || 'record'}`;
                    }
                    else if (log.action === "RESTORE") {
                        descriptiveTitle = `Restored the deleted ${log.entity.toLowerCase()} for ${parsed.title || parsed.name || 'record'}`;
                    }
                    else if (log.action === "bulk") {
                        descriptiveTitle = `Performed bulk operations on multiple ${log.entity.toLowerCase()} records`;
                    }

                    // Fallback injection if generic format is used
                    if (parsed.message) {
                        descriptiveTitle = parsed.message;
                    }
                } else {
                    if (log.action === "CREATE") descriptiveTitle = `Created a new ${log.entity.toLowerCase()} entry`;
                    if (log.action === "UPDATE") descriptiveTitle = `Modified a ${log.entity.toLowerCase()} entry`;
                    if (log.action === "DELETE") descriptiveTitle = `Deleted a ${log.entity.toLowerCase()} entry`;
                }
            } catch (e) {
                // Default fallback if JSON parsing fails
                descriptiveTitle = `${log.action} action performed on ${log.entity}`;
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
