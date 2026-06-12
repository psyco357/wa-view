"use client";

import { createContext, useContext, useState, ReactNode } from "react";

// Tipe data kontak
export interface Contact {
    id: string;
    name: string;
    lastMessage: string;
    time: string;
    unread: number;
    avatar: string;
    online: boolean;
}

// Tipe data pesan
export interface Message {
    id: string;
    text: string;
    sender: "me" | "other";
    timestamp: string;
}

interface ChatContextType {
    selectedChatId: string | null;
    setSelectedChatId: (id: string | null) => void;
    contacts: Contact[];
    messages: Record<string, Message[]>; // pesan per chat ID
    addMessage: (chatId: string, message: Message) => void;
    markAsRead: (chatId: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Data dummy - pindahkan ke file terpisah jika sudah pakai database
const initialContacts: Contact[] = [
    { id: "1", name: "Budi Santoso", lastMessage: "Halo, bagaimana kabarmu hari ini?", time: "10:30", unread: 2, avatar: "B", online: true },
    { id: "2", name: "Siti Aminah", lastMessage: "File sudah saya kirim ya.", time: "09:15", unread: 0, avatar: "S", online: true },
    { id: "3", name: "Tim Project Alpha", lastMessage: "Meeting jam 3 siang jangan lupa.", time: "Kemarin", unread: 5, avatar: "T", online: false },
    { id: "4", name: "Andi Wijaya", lastMessage: "Terima kasih banyak!", time: "Kemarin", unread: 0, avatar: "A", online: false },
];

const initialMessages: Record<string, Message[]> = {
    "1": [
        { id: "m1", text: "Halo, bagaimana kabarmu hari ini?", sender: "other", timestamp: "10:28" },
        { id: "m2", text: "Baik, alhamdulillah. Kamu gimana?", sender: "me", timestamp: "10:29" },
        { id: "m3", text: "Halo, bagaimana kabarmu hari ini?", sender: "other", timestamp: "10:30" },
    ],
    "2": [
        { id: "m4", text: "File sudah saya kirim ya.", sender: "other", timestamp: "09:15" },
    ],
    "3": [
        { id: "m5", text: "Meeting jam 3 siang jangan lupa.", sender: "other", timestamp: "Kemarin" },
    ],
    "4": [
        { id: "m6", text: "Terima kasih banyak!", sender: "other", timestamp: "Kemarin" },
    ],
};

export function ChatProvider({ children }: { children: ReactNode }) {
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
    const [contacts, setContacts] = useState<Contact[]>(initialContacts);
    const [messages, setMessages] = useState<Record<string, Message[]>>(initialMessages);

    // Tambah pesan baru ke chat tertentu
    const addMessage = (chatId: string, message: Message) => {
        setMessages((prev) => ({
            ...prev,
            [chatId]: [...(prev[chatId] || []), message],
        }));

        // Update lastMessage di kontak
        setContacts((prev) =>
            prev.map((c) =>
                c.id === chatId
                    ? { ...c, lastMessage: message.text, time: message.timestamp }
                    : c
            )
        );
    };

    // Tandai chat sebagai sudah dibaca
    const markAsRead = (chatId: string) => {
        setContacts((prev) =>
            prev.map((c) => (c.id === chatId ? { ...c, unread: 0 } : c))
        );
    };

    return (
        <ChatContext.Provider
            value={{
                selectedChatId,
                setSelectedChatId,
                contacts,
                messages,
                addMessage,
                markAsRead,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
}

export function useChat() {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error("useChat must be used within a ChatProvider");
    }
    return context;
}