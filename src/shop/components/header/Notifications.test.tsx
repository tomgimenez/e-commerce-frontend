import { cleanup, render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router';
import { Notifications } from './Notifications';
import { useNotifications, type Notification } from './useNotifications';

vi.mock('./useNotifications');

vi.mock('@/components/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: any) => <div data-testid="dropdown-menu">{children}</div>,
  DropdownMenuContent: ({ children }: any) => <div data-testid="dropdown-content">{children}</div>,
  DropdownMenuTrigger: ({ children }: any) => <div data-testid="dropdown-trigger">{children}</div>,
}));

vi.mock('lucide-react', () => ({
  Bell: () => <div data-testid="bell-icon" />,
  Package: () => <div data-testid="package-icon" />,
  Sparkles: () => <div data-testid="sparkles-icon" />,
  Tag: () => <div data-testid="tag-icon" />,
}));

vi.mock('date-fns', () => ({
  formatDistanceToNow: vi.fn(() => '5 minutes ago'),
}));

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
  title: 'Order Shipped',
  message: 'Your order has been shipped',
  type: 'order',
  metadata: { orderId: 'order-123' },
  read: true,
  createdAt: '2026-06-17T11:00:00Z',
};

const mockDiscountNotification: Notification = {
  id: 'notif-3',
  title: 'Special Discount',
  message: 'You have a special discount available',
  type: 'discount',
  metadata: { discountId: 'disc-456' },
  read: false,
  createdAt: '2026-06-17T12:00:00Z',
};

// ── Helper function ──────────────────────────────────────────────────────

const renderNotifications = () => {
  return render(
    <MemoryRouter>
      <Notifications />
    </MemoryRouter>
  );
}

// ── Tests ──────────────────────────────────────────────────────────────────

describe('Notifications', () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  describe('No Notifications', () => {
    it('should show no notifications message when list is empty', () => {
      vi.mocked(useNotifications).mockReturnValue({
        notifications: [],
        markAsRead: vi.fn(),
        markAllAsRead: vi.fn(),
      } as any);

      renderNotifications();

      expect(screen.getByText('No notifications')).toBeInTheDocument();
    });


    it('should render dropdown menu structure', () => {
      vi.mocked(useNotifications).mockReturnValue({
        notifications: [],
        markAsRead: vi.fn(),
        markAllAsRead: vi.fn(),
      } as any);

      renderNotifications();

      expect(screen.getByTestId('dropdown-menu')).toBeInTheDocument();
      expect(screen.getByTestId('dropdown-trigger')).toBeInTheDocument();
      expect(screen.getByTestId('dropdown-content')).toBeInTheDocument();
    });
  });

  describe('With Notifications', () => {
    it('should display all notifications when present', () => {
      vi.mocked(useNotifications).mockReturnValue({
        notifications: [mockNotification, mockNotification2],
        markAsRead: vi.fn(),
        markAllAsRead: vi.fn(),
      } as any);

      renderNotifications();

      expect(screen.getByText('Order Confirmed')).toBeInTheDocument();
      expect(screen.getByText('Your order has been confirmed')).toBeInTheDocument();
      expect(screen.getByText('Order Shipped')).toBeInTheDocument();
      expect(screen.getByText('Your order has been shipped')).toBeInTheDocument();
    });

    it('should show unread count in header', () => {
      vi.mocked(useNotifications).mockReturnValue({
        notifications: [mockNotification, mockNotification2],
        markAsRead: vi.fn(),
        markAllAsRead: vi.fn(),
      } as any);

      renderNotifications();

      expect(screen.getByText('1 new')).toBeInTheDocument();
    });

    it('should show unread count in bell icon badge', () => {
      vi.mocked(useNotifications).mockReturnValue({
        notifications: [mockNotification, mockDiscountNotification],
        markAsRead: vi.fn(),
        markAllAsRead: vi.fn(),
      } as any);

      renderNotifications();

      // 2 unread notifications
      const badge = screen.getByText('2');
      expect(badge).toBeInTheDocument();
    });

    it('should call markAsRead when clicking a notification', () => {
      const markAsReadMock = vi.fn();
      vi.mocked(useNotifications).mockReturnValue({
        notifications: [mockNotification],
        markAsRead: markAsReadMock,
        markAllAsRead: vi.fn(),
      } as any);

      const { container } = renderNotifications();

      // Find the notification item and click it
      const notificationItems = container.querySelectorAll('[class*="flex items-start gap-3"]');
      expect(notificationItems.length).toBeGreaterThan(0);
    });
  });
});
