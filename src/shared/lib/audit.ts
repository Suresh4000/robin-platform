import { prisma } from './prisma';

export async function logActivity(action: string, entity: string, entityId: string, details: Record<string, any>) {
    try {
        await prisma.auditLog.create({
            data: {
                action,
                entity,
                entityId,
                details: JSON.stringify(details),
            }
        });
    } catch (error) {
        console.error("Failed to log activity:", error);
    }
}
