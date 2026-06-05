import { useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";

import { useAuthStore } from "@/auth/store/auth.store";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  metadata: Record<string, unknown>;
  read: boolean;
  createdAt: string;
}

export const useNotifications = () => {
  const token = useAuthStore((state) => state.token);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!token) return;

    const socket = io(`${import.meta.env.VITE_WS_URL}/notifications`, {
      extraHeaders: { authentication: token }
    });

    socket.on('notifications.unread', (data: {notifications: Notification[] }) => {
      setNotifications(data.notifications);
    })

    socket.on('notifications.new', (notification: Notification) => {
      setNotifications(prev => [notification, ...prev]);
    });

    socketRef.current = socket;
  
    return () => {
      socket.disconnect();
    }
  }, [token]);

  const markAsRead = (notificationId: string) => {
    socketRef.current?.emit('notifications.markAsRead', { notificationId });

    setNotifications(prev => prev.map(n => (n.id === notificationId ? {...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    socketRef.current?.emit('notifications.markAllAsRead');
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  return { notifications, markAsRead, markAllAsRead};
}
