// context/ChatContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import {chatService} from '@/libs/services/chat.service';
import { Contact } from '@/libs/types/chat.types';

interface ChatContextType {
    contacts: Contact[];
    selectedContact: Contact | null;
    setSelectedContact: (contact: Contact | null) => void;
    markAsRead: (contactId: number) => Promise<void>;
    sendMessage: (contactId: number, message: string) => Promise<void>;
    loading: boolean;
    refreshContacts: () => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);


export function ChatProvider({ children }: { children: React.ReactNode }) {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const [loading, setLoading] = useState(true);

    const loadContacts = async () => {
        try {
            setLoading(true);
            const data = await chatService.getContacts();
            setContacts(data);
        } catch (error) {
            console.error('Error loading contacts:', error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (contactId: number) => {
        try {
            // Since markAsRead is removed from chatService, we directly update local state
            setContacts(prev => prev.map(contact =>
                contact.id === contactId ? { ...contact, unread: 0 } : contact
            ));
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const sendMessage = async (contactId: number, message: string) => {
        try {
            const result = await chatService.sendMessage(contactId, message);
            // Refresh contacts to get updated last message
            await loadContacts();
            return result;
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    };

    useEffect(() => {
        loadContacts();
        
        // Setup polling atau WebSocket untuk update real-time
        const interval = setInterval(loadContacts, 30000); // Refresh every 30 seconds
        
        return () => clearInterval(interval);
    }, []);

    return (
        <ChatContext.Provider value={{
            contacts,
            selectedContact,
            setSelectedContact,
            markAsRead,
            sendMessage,
            loading,
            refreshContacts: loadContacts
        }}>
            {children}
        </ChatContext.Provider>
    );
}

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChat must be used within ChatProvider');
    }
    return context;
};