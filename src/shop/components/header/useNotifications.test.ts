import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useNotifications, type Notification } from './useNotifications';
import { useAuthStore } from '@/auth/store/auth.store';
import { io } from 'socket.io-client';

vi.mock('socket.io-client');
vi.mock('@/auth/store/auth.store');

// ── Setup ──────────────────────────────────────────────────────────────────

const mockNotification: Notification = {
  id: 'notif-1',
  title: 'Order Confirmed',
  message: 'Your order has been confirmed',
  type: 'order',
  metadata: { orderId: 'order-123' },
  read: false,
  createdAt: '2026-06-17T10:00:00Z',
};

const mockNotification2: Notification = {
  id: 'notif-2',
  title: 'Payment Received',
  message: 'Payment has been received',
  type: 'payment',
  metadata: { paymentId: 'pay-456' },
  read: false,
  createdAt: '2026-06-17T11:00:00Z',
};

const mockToken = 'mock-jwt-token';

let mockSocket: any;
let mockEmit: any;
let mockDisconnect: any;

beforeEach(() => {
  mockEmit = vi.fn();
  mockDisconnect = vi.fn();
  mockSocket = {
    on: vi.fn(),
    emit: mockEmit,
    disconnect: mockDisconnect,
  };

  vi.mocked(io).mockReturnValue(mockSocket as any);
});

afterEach(() => {
  vi.clearAllMocks();
});

// ── Tests ──────────────────────────────────────────────────────────────────

describe('useNotifications', () => {
  describe('WebSocket Connection', () => {
    it('should not connect when there is no token', () => {
      vi.mocked(useAuthStore).mockImplementation((selector) =>
        selector({ token: null } as any)
      );

      renderHook(() => useNotifications());

      expect(io).not.toHaveBeenCalled();
    });

    it('should connect to WebSocket when token is available', () => {
      vi.mocked(useAuthStore).mockImplementation((selector) =>
        selector({ token: mockToken } as any)
      );

      renderHook(() => useNotifications());

      expect(io).toHaveBeenCalledWith(
        `${import.meta.env.VITE_WS_URL}/notifications`,
        {
          extraHeaders: { authentication: mockToken },
        }
      );
    });

    it('should disconnect socket on unmount', () => {
      vi.mocked(useAuthStore).mockImplementation((selector) =>
        selector({ token: mockToken } as any)
      );

      const { unmount } = renderHook(() => useNotifications());

      unmount();

      expect(mockDisconnect).toHaveBeenCalled();
    });

    it('should disconnect and reconnect when token changes', () => {
      const { rerender } = renderHook(() => useNotifications(), {
        initialProps: undefined,
      });

      vi.mocked(useAuthStore).mockImplementation((selector) =>
        selector({ token: mockToken } as any)
      );

      rerender();

      expect(io).toHaveBeenCalled();

      vi.mocked(useAuthStore).mockImplementation((selector) =>
        selector({ token: 'new-token' } as any)
      );

      rerender();

      expect(mockDisconnect).toHaveBeenCalled();
    });
  });

  describe('Receiving Notifications', () => {
    beforeEach(() => {
      vi.mocked(useAuthStore).mockImplementation((selector) =>
        selector({ token: mockToken } as any)
      );
    });

    it('should listen for unread notifications event', () => {
      renderHook(() => useNotifications());

      expect(mockSocket.on).toHaveBeenCalledWith(
        'notifications.unread',
        expect.any(Function)
      );
    });

    it('should set notifications when receiving unread notifications', async () => {
      const { result } = renderHook(() => useNotifications());

      const unreadHandler = mockSocket.on.mock.calls.find(
        (call: any[]) => call[0] === 'notifications.unread'
      )?.[1];

      act(() => {
        unreadHandler({ notifications: [mockNotification, mockNotification2] });
      });

      await waitFor(() => {
        expect(result.current.notifications).toEqual([
          mockNotification,
          mockNotification2,
        ]);
      });
    });

    it('should listen for new notification event', () => {
      renderHook(() => useNotifications());

      expect(mockSocket.on).toHaveBeenCalledWith(
        'notifications.new',
        expect.any(Function)
      );
    });

    it('should prepend new notification to list', async () => {
      const { result } = renderHook(() => useNotifications());

      // Set initial notifications
      const unreadHandler = mockSocket.on.mock.calls.find(
        (call: any[]) => call[0] === 'notifications.unread'
      )?.[1];

      act(() => {
        unreadHandler({ notifications: [mockNotification] });
      });

      await waitFor(() => {
        expect(result.current.notifications).toHaveLength(1);
      });

      // Receive new notification
      const newHandler = mockSocket.on.mock.calls.find(
        (call: any[]) => call[0] === 'notifications.new'
      )?.[1];

      act(() => {
        newHandler(mockNotification2);
      });

      await waitFor(() => {
        expect(result.current.notifications).toHaveLength(2);
        expect(result.current.notifications[0]).toEqual(mockNotification2);
        expect(result.current.notifications[1]).toEqual(mockNotification);
      });
    });

    it('should handle empty notifications list', async () => {
      const { result } = renderHook(() => useNotifications());

      const unreadHandler = mockSocket.on.mock.calls.find(
        (call: any[]) => call[0] === 'notifications.unread'
      )?.[1];

      act(() => {
        unreadHandler({ notifications: [] });
      });

      await waitFor(() => {
        expect(result.current.notifications).toEqual([]);
      });
    });
  });

  describe('Mark Notification as Read', () => {
    beforeEach(() => {
      vi.mocked(useAuthStore).mockImplementation((selector) =>
        selector({ token: mockToken } as any)
      );
    });

    it('should emit markAsRead event with notification id', async () => {
      const { result } = renderHook(() => useNotifications());

      // Set initial notification
      const unreadHandler = mockSocket.on.mock.calls.find(
        (call: any[]) => call[0] === 'notifications.unread'
      )?.[1];

      act(() => {
        unreadHandler({ notifications: [mockNotification] });
      });

      act(() => {
        result.current.markAsRead('notif-1');
      });

      expect(mockEmit).toHaveBeenCalledWith('notifications.markAsRead', {
        notificationId: 'notif-1',
      });
    });

    it('should mark notification as read locally', async () => {
      const { result } = renderHook(() => useNotifications());

      const unreadHandler = mockSocket.on.mock.calls.find(
        (call: any[]) => call[0] === 'notifications.unread'
      )?.[1];

      act(() => {
        unreadHandler({ notifications: [mockNotification] });
      });

      await waitFor(() => {
        expect(result.current.notifications[0].read).toBe(false);
      });

      act(() => {
        result.current.markAsRead('notif-1');
      });

      await waitFor(() => {
        expect(result.current.notifications[0].read).toBe(true);
      });
    });

    it('should only mark the specific notification as read', async () => {
      const { result } = renderHook(() => useNotifications());

      const unreadHandler = mockSocket.on.mock.calls.find(
        (call: any[]) => call[0] === 'notifications.unread'
      )?.[1];

      act(() => {
        unreadHandler({ notifications: [mockNotification, mockNotification2] });
      });

      await waitFor(() => {
        expect(result.current.notifications).toHaveLength(2);
      });

      act(() => {
        result.current.markAsRead('notif-1');
      });

      await waitFor(() => {
        expect(result.current.notifications[0].read).toBe(true);
        expect(result.current.notifications[1].read).toBe(false);
      });
    });

    it('should handle marking non-existent notification', async () => {
      const { result } = renderHook(() => useNotifications());

      const unreadHandler = mockSocket.on.mock.calls.find(
        (call: any[]) => call[0] === 'notifications.unread'
      )?.[1];

      act(() => {
        unreadHandler({ notifications: [mockNotification] });
      });

      expect(() => {
        act(() => {
          result.current.markAsRead('non-existent');
        });
      }).not.toThrow();

      expect(result.current.notifications[0].read).toBe(false);
    });
  });

  describe('Mark All Notifications as Read', () => {
    beforeEach(() => {
      vi.mocked(useAuthStore).mockImplementation((selector) =>
        selector({ token: mockToken } as any)
      );
    });

    it('should emit markAllAsRead event', async () => {
      const { result } = renderHook(() => useNotifications());

      const unreadHandler = mockSocket.on.mock.calls.find(
        (call: any[]) => call[0] === 'notifications.unread'
      )?.[1];

      act(() => {
        unreadHandler({ notifications: [mockNotification] });
      });

      act(() => {
        result.current.markAllAsRead();
      });

      expect(mockEmit).toHaveBeenCalledWith('notifications.markAllAsRead');
    });

    it('should mark all notifications as read', async () => {
      const { result } = renderHook(() => useNotifications());

      const unreadHandler = mockSocket.on.mock.calls.find(
        (call: any[]) => call[0] === 'notifications.unread'
      )?.[1];

      act(() => {
        unreadHandler({ notifications: [mockNotification, mockNotification2] });
      });

      await waitFor(() => {
        expect(result.current.notifications).toHaveLength(2);
        expect(result.current.notifications[0].read).toBe(false);
        expect(result.current.notifications[1].read).toBe(false);
      });

      act(() => {
        result.current.markAllAsRead();
      });

      await waitFor(() => {
        expect(result.current.notifications.every((n) => n.read)).toBe(true);
      });
    });

    it('should handle markAllAsRead with empty notifications list', async () => {
      const { result } = renderHook(() => useNotifications());

      expect(() => {
        act(() => {
          result.current.markAllAsRead();
        });
      }).not.toThrow();

      expect(result.current.notifications).toEqual([]);
    });

    it('should handle markAllAsRead with already read notifications', async () => {
      const readNotification = { ...mockNotification, read: true };
      const { result } = renderHook(() => useNotifications());

      const unreadHandler = mockSocket.on.mock.calls.find(
        (call: any[]) => call[0] === 'notifications.unread'
      )?.[1];

      act(() => {
        unreadHandler({ notifications: [readNotification, mockNotification2] });
      });

      act(() => {
        result.current.markAllAsRead();
      });

      await waitFor(() => {
        expect(result.current.notifications.every((n) => n.read)).toBe(true);
      });
    });
  });

  describe('Notification Metadata', () => {
    beforeEach(() => {
      vi.mocked(useAuthStore).mockImplementation((selector) =>
        selector({ token: mockToken } as any)
      );
    });

    it('should preserve notification metadata', async () => {
      const { result } = renderHook(() => useNotifications());

      const unreadHandler = mockSocket.on.mock.calls.find(
        (call: any[]) => call[0] === 'notifications.unread'
      )?.[1];

      act(() => {
        unreadHandler({ notifications: [mockNotification] });
      });

      await waitFor(() => {
        expect(result.current.notifications[0].metadata).toEqual({
          orderId: 'order-123',
        });
      });
    });

    it('should handle different notification types', async () => {
      const { result } = renderHook(() => useNotifications());

      const notificationTypes = [
        { ...mockNotification, type: 'order' },
        { ...mockNotification, type: 'payment' },
        { ...mockNotification, type: 'shipment' },
        { ...mockNotification, type: 'delivery' },
      ];

      const unreadHandler = mockSocket.on.mock.calls.find(
        (call: any[]) => call[0] === 'notifications.unread'
      )?.[1];

      act(() => {
        unreadHandler({ notifications: notificationTypes });
      });

      await waitFor(() => {
        expect(result.current.notifications).toHaveLength(4);
        expect(result.current.notifications.map((n) => n.type)).toEqual([
          'order',
          'payment',
          'shipment',
          'delivery',
        ]);
      });
    });
  });

  describe('Edge Cases', () => {
    beforeEach(() => {
      vi.mocked(useAuthStore).mockImplementation((selector) =>
        selector({ token: mockToken } as any)
      );
    });

    it('should handle rapid markAsRead calls', async () => {
      const { result } = renderHook(() => useNotifications());

      const unreadHandler = mockSocket.on.mock.calls.find(
        (call: any[]) => call[0] === 'notifications.unread'
      )?.[1];

      act(() => {
        unreadHandler({ notifications: [mockNotification, mockNotification2] });
      });

      act(() => {
        result.current.markAsRead('notif-1');
        result.current.markAsRead('notif-2');
      });

      await waitFor(() => {
        expect(result.current.notifications.every((n) => n.read)).toBe(true);
      });
    });

    it('should handle receiving new notification while marking as read', async () => {
      const { result } = renderHook(() => useNotifications());

      const unreadHandler = mockSocket.on.mock.calls.find(
        (call: any[]) => call[0] === 'notifications.unread'
      )?.[1];

      const newHandler = mockSocket.on.mock.calls.find(
        (call: any[]) => call[0] === 'notifications.new'
      )?.[1];

      act(() => {
        unreadHandler({ notifications: [mockNotification] });
      });

      act(() => {
        result.current.markAsRead('notif-1');
        newHandler(mockNotification2);
      });

      await waitFor(() => {
        expect(result.current.notifications).toHaveLength(2);
        expect(result.current.notifications[0].id).toBe('notif-2');
        expect(result.current.notifications[0].read).toBe(false);
      });
    });
  });
});
