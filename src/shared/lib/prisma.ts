import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient().$extends({
        query: {
            $allModels: {
                async $allOperations({ model, operation, args, query }) {
                    // Do not log AuditLog operations to prevent infinite loops
                    if ((model as string) === 'AuditLog') {
                        return query(args as any);
                    }

                    const writeOps = ['create', 'update', 'delete', 'upsert', 'createMany', 'updateMany', 'deleteMany'];
                    if (writeOps.includes(operation)) {
                        // First execute the actual operation
                        const result = await query(args);

                        // Then dynamically write to AuditLog
                        try {
                            const anyArgs = args as any;
                            // Extract details from args if possible
                            const detailsPayload = anyArgs.data ? JSON.stringify(anyArgs.data) : null;
                            const entityId = (result as any)?.id || 'unknown or bulk';

                            let humanAction = operation.toUpperCase();

                            // Try to infer if it was a soft delete or restore
                            if (operation === 'update' && anyArgs.data) {
                                if ('isDeleted' in anyArgs.data) {
                                    humanAction = anyArgs.data.isDeleted ? 'SOFT_DELETE' : 'RESTORE';
                                } else if ('status' in anyArgs.data && anyArgs.data.status === 'Trash') {
                                    humanAction = 'SOFT_DELETE';
                                }
                            }

                            // Requires a separate raw client to avoid recursive extension bugs, 
                            // but actually AuditLog is excluded above so we can use a raw client.
                            const prismaLib = require('@prisma/client');
                            const rawClient = new prismaLib.PrismaClient();

                            await rawClient.auditLog.create({
                                data: {
                                    entity: model || 'System',
                                    entityId: String(entityId),
                                    action: humanAction,
                                    details: detailsPayload
                                }
                            });
                            await rawClient.$disconnect();
                        } catch (e) {
                            console.error('Audit Log Registration Failed:', e);
                        }

                        return result;
                    }

                    // For read operations (findMany, findUnique), just process normally
                    return query(args);
                },
            },
        },
    });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma as any;
