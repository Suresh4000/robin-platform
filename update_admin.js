const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
    await prisma.admin.deleteMany({});
    await prisma.admin.create({
        data: {
            email: 'robinjones@gmail.com',
            password: 'admin@robin'
        }
    });
    console.log("Admin updated successfully");
}
main().finally(() => prisma.$disconnect());
