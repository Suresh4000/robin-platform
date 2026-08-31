//.config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function clean() {
    await prisma.attendee.deleteMany({ where: { event: { type: 'Discovery Call' } } });
    await prisma.event.deleteMany({ where: { type: 'Discovery Call' } });
    console.log('Cleaned all events from db');
}
clean().catch(console.error).finally(() => prisma.$disconnect());
