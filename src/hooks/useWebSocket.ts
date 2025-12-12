import { useEffect, useRef, useCallback, useState } from 'react';
import { useAppStore } from '@/stores/appStore';
import { Message } from '@/types';
import { toast } from 'sonner';

interface WebSocketMessage {
  type: 'message' | 'status' | 'typing' | 'presence' | 'campaign_update';
  data: any;
}

// WebSocket URL - change this to your actual WebSocket server
const WS_URL = import.meta.env.VITE_WS_URL || 'wss://your-backend-url.com/ws';

export function useWebSocket() {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { addMessage, contacts } = useAppStore();

  const connect = useCallback(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) return;

    try {
      // For demo purposes, we'll simulate WebSocket behavior
      // In production, replace with actual WebSocket connection
      console.log('Simulating WebSocket connection...');
      setIsConnected(true);
      
      // Mock WebSocket for demo
      // wsRef.current = new WebSocket(`${WS_URL}?token=${token}`);
      
      // Simulate connection established
      toast.success('Real-time updates connected');

    } catch (error) {
      console.error('WebSocket connection error:', error);
      scheduleReconnect();
    }
  }, []);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    setIsConnected(false);
  }, []);

  const scheduleReconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    reconnectTimeoutRef.current = setTimeout(() => {
      console.log('Attempting to reconnect WebSocket...');
      connect();
    }, 5000);
  }, [connect]);

  const sendMessage = useCallback((message: WebSocketMessage) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket not connected, message not sent');
    }
  }, []);

  // Simulate incoming messages for demo
  const simulateIncomingMessage = useCallback((contactId: string, content: string) => {
    const newMessage: Message = {
      id: `m${Date.now()}`,
      contactId,
      content,
      type: 'text',
      direction: 'in',
      status: 'read',
      timestamp: new Date(),
    };
    addMessage(newMessage);
    
    // Show notification
    const contact = contacts.find(c => c.id === contactId);
    if (contact) {
      toast.info(`New message from ${contact.name}`, {
        description: content.substring(0, 50) + (content.length > 50 ? '...' : ''),
      });
    }
  }, [addMessage, contacts]);

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  return {
    isConnected,
    sendMessage,
    connect,
    disconnect,
    simulateIncomingMessage,
  };
}

// Hook for real-time message status updates
export function useMessageStatus() {
  const updateMessageStatus = useCallback((messageId: string, status: 'sent' | 'delivered' | 'read') => {
    // In production, this would update the message status in the store
    console.log(`Message ${messageId} status updated to ${status}`);
  }, []);

  return { updateMessageStatus };
}

// Hook for typing indicators
export function useTypingIndicator() {
  const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({});

  const setTyping = useCallback((contactId: string, isTyping: boolean) => {
    setTypingUsers(prev => ({
      ...prev,
      [contactId]: isTyping,
    }));

    // Auto-clear typing after 3 seconds
    if (isTyping) {
      setTimeout(() => {
        setTypingUsers(prev => ({
          ...prev,
          [contactId]: false,
        }));
      }, 3000);
    }
  }, []);

  return { typingUsers, setTyping };
}
