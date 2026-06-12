import { Contact,ApiResponse,ChatData } from '../types/chat.types';
import { BaseService } from './base.service';

class ChatService extends BaseService {
    constructor() {
        super("/v1");
    }

    // Mengambil dan mentransformasi data inbox ke format Contact
    async getContacts(): Promise<Contact[]> {
        const response = await this.request('/inbox', {
            method: 'GET',
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch inbox messages');
        }
        
        const result: ApiResponse = await response.json();
        
        // Transform API response ke format Contact yang diharapkan frontend
        return result.data.map(chat => this.transformToContact(chat));
    }

    // Transform single chat data ke Contact
    private transformToContact(chat: ChatData): Contact {
        // Generate nama dari nomor WhatsApp jika tidak ada nama kendaraan
        const name = chat.kendaraan?.name || this.formatPhoneNumber(chat.nomor_wa);
        
        // Ambil avatar (inisial dari nama)
        const avatar = this.getInitials(name);
        
        // Ambil last message
        const lastMessage = chat.latest_message?.body || 'Tidak ada pesan';
        
        // Format waktu
        const time = this.formatTimestamp(chat.last_message_at);
        
        // Hitung unread (disesuaikan dengan response API)
        // Catatan: API mungkin perlu memberikan data unread count terpisah
        const unread = this.calculateUnread(chat);
        
        // Status online (perlu endpoint terpisah atau default false)
        const online = false; // Bisa diambil dari WebSocket atau endpoint terpisah
        
        return {
            id: chat.id,
            name: name,
            avatar: avatar,
            lastMessage: lastMessage,
            time: time,
            unread: unread,
            online: online,
            phoneNumber: chat.nomor_wa,
            gatewayId: chat.gateway_id,
            lastMessageAt: chat.last_message_at,
            latestMessageStatus: chat.latest_message?.status
        };
    }

    // Mendapatkan inisial untuk avatar
    private getInitials(name: string): string {
        if (!name) return '?';
        
        const words = name.trim().split(' ');
        if (words.length === 1) {
            return words[0].charAt(0).toUpperCase();
        }
        
        return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
    }

    // Format nomor telepon untuk display
    private formatPhoneNumber(phoneNumber: string): string {
        // Contoh: 6282242305316 -> 0822-4230-5316
        let formatted = phoneNumber;
        
        // Ganti 62 dengan 0
        if (formatted.startsWith('62')) {
            formatted = '0' + formatted.slice(2);
        }
        
        // Format dengan strip setiap 4 digit
        return formatted.replace(/(\d{4})(?=\d)/g, '$1-');
    }

    // Format timestamp ke format waktu yang diharapkan (seperti "10:30" atau "Yesterday")
    private formatTimestamp(timestamp: string): string {
        const date = new Date(timestamp);
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        // Jika hari ini
        if (date >= today) {
            return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        }
        
        // Jika kemarin
        if (date >= yesterday && date < today) {
            return 'Yesterday';
        }
        
        // Jika masih dalam minggu ini
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        if (date >= weekAgo) {
            return date.toLocaleDateString('id-ID', { weekday: 'long' });
        }
        
        // Format tanggal
        return date.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: '2-digit' });
    }

    // Menghitung jumlah pesan unread
    // Catatan: Ini perlu disesuaikan dengan struktur API yang sebenarnya
    private calculateUnread(chat: ChatData): number {
        // Jika API menyediakan field unread, gunakan itu
        // @ts-ignore - jika API punya field unread
        if (chat.unread_count !== undefined) {
            // @ts-ignore
            return chat.unread_count;
        }
        
        // Sementara, jika pesan terakhir adalah incoming dan belum dibaca
        if (chat.latest_message?.direction === 'incoming' && 
            chat.latest_message?.status !== 'read') {
            return 1;
        }
        
        return 0;
    }

    // Mendapatkan detail chat dengan messages
    async getChatMessages(chatId: number): Promise<any[]> {
        const response = await this.request(`/chat/${chatId}`, {
            method: 'GET',
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch chat messages');
        }
        
        const result = await response.json();
        return result.data?.messages || [];
    }


    // Send message
    async sendMessage(chatId: number, message: string): Promise<any> {
       console.log('Sending message to chatId:', chatId, 'Message:', message);
        const response = await this.request('/reply', {
            method: 'POST',
            body: JSON.stringify({
                whatsapp_data_id: chatId,
                message: message,
                type: 'text'
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to send message');
        }
        
        const result = await response.json();
        return result.data;
    }

    // Update online status (bisa menggunakan WebSocket atau polling)
    async updateOnlineStatus(contactId: number, isOnline: boolean): Promise<void> {
        // Implementasi tergantung backend
        // Bisa menggunakan WebSocket atau API endpoint khusus
        console.log(`Contact ${contactId} online status: ${isOnline}`);
    }
}

export const chatService = new ChatService();