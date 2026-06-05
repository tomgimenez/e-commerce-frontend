import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CustomHeader } from './header/CustomHeader';
import { useAuthStore, type AuthState } from '@/auth/store/auth.store';
import { useCategories } from '@/hooks/useCategories';
import type { Category } from '@/interfaces/product.interface';
import type { UseQueryResult } from '@tanstack/react-query';

const mockSetSearchParams = vi.fn();
const mockSearchParams = new URLSearchParams();

vi.mock('react-router', () => ({
  useSearchParams: () => [mockSearchParams, mockSetSearchParams],
  Link: ({ to, children }: {to: string, children: React.ReactNode}) => <a href={to}>{children}</a>,
}));

vi.mock('@/auth/store/auth.store');
vi.mock('@/hooks/useCategories');

vi.mock('@/components/custom/CustomLogo', () => ({
  CustomLogo: () => <div data-testid="custom-logo" />,
}));

function mockStore({
  authStatus = 'not-authenticated' as 'authenticated' | 'not-authenticated' | 'checking',
  isAdmin = false,
  logout = vi.fn(),
} = {}) {
  vi.mocked(useAuthStore).mockReturnValue({
    authStatus,
    isAdmin: vi.fn().mockReturnValue(isAdmin),
    logout,
  } as unknown as AuthState);

  vi.mocked(useCategories).mockReturnValue({} as UseQueryResult<Category[]>)
}

describe('CustomHeader', () => {

  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
    mockSearchParams.delete('query');
    mockStore();
  });

  describe('rendering', () => {
    it('should render the logo', () => {
      render(<CustomHeader />);
      expect(screen.getByTestId('custom-logo')).toBeInTheDocument();
    });

    it('should render the cart link pointing to /checkout', () => {
      render(<CustomHeader />);
      expect(screen.getByRole('link', { name: /cart/i })).toHaveAttribute('href', '/checkout');
    });

    it('should render the nav links for Offers and Help', () => {
      render(<CustomHeader />);
      expect(screen.getByRole('link', { name: /offers/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /help/i })).toBeInTheDocument();
    });
  });

  describe('when not authenticated', () => {
    it('should render the Login link pointing to /auth/login', () => {
      render(<CustomHeader />);
      expect(screen.getByRole('link', { name: /login/i })).toHaveAttribute('href', '/auth/login');
    });

    it('should not render the Logout button', () => {
      render(<CustomHeader />);
      expect(screen.queryByRole('button', { name: /logout/i })).not.toBeInTheDocument();
    });

    it('should not render the Admin link', () => {
      render(<CustomHeader />);
      expect(screen.queryByRole('link', { name: /admin/i })).not.toBeInTheDocument();
    });
  });

  describe('when authenticated', () => {
    it('should render the Logout button', () => {
      mockStore({ authStatus: 'authenticated' });
      render(<CustomHeader />);
      expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
    });

    it('should not render the Login link', () => {
      mockStore({ authStatus: 'authenticated' });
      render(<CustomHeader />);
      expect(screen.queryByRole('link', { name: /login/i })).not.toBeInTheDocument();
    });

    it('should call logout when clicking the Logout button', () => {
      const mockLogout = vi.fn();
      mockStore({ authStatus: 'authenticated', logout: mockLogout });
      render(<CustomHeader />);

      fireEvent.click(screen.getByRole('button', { name: /logout/i }));

      expect(mockLogout).toHaveBeenCalledTimes(1);
    });
  });

  describe('admin button', () => {
    it('should render the Admin link when user is admin', () => {
      mockStore({ authStatus: 'authenticated', isAdmin: true });
      render(<CustomHeader />);
      expect(screen.getByRole('link', { name: /admin/i })).toHaveAttribute('href', '/admin');
    });

    it('should not render the Admin link when user is not admin', () => {
      mockStore({ authStatus: 'authenticated', isAdmin: false });
      render(<CustomHeader />);
      expect(screen.queryByRole('link', { name: /admin/i })).not.toBeInTheDocument();
    });
  });

  describe('mobile search toggle', () => {
    it('should not show the mobile search bar initially', () => {
      render(<CustomHeader />);
      expect(screen.queryByRole('button', { name: /close search/i })).not.toBeInTheDocument();
    });

    it('should show the mobile search bar after clicking the search button', () => {
      render(<CustomHeader />);

      fireEvent.click(screen.getByRole('button', { name: /^search$/i }));

      expect(screen.getByRole('button', { name: /close search/i })).toBeInTheDocument();
    });

    it('should hide the mobile search bar after clicking close', () => {
      render(<CustomHeader />);

      fireEvent.click(screen.getByRole('button', { name: /^search$/i }));
      fireEvent.click(screen.getByRole('button', { name: /close search/i }));

      expect(screen.queryByRole('button', { name: /close search/i })).not.toBeInTheDocument();
    });
  });

  describe('handleSearch', () => {
    it('should call setSearchParams with the query when pressing Enter', () => {
      render(<CustomHeader />);
      const input = screen.getAllByPlaceholderText(/search for enchanted tomes/i)[0];

      fireEvent.keyDown(input, { key: 'Enter', target: { value: 'magic sword' } });

      expect(mockSetSearchParams).toHaveBeenCalledTimes(1);
    });

    it('should not call setSearchParams when pressing a key other than Enter', () => {
      render(<CustomHeader />);
      const input = screen.getAllByPlaceholderText(/search for enchanted tomes/i)[0];

      fireEvent.keyDown(input, { key: 'a' });

      expect(mockSetSearchParams).not.toHaveBeenCalled();
    });
  });
});