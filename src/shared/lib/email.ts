import nodemailer from 'nodemailer';

export const sendNotificationEmail = async (subject: string, htmlContent: string) => {
    try {
        // By default we need some SMTP settings
        // If they are not provided, we will just log it for debugging
        if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
            console.warn('⚠️ SMTP credentials are not set. Logging email content instead:');
            console.warn(`Subject: ${subject}`);
            console.warn(`Content: ${htmlContent}`);
            return false;
        }

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT) || 587,
            secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const info = await transporter.sendMail({
            from: `"${process.env.SMTP_FROM_NAME || 'Robin Platform'}" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
            to: 'wordpress@svaan.in', // User requested to receive emails here
            subject: subject,
            html: htmlContent,
        });

        console.log("Message sent: %s", info.messageId);
        return true;
    } catch (error) {
        console.error("Error sending email: ", error);
        return false;
    }
};
