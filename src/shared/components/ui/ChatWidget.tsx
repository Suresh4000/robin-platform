'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Volume2, VolumeX, Loader2, Minimize2 } from 'lucide-react';

type Message = {
    id: string;
    role: 'user' | 'assistant';
    content: string;
};

export function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', role: 'assistant', content: 'Hello! I am the Robin Business Hub AI Assistant. How can I help you today?' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    // Handle initial mount setup
    useEffect(() => {
        // Voice stop on unmount
        return () => stopSpeaking();
    }, []);

    const stopSpeaking = () => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        }
    };

    const speakMessage = (text: string) => {
        if (!('speechSynthesis' in window)) {
            alert('Text-to-Speech is not supported in your browser.');
            return;
        }

        stopSpeaking(); // Stop current speech

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;

        // Try to find a good English voice
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v => v.lang.includes('en-GB') || v.lang.includes('en-US') && v.name.includes('Female'));
        if (preferredVoice) utterance.voice = preferredVoice;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input.trim() };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        try {
            // Replace with real LLM endpoint when Step 2 is implemented
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMsg.content, history: messages })
            });

            let assistantMsg = '';

            try {
                const data = await response.json();
                assistantMsg = data.reply || "I'm sorry, I couldn't process that response.";
            } catch (e) {
                assistantMsg = "I'm having trouble reaching the server right now. Please make sure the backend is fully restarted.";
            }

            setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: assistantMsg }]);
        } catch (error) {
            setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: "An error occurred connecting to the AI system." }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end'
        }}>
            {/* Chat Window */}
            {isOpen && (
                <div style={{
                    width: '380px',
                    height: '550px',
                    maxHeight: '80vh',
                    backgroundColor: '#fff',
                    borderRadius: '16px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    marginBottom: '16px',
                    border: '1px solid #e2e8f0',
                    animation: 'slideUp 0.3s ease-out forwards'
                }}>
                    <style dangerouslySetInnerHTML={{
                        __html: `
                        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                        .chat-scroll::-webkit-scrollbar { width: 6px; }
                        .chat-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
                        .msg-content p { margin: 0 0 8px 0; line-height: 1.5; }
                        .msg-content p:last-child { margin: 0; }
                    `}} />

                    {/* Header */}
                    <div style={{
                        background: 'linear-gradient(135deg, #153835 0%, #1e4d49 100%)', // Deep Forest Theme
                        color: '#fff',
                        padding: '16px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%', boxShadow: '0 0 8px #10b981' }}></div>
                                AI Assistant
                            </h3>
                            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#a7f3d0' }}>Lead Gen & Consultant</p>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            {isSpeaking && (
                                <button onClick={stopSpeaking} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', cursor: 'pointer', padding: '6px', borderRadius: '50%' }}>
                                    <VolumeX size={16} />
                                </button>
                            )}
                            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '6px', opacity: 0.8 }}>
                                <Minimize2 size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className="chat-scroll" style={{
                        flex: 1,
                        padding: '16px',
                        overflowY: 'auto',
                        background: '#f8fafc',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px'
                    }}>
                        {messages.map((msg) => (
                            <div key={msg.id} style={{
                                display: 'flex',
                                flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                                alignItems: 'flex-end',
                                gap: '8px'
                            }}>
                                {msg.role === 'assistant' && (
                                    <div style={{ width: '28px', height: '28px', background: '#153835', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                                        <MessageSquare size={14} />
                                    </div>
                                )}
                                <div style={{
                                    maxWidth: '75%',
                                    position: 'relative',
                                }}>
                                    <div className="msg-content" style={{
                                        background: msg.role === 'user' ? '#153835' : '#fff',
                                        color: msg.role === 'user' ? '#fff' : '#1e293b',
                                        padding: '12px 16px',
                                        borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                                        border: msg.role === 'assistant' ? '1px solid #e2e8f0' : 'none',
                                        fontSize: '14px',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                                    }}>
                                        {msg.content}
                                    </div>

                                    {/* Text to Speech Button for Assistant Messages */}
                                    {msg.role === 'assistant' && (
                                        <button
                                            onClick={() => speakMessage(msg.content)}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                color: '#94a3b8',
                                                cursor: 'pointer',
                                                padding: '4px',
                                                marginTop: '4px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                                fontSize: '11px',
                                            }}
                                        >
                                            <Volume2 size={12} /> Read Aloud
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ width: '28px', height: '28px', background: '#153835', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                                    <Loader2 size={14} className="spin" />
                                    <style>{`.spin { animation: spin 1s linear infinite; }`}</style>
                                </div>
                                <div style={{ background: '#fff', padding: '12px 16px', borderRadius: '16px 16px 16px 4px', border: '1px solid #e2e8f0', color: '#94a3b8', fontSize: '13px' }}>
                                    Robin AI is typing...
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div style={{
                        padding: '16px',
                        background: '#fff',
                        borderTop: '1px solid #e2e8f0',
                        display: 'flex',
                        gap: '12px'
                    }}>
                        <input
                            style={{
                                flex: 1,
                                padding: '12px 16px',
                                borderRadius: '24px',
                                border: '1px solid #cbd5e1',
                                outline: 'none',
                                fontSize: '14px',
                                background: '#f8fafc'
                            }}
                            placeholder="Type your message..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            disabled={isTyping}
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || isTyping}
                            style={{
                                width: '44px',
                                height: '44px',
                                borderRadius: '50%',
                                background: input.trim() ? '#153835' : '#e2e8f0',
                                color: '#fff',
                                border: 'none',
                                cursor: input.trim() ? 'pointer' : 'not-allowed',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'background 0.2s'
                            }}
                        >
                            <Send size={18} style={{ marginLeft: '2px' }} />
                        </button>
                    </div>
                </div>
            )}

            {/* Floating FAB */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #153835 0%, #1e4d49 100%)',
                        color: '#fff',
                        border: 'none',
                        cursor: 'pointer',
                        boxShadow: '0 8px 24px rgba(21, 56, 53, 0.4)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'transform 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                    <MessageSquare size={28} />
                </button>
            )}
        </div>
    );
}
