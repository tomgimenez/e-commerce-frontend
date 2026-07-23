import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, expect, vi, beforeEach, test, afterEach } from 'vitest';
import { AdminSidebar } from '@/admin/components/AdminSidebar';

// ── Mocks ──────────────────────────────────────────────────────────────────

vi.mock('@/auth/store/auth.store', () => ({
  useAuthStore: vi.fn(),
}));

vi.mock('@/components/custom/CustomLogo', () => ({
  CustomLogo: ({ subtitle, shouldShow }: { subtitle: string; shouldShow: boolean }) =>
    shouldShow ? <div data-testid="custom-logo">{subtitle}</div> : null,
}));

vi.mock('react-router', () => ({
  useLocation: vi.fn(() => ({ pathname: '/admin' })),
  Link: ({ to, children, onClick }: { to: string; children: React.ReactNode; onClick?: () => void }) => (
    <a href={to} onClick={onClick}>{children}</a>
  ),
}));

// ── Helpers ────────────────────────────────────────────────────────────────

import { useAuthStore } from '@/auth/store/auth.store';
import { useLocation } from 'react-router';

const mockUser = { name: 'John', lastname: 'Doe', email: 'john@company.com' };

const renderSidebar = () => {
  cleanup();
  return render(<AdminSidebar />);
};

// ── Tests ──────────────────────────────────────────────────────────────────

describe('AdminSidebar', () => {

  beforeEach(() => {
    vi.mocked(useAuthStore).mockReturnValue({ user: mockUser } as ReturnType<typeof useAuthStore>);
    vi.mocked(useLocation).mockReturnValue({ pathname: '/admin' } as ReturnType<typeof useLocation>);

    // Simula desktop por defecto
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1280 });
  });

  afterEach(() => {
    cleanup();
  });

  // ── Initial Render ───────────────────────────────────────────────────────

  describe('initial render', () => {
    test('should show the logo', () => {
      renderSidebar();
      expect(screen.getByTestId('custom-logo')).toBeInTheDocument();
    });

    test('should display all navigation items', () => {
      renderSidebar();

      ['Dashboard', 'Products', 'Categories', 'Orders', 'Customers', 'Analytics', 'Settings']
        .forEach(name => expect(screen.getByText(name)).toBeInTheDocument());
    });
  });

  // ── Mobile ───────────────────────────────────────────────────────────────

  describe('comportamiento mobile', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 375 });
    });

    test('should show the hamburger menu button', () => {
      renderSidebar();
      expect(screen.getByRole('button', { name: /menu/i })).toBeInTheDocument();
    });

    test('should start the sidebar off-screen', () => {
      renderSidebar();
      expect(screen.getByRole('complementary')).toHaveClass('-translate-x-full');
    });

    test('should open the sidebar when clicking the hamburger button', () => {
      renderSidebar();
      fireEvent.click(screen.getByRole('button', { name: /menu/i }));
      expect(screen.getByRole('complementary')).toHaveClass('translate-x-0');
    });

    test('should show the overlay when opening the menu', () => {
      renderSidebar();
      fireEvent.click(screen.getByRole('button', { name: /menu/i }));
      expect(screen.getByRole('complementary').previousSibling).toBeInTheDocument();
    });

    test('should close the sidebar when clicking the overlay', () => {
      renderSidebar();
      fireEvent.click(screen.getByRole('button', { name: /menu/i }));

      const overlay = document.querySelector('.bg-black\\/50');
      fireEvent.click(overlay!);

      expect(screen.getByRole('complementary')).toHaveClass('-translate-x-full');
    });

    test('should close the sidebar when navigating to a link', () => {
      renderSidebar();
      fireEvent.click(screen.getByRole('button', { name: /menu/i }));
      fireEvent.click(screen.getByText('Products'));
      expect(screen.getByRole('complementary')).toHaveClass('-translate-x-full');
    });
  });
});