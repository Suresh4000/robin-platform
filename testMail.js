const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'sureshkumarmr2004@gmail.com',
        pass: 'zcuu anmm ghsi frgg'
    },
});

async function main() {
    try {
        const info = await transporter.sendMail({
            from: 'sureshkumarmr2004@gmail.com',
            to: 'sureshkumarmr2004@gmail.com',
            subject: 'Test Email Server',
            text: 'Hello world'
        });
        console.log("Message sent: %s", info.messageId);
    } catch (e) {
        console.error(e);
    }
}
main();
