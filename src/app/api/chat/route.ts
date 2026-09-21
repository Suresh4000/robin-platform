import { NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
    try {
        const { message, history } = await req.json();

        // 1. EXTRACT EMAIL using regex to inject into CRM
        const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;
        const foundEmails = message.match(emailRegex);

        let crmActionAdded = false;

        if (foundEmails && foundEmails.length > 0) {
            const email = foundEmails[0];
            // Check if lead already exists
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

        // 2. CHECK FOR GEMINI API KEY (Dynamically read to avoid server restart issues)
        let geminiKey = process.env.GEMINI_API_KEY;
        if (!geminiKey) {
            try {
                const envContent = fs.readFileSync(path.join(process.cwd(), '.env'), 'utf8');
                const match = envContent.match(/GEMINI_API_KEY=['"]?([^'"\n\r]+)['"]?/m);
                if (match && match[1]) {
                    geminiKey = match[1];
                }
            } catch (fsError) {
                console.error("Could not read .env file dynamically", fsError);
            }
        }

        if (!geminiKey) {
            return NextResponse.json({
                reply: crmActionAdded
                    ? "Thank you! I have saved your contact details. Someone from our team will reach out soon! *(Admin Note: Please add GEMINI_API_KEY to your .env to enable the AI.)*"
                    : "I am ready to help, but the administrator still needs to add their `GEMINI_API_KEY` to the `.env` file! Until then, my AI brain is resting."
            });
        }

        // 3. GENERATE GEMINI RESPONSE (100% FREE TIER)
        const genAI = new GoogleGenerativeAI(geminiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const systemInstruction = `You are the official AI Assistant for Robin Jones (Robin Business Hub). 
Robin is a Fractional Executive and Strategic Growth Advisor with 26+ years of experience helping CEOs, Founders, Boards, and Mission-Driven Organizations build enterprise value. 
Robin's main services include:
1. Advise (Strategic Growth & Partnerships)
2. Operate (Fractional Executive Leadership)
3. Navigate (Executive Advisory)

Your persona: Professional, intelligent, concise, and incredibly helpful. You speak as a representative of Robin.
Goal: Answer questions about Robin's business. If a user seems interested in booking a consultation or working with Robin, politely ask for their email address so Robin's team can reach out.
If the user provides an email address, thank them and tell them their information was securely saved for Robin. Never use markdown formatting in your responses, just plain text.`;

        // Format history for Gemini (Gemini uses 'user' and 'model' roles)
        // Format history for Gemini (Gemini uses 'user' and 'model' roles)
        let formattedHistory = (history || [])
            .filter((msg: any) => msg.role !== 'system')
            .map((msg: any) => ({
                role: msg.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: msg.content }]
            }));

        // Gemini history MUST start with a 'user' role.
        if (formattedHistory.length > 0 && formattedHistory[0].role === 'model') {
            formattedHistory = [
                { role: 'user', parts: [{ text: 'Hello' }] },
                ...formattedHistory
            ];
        }

        // Gemini requires the system prompt to be passed in differently, but we can easily prepend it to the history
        // Wait, for gemini-1.5-flash we can use the `systemInstruction` natively!
        const modelWithSystem = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            systemInstruction: systemInstruction
        });

        const chat = modelWithSystem.startChat({
            history: formattedHistory,
            generationConfig: {
                maxOutputTokens: 300,
                temperature: 0.7,
            }
        });

        const result = await chat.sendMessage(message);
        const reply = result.response.text();

        return NextResponse.json({ reply });

    } catch (error: any) {
        console.error('Chat API Error:', error);
        return NextResponse.json({ reply: "I'm having a little trouble connecting to my neural network right now. Please try again later." }, { status: 500 });
    }
}
