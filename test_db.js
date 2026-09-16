const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.task.findMany().then(t => console.log(JSON.stringify(t, null, 2))).catch(console.error).finally(() => prisma.$disconnect());
