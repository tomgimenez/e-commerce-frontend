import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import type { UseQueryResult } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router'

import { CustomHeader } from './CustomHeader';
import { useAuthStore, type AuthState, type AuthStatus } from '@/auth/store/auth.store';
import { useCategories } from '@/hooks/useCategories';
import type { Category } from '@/interfaces/product.interface';
import { useCart } from '@/shop/hooks/useCart';

const mockSetSearchParams = vi.fn();
const mockSearchParams = new URLSearchParams();

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useSearchParams: () => [mockSearchParams, mockSetSearchParams]
  }
});

vi.mock('@/auth/store/auth.store');
vi.mock('@/hooks/useCategories');
vi.mock('@/shop/hooks/useCart');

vi.mock('@/components/custom/CustomLogo', () => ({
  CustomLogo: () => <div data-testid="custom-logo" />,
}));

function mockStore({
  authStatus = 'not-authenticated' as AuthStatus,
  isAdmin = false,
  logout = vi.fn(),
} = {}) {
  const state: Partial<AuthState> = {
    authStatus,
    isAdmin: () => isAdmin,
    logout,
  };

  vi.mocked(useAuthStore).mockImplementation((selector: any) => selector(state));

  vi.mocked(useCategories).mockReturnValue({} as UseQueryResult<Category[]>);
}

const renderHeader = () => {
  render(
    <MemoryRouter>
      <CustomHeader />
    </MemoryRouter>
  );
}

describe('CustomHeader', () => {

  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
    mockSearchParams.delete('query');
    mockStore();

    vi.mocked(useCart).mockReturnValue({
      cart: { items: [] },
      addItem: vi.fn(),
      updateItem: vi.fn(),
      removeItem: vi.fn(),
    } as any);
  });

  describe('rendering', () => {
    it('should render the logo', () => {
      renderHeader();
      expect(screen.getByTestId('custom-logo')).toBeInTheDocument();
    });

    it('should render the cart link pointing to /cart', () => {
      renderHeader();
      expect(screen.getByRole('link', { name: /cart/i })).toHaveAttribute('href', '/cart');
    });

    it('should render the nav links for Offers and Help', () => {
      renderHeader();
      expect(screen.getByRole('link', { name: /offers/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /help/i })).toBeInTheDocument();
    });
  });

  describe('when not authenticated', () => {
    it('should render the Login link pointing to /auth/login', () => {
      renderHeader();
      expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument();
    });
    
    it('should not render the Logout button', () => {
      renderHeader();
      expect(screen.queryByRole('button', { name: /logout/i })).not.toBeInTheDocument();
    });

    it('should not render the Admin link', () => {
      renderHeader();
      expect(screen.queryByRole('link', { name: /admin/i })).not.toBeInTheDocument();
    });
  });

  describe('when authenticated', () => {
    it('should not render the Login link', () => {
      mockStore({ authStatus: 'authenticated' });
      renderHeader();
      expect(screen.queryByRole('link', { name: /login/i })).not.toBeInTheDocument();
    });
  });

  describe('mobile search toggle', () => {
    it('should not show the mobile search bar initially', () => {
      renderHeader();
      expect(screen.queryByRole('button', { name: /close search/i })).not.toBeInTheDocument();
    });

    it('should show the mobile search bar after clicking the search button', () => {
      renderHeader();

      fireEvent.click(screen.getByRole('button', { name: /^search$/i }));

      expect(screen.getByRole('button', { name: /close search/i })).toBeInTheDocument();
    });

    it('should hide the mobile search bar after clicking close', () => {
      renderHeader();

      fireEvent.click(screen.getByRole('button', { name: /^search$/i }));
      fireEvent.click(screen.getByRole('button', { name: /close search/i }));

      expect(screen.queryByRole('button', { name: /close search/i })).not.toBeInTheDocument();
    });
  });

  describe('handleSearch', () => {
    it('should call setSearchParams with the query when pressing Enter', () => {
      renderHeader();
      const input = screen.getAllByPlaceholderText(/search for enchanted tomes/i)[0];

      fireEvent.keyDown(input, { key: 'Enter', target: { value: 'magic sword' } });

      expect(mockSetSearchParams).toHaveBeenCalledTimes(1);
    });

    it('should not call setSearchParams when pressing a key other than Enter', () => {
      renderHeader();
      const input = screen.getAllByPlaceholderText(/search for enchanted tomes/i)[0];

      fireEvent.keyDown(input, { key: 'a' });

      expect(mockSetSearchParams).not.toHaveBeenCalled();
    });
  });
});