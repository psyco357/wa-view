"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { useChat } from "../context/ChatContext";
import { chatService } from "@/libs/services/chat.service";

interface ChatMessage {
    id: string;
    text: string;
    sender: "me" | "other";
    timestamp: string;
}

const normalizeMessage = (item: any, fallbackId: number): ChatMessage => ({
    id: String(item?.id ?? fallbackId),
    text: item?.body ?? item?.text ?? item?.message ?? "",
    sender: item?.direction === "incoming" ? "other" : "me",
    timestamp: item?.message_time
        ? new Date(item.message_time).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
        : item?.timestamp ?? new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
});

export default function ChatWindow() {
    const { selectedContact, sendMessage } = useChat();
    const [inputText, setInputText] = useState("");
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const loadMessages = async () => {
            if (!selectedContact) {
                setMessages([]);
                return;
            }

            try {
                setLoadingMessages(true);
                const result = await chatService.getChatMessages(selectedContact.id);
                const normalizedMessages: ChatMessage[] = (result || []).map((item: any, index: number) =>
                    normalizeMessage(item, index)
                );
                setMessages(normalizedMessages);
            } catch (error) {
                console.error("Error loading chat messages:", error);
                setMessages([]);
            } finally {
                setLoadingMessages(false);
            }
        };

        void loadMessages();
    }, [selectedContact]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, selectedContact]);

    // Empty state
    if (!selectedContact) {
        return (
            <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-950 h-full rounded-xl">
                <div className="text-center p-8">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                        Selamat Datang di Chat
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                        Pilih percakapan dari sidebar untuk memulai
                    </p>
                </div>
            </div>
        );
    }

    const handleSendMessage = (e: FormEvent) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        void sendMessage(selectedContact.id, inputText)
            .then((sentMessage) => {
                setMessages((prev) => [
                    ...prev,
                    normalizeMessage(sentMessage, Date.now()),
                ]);
                setInputText("");
            })
            .catch((error) => {
                console.error("Error sending message:", error);
            });
    };

    return (
        // ⭐ PENTING: Container harus flex column + height jelas
        <div className="flex flex-col h-full bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">

            {/* HEADER - tidak ikut scroll */}
            <header className="flex-shrink-0 flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                <div className="relative flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                        {selectedContact.avatar}
                    </div>
                    {selectedContact.online && (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full" />
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <h2 className="font-semibold text-gray-800 dark:text-white truncate">
                        {selectedContact.name}
                    </h2>
                    <p className={`text-xs flex items-center gap-1 ${selectedContact.online ? "text-green-600 dark:text-green-400" : "text-gray-500"}`}>
                        {selectedContact.online ? (
                            <>
                                <span className="w-2 h-2 bg-green-500 rounded-full" />
                                Online
                            </>
                        ) : (
                            "Offline"
                        )}
                    </p>
                </div>

                <div className="flex items-center gap-1">
                    <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                    </button>
                    <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                    </button>
                </div>
            </header>

            {/* ⭐ AREA PESAN - INI YANG DI-SCROLL */}
            <main className="flex-1 overflow-y-auto min-h-0 p-4 space-y-3 bg-gray-50 dark:bg-gray-950">
                {loadingMessages ? (
                    <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                        Memuat pesan...
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                        Belum ada pesan. Mulai percakapan!
                    </div>
                ) : (
                    messages.map((msg: ChatMessage) => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`max-w-[75%] px-4 py-2 shadow-sm ${msg.sender === "me"
                                        ? "bg-blue-600 text-white rounded-2xl rounded-br-sm"
                                        : "bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-2xl rounded-bl-sm border border-gray-200 dark:border-gray-700"
                                    }`}
                            >
                                <p className="text-sm leading-relaxed">{msg.text}</p>
                                <span className={`text-[10px] mt-1 block text-right ${msg.sender === "me" ? "text-blue-100" : "text-gray-500 dark:text-gray-400"}`}>
                                    {msg.timestamp}
                                </span>
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </main>

            {/* FOOTER - tidak ikut scroll */}
            <footer className="flex-shrink-0 p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                    <button type="button" className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full flex-shrink-0">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                    </button>
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Ketik pesan..."
                        className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 border-none rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm dark:text-white"
                    />
                    <button
                        type="submit"
                        disabled={!inputText.trim()}
                        className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    </button>
                </form>
            </footer>
        </div>
    );
}