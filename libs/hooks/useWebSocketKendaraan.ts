// hooks/useWebSocketKendaraan.ts
import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Kendaraan } from '../types/kendaraan.type';

export interface WebSocketEvent {
    type: 'created' | 'updated' | 'deleted' | 'status_changed';
    data: Kendaraan;
    timestamp: string;
}

interface UseWebSocketKendaraanOptions {
    enabled?: boolean;
    autoReconnect?: boolean;
    onConnect?: () => void;
    onDisconnect?: () => void;
    onMessage?: (event: WebSocketEvent) => void;
}

export function useWebSocketKendaraan(options: UseWebSocketKendaraanOptions = {}) {
    const {
        enabled = true,
        autoReconnect = true,
        onConnect,
        onDisconnect,
        onMessage,
    } = options;

    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [lastMessage, setLastMessage] = useState<WebSocketEvent | null>(null);
    const [connectionError, setConnectionError] = useState<string | null>(null);
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL;

    const onConnectRef = useRef(onConnect);
    const onDisconnectRef = useRef(onDisconnect);
    const onMessageRef = useRef(onMessage);

    useEffect(() => {
        onConnectRef.current = onConnect;
        onDisconnectRef.current = onDisconnect;
        onMessageRef.current = onMessage;
    }, [onConnect, onDisconnect, onMessage]);

    useEffect(() => {
        if (!enabled) {
            return;
        }

        if (!wsUrl) {
            setConnectionError('NEXT_PUBLIC_WS_URL is not set');
            setIsConnected(false);
            return;
        }

        // Koneksi ke WebSocket server
        const socketInstance = io(wsUrl, {
            path: '/socket.io',
            transports: ['websocket', 'polling'],
            reconnection: autoReconnect,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            timeout: 10000,
        });

        socketInstance.on('connect', () => {
            console.log('WebSocket connected');
            setIsConnected(true);
            setConnectionError(null);
            onConnectRef.current?.();
        });

        socketInstance.on('disconnect', () => {
            console.log('WebSocket disconnected');
            setIsConnected(false);
            onDisconnectRef.current?.();
        });

        socketInstance.on('connect_error', (error: Error) => {
            console.error('WebSocket connection error:', error.message);
            setConnectionError(error.message);
        });

        // Listen untuk event kendaraan
        socketInstance.on('kendaraan:created', (data: WebSocketEvent) => {
            console.log('Kendaraan baru:', data);
            setLastMessage(data);
            onMessageRef.current?.(data);
        });

        socketInstance.on('kendaraan:updated', (data: WebSocketEvent) => {
            console.log('Kendaraan diupdate:', data);
            setLastMessage(data);
            onMessageRef.current?.(data);
        });

        socketInstance.on('kendaraan:deleted', (data: WebSocketEvent) => {
            console.log('Kendaraan dihapus:', data);
            setLastMessage(data);
            onMessageRef.current?.(data);
        });

        socketInstance.on('kendaraan:status_changed', (data: WebSocketEvent) => {
            console.log('Status berubah:', data);
            setLastMessage(data);
            onMessageRef.current?.(data);
        });

        setSocket(socketInstance);

        return () => {
            socketInstance.disconnect();
            setSocket(null);
            setIsConnected(false);
        };
    }, [enabled, autoReconnect, wsUrl]);

    return { socket, isConnected, lastMessage, connectionError };
}