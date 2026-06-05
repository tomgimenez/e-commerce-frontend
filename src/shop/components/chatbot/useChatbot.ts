import { useAuthStore } from "@/auth/store/auth.store";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client"

interface Message {
  role: 'user' | 'bot';
  content: string;
}

const INITIAL_MESSAGE: Message = {
  role: 'bot',
  content: 'Welcome to The LoreVault Market! How can I help you find your next magical adventure?'
}

export const useChatbot = () => {
  const token = useAuthStore((state) => state.token);

  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {

    const socket = io(`${import.meta.env.VITE_WS_URL}/chatbot`, {
      extraHeaders: token ? { authentication: token } : {}
    });

    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));

    socket.on('chatbot.response', (data: { response: string}) => {
      setMessages((prev) => [...prev, { role: 'bot', content: data.response}]);
      setIsLoading(false);
    });

    socketRef.current = socket;
  
    return () => {
      socket.disconnect();
    }
  }, [token]);

  const sendMessage = (content: string) => {
    if (!content.trim() || !socketRef.current) return;

    setMessages((prev) => [...prev, { role: 'user', content }]);
    setIsLoading(true);

    socketRef.current.emit('chatbot.message', { message: content });
  }

  return { messages, isConnected, isLoading, sendMessage };
}