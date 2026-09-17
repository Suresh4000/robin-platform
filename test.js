const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
    const posts = await prisma.blogPost.findMany();
    console.log(posts.map(p => ({
        id: p.id,
        title: p.title,
        status: p.status,
        publishedAt: p.publishedAt
    })));
}
main().finally(() => prisma.$disconnect());
