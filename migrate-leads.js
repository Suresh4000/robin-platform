const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    await prisma.lead.updateMany({
        where: { status: 'New Inquiry' },
        data: { status: 'New Lead' }
    });
    await prisma.lead.updateMany({
        where: { status: 'Discovery Scheduled' },
        data: { status: 'Meeting Scheduled' }
    });
    await prisma.lead.updateMany({
        where: { status: 'Discovery Completed' },
        data: { status: 'Proposal Sent' }
    });
    // For anything that was previously Negotiation, it stays Negotiation.

    console.log("Migration complete");
}

main().catch(console.error).finally(() => prisma.$disconnect());
