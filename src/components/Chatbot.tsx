'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

function formatMessage(content: string): React.ReactNode {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const boldRegex = /\*\*([^*]+)\*\*/g;

    let processed = content;
    const boldMatches: string[] = [];
    processed = processed.replace(boldRegex, (match, text) => {
        const marker = `__BOLD_${boldMatches.length}__`;
        boldMatches.push(text);
        return marker;
    });

    const parts = processed.split(urlRegex);

    return parts.map((part, index) => {
        if (part.match(urlRegex)) {
            return (
                <a
                    key={index}
                    href={part}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline break-all"
                >
                    {part}
                </a>
            );
        }

        if (part.includes('__BOLD_')) {
            const boldParts = part.split(/(__BOLD_\d+__)/g);
            return (
                <span key={index}>
                    {boldParts.map((boldPart, boldIndex) => {
                        const boldMatch = boldPart.match(/__BOLD_(\d+)__/);
                        if (boldMatch) {
                            const boldText = boldMatches[parseInt(boldMatch[1])];
                            return <strong key={boldIndex}>{boldText}</strong>;
                        }
                        return <span key={boldIndex}>{boldPart}</span>;
                    })}
                </span>
            );
        }

        return <span key={index}>{part}</span>;
    });
}

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const sendMessage = async () => {
        if (!inputMessage.trim() || isLoading) return;

        const userMessage = inputMessage.trim();
        setInputMessage('');

        const newUserMessage: Message = {
            role: 'user',
            content: userMessage,
        };
        setMessages((prev) => [...prev, newUserMessage]);
        setIsLoading(true);

        try {
            const response = await fetch('/api/chatbot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: userMessage,
                    conversationHistory: messages,
                }),
            });

            if (!response.ok) {
                throw new Error('Error al obtener respuesta del chatbot');
            }

            const data = await response.json();

            const assistantMessage: Message = {
                role: 'assistant',
                content: data.message,
            };
            setMessages((prev) => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Error enviando mensaje:', error);
            const errorMessage: Message = {
                role: 'assistant',
                content: 'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta nuevamente.',
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-color-primary hover:bg-color-primary-hover text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
                aria-label="Abrir chatbot"
            >
                {isOpen ? (
                    <X className="w-6 h-6" />
                ) : (
                    <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
                )}
            </button>

            {isOpen && (
                <div className="fixed bottom-24 right-6 z-50 w-96 h-[600px] bg-background-card rounded-lg shadow-2xl flex flex-col border border-gray-200">
                    <div className="bg-color-primary text-white p-4 rounded-t-lg flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <MessageCircle className="w-5 h-5" />
                            <h3 className="font-semibold text-lg">Asistente Virtual</h3>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="hover:bg-white/20 rounded-full p-1 transition-colors"
                            aria-label="Cerrar chatbot"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background">
                        {messages.length === 0 ? (
                            <div className="text-center text-color-secondary mt-8">
                                <MessageCircle className="w-12 h-12 mx-auto mb-3 text-color-primary opacity-50" />
                                <p className="text-sm">
                                    ¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?
                                </p>
                            </div>
                        ) : (
                            messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'
                                        }`}
                                >
                                    <div
                                        className={`max-w-[80%] rounded-lg px-4 py-2 ${message.role === 'user'
                                            ? 'bg-color-primary text-white'
                                            : 'bg-white text-color-secondary border border-gray-200'
                                            }`}
                                    >
                                        <p className="text-sm whitespace-pre-wrap">
                                            {message.role === 'assistant' ? formatMessage(message.content) : message.content}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white border border-gray-200 rounded-lg px-4 py-2">
                                    <Loader2 className="w-5 h-5 animate-spin text-color-primary" />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
                        <div className="flex gap-2">
                            <input
                                ref={inputRef}
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Escribe tu mensaje..."
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-color-primary focus:border-transparent text-color-secondary"
                                disabled={isLoading}
                            />
                            <button
                                onClick={sendMessage}
                                disabled={!inputMessage.trim() || isLoading}
                                className="bg-color-primary hover:bg-color-primary-hover text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                                aria-label="Enviar mensaje"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <Send className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

