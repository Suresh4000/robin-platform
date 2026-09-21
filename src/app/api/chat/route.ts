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

        // 2. GROQ AI ENGINE
        const groqApiKey = process.env.GROQ_API_KEY;
        if (!groqApiKey) {
            return NextResponse.json({
                reply: "The Groq AI engine has been installed! However, you need to add your `GROQ_API_KEY` to the `.env` file for me to respond intelligently.",
                links: []
            });
        }

        // Format history for Groq API
        const groqMessages = [{
            role: "system",
            content: `You are the automated RobinJones Assistant. You manage inquiries for Robin Jones. 
            
CRITICAL FACTS ABOUT ROBIN TO MEMORIZE:
- Robin has 26+ years of experience driving growth, partnerships, and transformation across business, government, and mission-driven organizations. (Do NOT say 20, say 26+).
- Core Services: 1. Advise (Strategic Growth), 2. Operate (Fractional Executive), 3. Navigate (Executive Advisory).

CRITICAL RULES:
1. You MUST ONLY answer questions related to Robin Jones, his 26+ years of experience, his fractional executive services, strategic advisory, leadership, or business transformation. 
2. If a user asks ANYTHING unrelated to Robin Jones or his business, you MUST politely decline and pivot back to Robin's services.
3. Be highly concise, professional, warm, and helpful. 
4. If a user provides an email, acknowledge it and say the team will follow up.`
        }];

        if (history && history.length > 0) {
            history.forEach((msg: any) => {
                groqMessages.push({
                    role: msg.sender === 'user' ? 'user' : 'assistant',
                    content: msg.text
                });
            });
        }
        groqMessages.push({ role: "user", content: message });

        const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${groqApiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "openai/gpt-oss-120b",
                messages: groqMessages,
                temperature: 0.7,
                max_tokens: 1024,
            })
        });

        if (!groqRes.ok) {
            const errBody = await groqRes.text();
            throw new Error(`Groq API Error: ${errBody}`);
        }

        const groqData = await groqRes.json();
        const aiReply = groqData.choices[0]?.message?.content || "I am currently processing your request.";

        // --- DYNAMIC RELATABLE LINKS SCANNER ---
        // We scan the AI's final natural language response to inject interactive buttons for the user
        let links: { label: string, url: string }[] = [];
        const lowerReply = aiReply.toLowerCase();

        if (lowerReply.includes('experience') || lowerReply.includes('portfolio') || lowerReply.includes('case') || lowerReply.includes('year')) {
            links.push({ label: 'Experience & Impact', url: '/portfolio' });
        }
        if (lowerReply.includes('advise') || lowerReply.includes('operate') || lowerReply.includes('navigate') || lowerReply.includes('service')) {
            links.push({ label: 'View Services', url: '/services' });
        }
        if (lowerReply.includes('about') || lowerReply.includes('background') || lowerReply.includes('bio')) {
            links.push({ label: 'About Robin', url: '/about' });
        }
        if (lowerReply.includes('contact') || lowerReply.includes('book') || lowerReply.includes('schedule') || lowerReply.includes('reach out')) {
            links.push({ label: 'Book a Conversation', url: '/contact' });
        }
        if (lowerReply.includes('blog') || lowerReply.includes('insight') || lowerReply.includes('read') || lowerReply.includes('article')) {
            links.push({ label: 'Insights & Media', url: '/insights' });
        }

        // Limit to maximum 2 buttons so we don't overwhelm the chat interface
        links = links.slice(0, 2);

        return NextResponse.json({ reply: aiReply, links: links });

    } catch (error: any) {
        console.error('Chat API Error:', error);
        return NextResponse.json({ reply: "I am having temporary system difficulties connecting to the Groq AI brain. Please try again later.", links: [] }, { status: 500 });
    }
}
