import { NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';

export async function POST(req: Request) {
    try {
        const { message, history } = await req.json();
        const lowerMsg = message.toLowerCase();

        // 1. EXTRACT EMAIL using regex to inject into CRM
        const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;
        const foundEmails = message.match(emailRegex);

        let crmActionAdded = false;

        if (foundEmails && foundEmails.length > 0) {
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
                crmActionAdded = true;
            }
        }

        // 2. ADVANCED RULE-BASED ENGINE (ZERO-API-KEY REQUIRED)
        let reply = "";

        if (crmActionAdded) {
            reply = "Thank you! I have securely saved your contact details into the CRM. Robin's team will be in touch with you shortly. Is there anything else I can help clarify?";
        }
        else if (lowerMsg.includes('price') || lowerMsg.includes('cost') || lowerMsg.includes('fee')) {
            reply = "Because every organization's needs are unique, Robin's Fractional Executive and Advisory services are custom-quoted. I'd highly recommend booking a discovery conversation so we can understand your specific growth goals! Could I get your email address?";
        }
        else if (lowerMsg.includes('service') || lowerMsg.includes('offer') || lowerMsg.includes('help')) {
            reply = "Robin offers three primary ways to engage: 1. Advise (Strategic Growth & Partnerships). 2. Operate (Fractional Executive Leadership). 3. Navigate (Executive Advisory). Which of these areas are you most interested in?";
        }
        else if (lowerMsg.includes('about') || lowerMsg.includes('who is') || lowerMsg.includes('background')) {
            reply = "Robin Jones is a Fractional Executive and Strategic Growth Advisor with 26+ years of experience driving growth, partnerships, and transformation across business, government, and mission-driven organizations. Would you like to know more about his specific services?";
        }
        else if (lowerMsg.includes('experience') || lowerMsg.includes('impact') || lowerMsg.includes('portfolio') || lowerMsg.includes('work')) {
            reply = "Robin has a rich portfolio of executive leadership, focusing on enterprise value, operational alignment, and strategic partnerships. You can view detailed case studies on the 'Experience & Impact' page, or provide your email here to discuss your organization's specific needs!";
        }
        else if (lowerMsg.includes('advise') || lowerMsg.includes('partnership')) {
            reply = "Our 'Advise' service focuses on strategic growth and building partnership ecosystems that you can actually execute. It's perfect for scaling your market reach. Would you like to schedule a call to discuss this?";
        }
        else if (lowerMsg.includes('operate') || lowerMsg.includes('fractional')) {
            reply = "The 'Operate' service embeds Robin as a Fractional Executive in your team! You gain senior leadership capability without a long-term permanent hire. It's highly effective for growth pushes. Should I flag your email for a follow-up?";
        }
        else if (lowerMsg.includes('navigate') || lowerMsg.includes('advisory')) {
            reply = "For 'Navigate', Robin provides experienced executive advisory perspectives on specific challenges—without a full project engagement. It's essentially having a high-level confidant for your boardroom decisions.";
        }
        else if (lowerMsg.includes('contact') || lowerMsg.includes('book') || lowerMsg.includes('talk') || lowerMsg.includes('schedule') || lowerMsg.includes('meeting')) {
            reply = "I can certainly help you get in touch. Please provide your email address right here in the chat, or you can use the 'Book a Conversation' button at the top of the website!";
        }
        else if (lowerMsg.includes('hello') || lowerMsg.includes('hi ') || lowerMsg.includes('hi!') || lowerMsg.includes('hey')) {
            reply = "Hello there! I am the automated Robin Business Hub Assistant. Whether you're looking for Fractional Leadership or Strategic Growth Advisory, I'm here to help. What brings you here today?";
        }
        else if (lowerMsg.includes('thank')) {
            reply = "You are very welcome! If you need anything else, I'm always here.";
        }
        else if (lowerMsg === 'yes' || lowerMsg.includes(' sure') || lowerMsg.includes('ok') || lowerMsg.includes('yeah') || lowerMsg === 'yep') {
            reply = "Excellent! Please type your best email address right here in the chat, and I will securely send it to Robin's team to set everything up.";
        }
        else {
            reply = "I understand. As an automated assistant, my expertise revolves around Robin's Fractional Executive services, Strategic Growth, and Advisory. Could I get your email address so a real human on the team can reach out and give you a more customized answer?";
        }

        // Add a slight artificial delay to make it feel "human" like it's typing
        await new Promise(resolve => setTimeout(resolve, 1200));

        return NextResponse.json({ reply });

    } catch (error: any) {
        console.error('Chat API Error:', error);
        return NextResponse.json({ reply: "I am having temporary system difficulties. Please try again later." }, { status: 500 });
    }
}
