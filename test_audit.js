import { resolve } from 'path';
const { PrismaClient } = require('@prisma/client');
const prismaOpts = new PrismaClient().$extends({
    query: {
        $allModels: {
            async $allOperations({ model, operation, args, query }) {
                if (model === 'AuditLog') return query(args);
                const writeOps = ['create', 'update', 'delete', 'upsert', 'createMany', 'updateMany', 'deleteMany'];
                if (writeOps.includes(operation)) {
                    const result = await query(args);
                    try {
                        const rawClient = new PrismaClient();
                        await rawClient.auditLog.create({
                            data: {
                                entity: model || 'System',
                                entityId: String(result?.id || 'bulk'),
                                action: operation.toUpperCase(),
                                details: args.data ? JSON.stringify(args.data) : null
                            }
                        });
                        await rawClient.$disconnect();
                        console.log("LOGGED TO AUDIT LOG!");
                    } catch (e) {
                        console.error('Audit Log Registration Failed:', e);
                    }
                    return result;
                }
                return query(args);
            }
        }
    }
});

async function main() {
    console.log("Checking logs...");
    const logs = await prismaOpts.auditLog.findMany();
    console.log(logs);
}
main();
