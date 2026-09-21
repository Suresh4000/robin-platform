import { NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';

export async function POST(req: Request) {
    try {
        const { message, history } = await req.json();
        const lowerMsg = message.toLowerCase();

        // 1. EXTRACT EMAIL using regex to inject into CRM
        const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;
        const foundEmails = message.match(emailRegex);

        let emailAcknowledged = false;

        if (foundEmails && foundEmails.length > 0) {
            emailAcknowledged = true;
            const email = foundEmails[0];
            const existingLead = await prisma.lead.findFirst({ where: { email } });

            if (!existingLead) {
                await prisma.lead.create({
                    data: {
                        name: 'Chatbot Visitor',
                        email: email,
                        source: 'AI Chatbot',
                        status: 'New Inquiry',
                        notes: `Automatically captured via AI Chatbot.\n\nLatest user message: "${message}"`
                    }
                });
            } else {
                // Update notes if lead exists
                await prisma.lead.update({
                    where: { id: existingLead.id },
                    data: { notes: existingLead.notes + `\n\nFollow-up Chatbot message: "${message}"` }
                });
            }
        }

        // 2. ADVANCED RULE-BASED ENGINE (ZERO-API-KEY REQUIRED)
        let reply = "";
        let links: { label: string, url: string }[] = [];

        if (emailAcknowledged) {
            reply = "Thank you! I have securely saved your email address. Robin's team will be in touch with you shortly. Is there anything else I can help clarify?";
        }
        else if (lowerMsg.includes('price') || lowerMsg.includes('cost') || lowerMsg.includes('fee')) {
            reply = "Because every organization's needs are unique, Robin's Fractional Executive and Advisory services are custom-quoted. I'd highly recommend booking a discovery conversation so we can understand your specific growth goals! Could I get your email address?";
            links.push({ label: 'Book a Conversation', url: '/contact' });
        }
        else if (lowerMsg.includes('service') || lowerMsg.includes('offer') || lowerMsg.includes('help') || lowerMsg.includes('do you do') || lowerMsg.includes('provide')) {
            reply = "Robin offers three primary ways to engage: 1. Advise (Strategic Growth & Partnerships). 2. Operate (Fractional Executive Leadership). 3. Navigate (Executive Advisory). Which of these areas are you most interested in?";
            links.push({ label: 'View All Services', url: '/services' });
        }
        else if (lowerMsg.includes('about') || lowerMsg.includes('who is') || lowerMsg.includes('background') || lowerMsg.includes('profile') || lowerMsg.includes('who are')) {
            reply = "Robin Jones is a Fractional Executive and Strategic Growth Advisor with 26+ years of experience driving growth, partnerships, and transformation across business, government, and mission-driven organizations. Would you like to know more about his specific services?";
            links.push({ label: 'About Robin', url: '/about' });
        }
        else if (lowerMsg.includes('experi') || lowerMsg.includes('impact') || lowerMsg.includes('portfolio') || lowerMsg.includes('work') || lowerMsg.includes('case') || lowerMsg.includes('client') || lowerMsg.includes('result')) {
            reply = "Robin has a rich portfolio of 26+ years of executive leadership, focusing on enterprise value, operational alignment, and strategic partnerships. You can view detailed case studies on the 'Experience & Impact' page, or provide your email here to discuss your organization's specific needs!";
            links.push({ label: 'Experience & Impact', url: '/portfolio' });
        }
        else if (lowerMsg.includes('blog') || lowerMsg.includes('article') || lowerMsg.includes('read') || lowerMsg.includes('insight') || lowerMsg.includes('post')) {
            reply = "Robin regularly shares thoughts on leadership, growth, and transformation. You can head over to our 'Insights & Media' or 'Blog' sections at the top of the page to read the latest articles. Let me know if you want to be added to our mailing list by dropping your email!";
            links.push({ label: 'Read the Blog', url: '/blog' }, { label: 'Insights & Media', url: '/insights' });
        }
        else if (lowerMsg.includes('advise') || lowerMsg.includes('partnership') || lowerMsg.includes('strategic growth')) {
            reply = "Our 'Advise' service focuses on strategic growth and building partnership ecosystems that you can actually execute. It's perfect for scaling your market reach. Would you like to schedule a call to discuss this?";
            links.push({ label: 'Advise Service', url: '/advise' });
        }
        else if (lowerMsg.includes('operate') || lowerMsg.includes('fractional') || lowerMsg.includes('executive')) {
            reply = "The 'Operate' service embeds Robin as a Fractional Executive in your team! You gain senior leadership capability without a long-term permanent hire. It's highly effective for growth pushes. Should I flag your email for a follow-up?";
            links.push({ label: 'Operate Service', url: '/operate' });
        }
        else if (lowerMsg.includes('navigate') || lowerMsg.includes('advisory') || lowerMsg.includes('advice') || lowerMsg.includes('confidant')) {
            reply = "For 'Navigate', Robin provides experienced executive advisory perspectives on specific challenges—without a full project engagement. It's essentially having a high-level confidant for your boardroom decisions.";
            links.push({ label: 'Navigate Service', url: '/navigate' });
        }
        else if (lowerMsg.includes('contact') || lowerMsg.includes('book') || lowerMsg.includes('talk') || lowerMsg.includes('schedule') || lowerMsg.includes('meeting') || lowerMsg.includes('reach out') || lowerMsg.includes('connect') || lowerMsg.includes('speak') || lowerMsg.includes('get in touch')) {
            reply = "I can certainly help you get in touch. Please provide your email address right here in the chat, or you can use the 'Book a Conversation' button at the top of the website!";
            links.push({ label: 'Contact Page', url: '/contact' });
        }
        else if (/\b(hello|hi|hey|greetings)\b/i.test(lowerMsg)) {
            reply = "Hello there! I am the automated RobinJones Assistant. Whether you're looking for Fractional Leadership or Strategic Growth Advisory, I'm here to help. What brings you here today?";
        }
        else if (lowerMsg.includes('thank')) {
            reply = "You are very welcome! If you need anything else, I'm always here.";
        }
        else if (/\b(yes|sure|ok|okay|yeah|yep|please)\b/i.test(lowerMsg)) {
            reply = "Excellent! Please type your best email address right here in the chat, and I will securely send it to Robin's team to set everything up.";
        }
        else {
            reply = "I understand. As an automated assistant, my primary expertise revolves around Robin's Fractional Executive services, Strategic Growth, and Advisory. Could I get your email address so a real human on the team can review this and reach out to you?";
        }

        // Add a slight artificial delay to make it feel "human" like it's typing
        await new Promise(resolve => setTimeout(resolve, 1200));

        return NextResponse.json({ reply, links });

    } catch (error: any) {
        console.error('Chat API Error:', error);
        return NextResponse.json({ reply: "I am having temporary system difficulties. Please try again later.", links: [] }, { status: 500 });
    }
}
