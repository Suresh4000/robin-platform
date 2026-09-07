const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const https = require('https');

const urls = [
    { url: 'https://svaantech.com/wp-content/uploads/2026/08/1780964714422.png', name: 'robin-hero.png', mime: 'image/png' },
    { url: 'https://images.unsplash.com/photo-1739298061740-5ed03045b280?q=80&w=1600&auto=format&fit=crop', name: 'strategic-meeting.jpg', mime: 'image/jpeg' },
    { url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80', name: 'office-abstract.jpg', mime: 'image/jpeg' },
    { url: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?auto=format&fit=crop&w=1920&q=80', name: 'dark-architecture.jpg', mime: 'image/jpeg' }
];

async function seed() {
    console.log('Starting seed...');
    for (const item of urls) {
        console.log(`Downloading ${item.url}...`);

        const base64Data = await new Promise((resolve, reject) => {
            https.get(item.url, (resp) => {
                const data = [];
                resp.on('data', (chunk) => {
                    data.push(chunk);
                });
                resp.on('end', () => {
                    const buffer = Buffer.concat(data);
                    // Create base64 data URI format
                    const base64 = `data:${item.mime};base64,${buffer.toString('base64')}`;

                    resolve({ base64, size: buffer.length });
                });
            }).on('error', (err) => reject(err));
        });

        console.log(`Saving ${item.name} to DB (${base64Data.size} bytes)...`);

        await prisma.media.create({
            data: {
                filename: item.name,
                type: item.mime,
                size: base64Data.size,
                data: base64Data.base64
            }
        });
    }
    console.log('Seed complete!');
}

seed().catch(console.error).finally(() => prisma.$disconnect());
