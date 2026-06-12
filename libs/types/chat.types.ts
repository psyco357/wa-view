// types/chat.types.ts
export interface Contact {
    id: number;
    name: string;
    avatar: string;
    lastMessage: string;
    time: string;
    unread: number;
    online: boolean;
    phoneNumber: string;
    gatewayId: string;
    lastMessageAt: string;
    latestMessageStatus?: 'submitted' | 'delivered' | 'read' | 'failed';
}

export interface LatestMessage {
    id: number;
    whatsapp_data_id: number;
    direction: 'incoming' | 'outgoing';
    type: string;
    body: string;
    media_url: string | null;
    filename: string | null;
    status: 'submitted' | 'delivered' | 'read' | 'failed';
    message_time: string;
}

export interface ChatData {
    id: number;
    kendaraan_id: number | null;
    nomor_wa: string;
    gateway_id: string;
    last_message_at: string;
    kendaraan: any | null;
    latest_message: LatestMessage | null;
}

export interface ApiResponse {
    success: boolean;
    data: ChatData[];
}
