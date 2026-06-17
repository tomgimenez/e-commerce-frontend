import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProductPage } from './ProductPage';
import { useBook } from '@/shop/hooks/useBook';
import { useCart } from '@/shop/hooks/useCart';
import { useCartStore } from '@/shop/store/cart.store';

vi.mock('@/shop/hooks/useBook');
vi.mock('@/shop/hooks/useCart');
vi.mock('@/shop/store/cart.store');

vi.mock('react-router', () => ({
  Link:     ({ to, children }: any) => <a href={to}>{children}</a>,
  Navigate: ({ to }: { to: string }) => <div data-testid="navigate" data-to={to} />,
}));

vi.mock('@/components/custom/CustomLoading', () => ({
  CustomLoading: () => <div data-testid="custom-loading" />,
}));

const mockBook = {
  id: 'book-1',
  title: 'The Wizard of Oz',
  description: 'A classic tale',
  price: 12.99,
  rating: 4,
  reviews: 1200,
  images: [{ url: 'https://example.com/book.jpg' }],
  categories: [{ id: 'cat-1', name: 'Fantasy' }],
  attributes: {
    author:      'L. Frank Baum',
    pages:       256,
    publisher:   'Penguin',
    isBestseller: false,
  },
};

describe('ProductPage', () => {

  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
    
    // Mock useCart hook
    vi.mocked(useCart).mockReturnValue({
      cart: { items: [] },
      addItem: vi.fn(),
      updateItem: vi.fn(),
      removeItem: vi.fn(),
    } as any);

    // Mock useCartStore hook
    vi.mocked(useCartStore).mockReturnValue({
      guestItems: [],
      addGuestItem: vi.fn(),
      updateGuestItem: vi.fn(),
      removeGuestItem: vi.fn(),
      lastAdded: null,
      isDrawerOpen: false,
      openDrawer: vi.fn(),
      closeDrawer: vi.fn(),
    } as any);
  });

  describe('when isLoading is true', () => {
    it('should render the CustomLoading component', () => {
      vi.mocked(useBook).mockReturnValue({ data: undefined, isLoading: true } as any);
      render(<ProductPage />);

      expect(screen.getByTestId('custom-loading')).toBeInTheDocument();
    });

    it('should not render the product content', () => {
      vi.mocked(useBook).mockReturnValue({ data: undefined, isLoading: true } as any);
      render(<ProductPage />);

      expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    });
  });

  describe('when book is not found', () => {
    it('should redirect to /', () => {
      vi.mocked(useBook).mockReturnValue({ data: undefined, isLoading: false } as any);
      render(<ProductPage />);

      const navigate = screen.getByTestId('navigate');
      expect(navigate).toBeInTheDocument();
      expect(navigate).toHaveAttribute('data-to', '/');
    });
  });

  describe('when book is loaded', () => {
    beforeEach(() => {
      vi.mocked(useBook).mockReturnValue({ data: mockBook, isLoading: false } as any);
      render(<ProductPage />);
    });

    it('should render the book title', () => {
      expect(screen.getByRole('heading', { name: /the wizard of oz/i })).toBeInTheDocument();
    });

    it('should render the author', () => {
      expect(screen.getByText(/l\. frank baum/i)).toBeInTheDocument();
    });

    it('should render the book price', () => {
      expect(screen.getByText(/\$12\.99/)).toBeInTheDocument();
    });

    it('should render the category in the breadcrumb', () => {
      expect(screen.getAllByText('Fantasy').length).toBeGreaterThan(0);
    });

    it('should render the book image with correct src and alt', () => {
      const img = screen.getByRole('img', { name: /the wizard of oz/i });
      expect(img).toHaveAttribute('src', 'https://example.com/book.jpg');
    });

    it('should not show CustomLoading', () => {
      expect(screen.queryByTestId('custom-loading')).not.toBeInTheDocument();
    });

    it('should not redirect', () => {
      expect(screen.queryByTestId('navigate')).not.toBeInTheDocument();
    });
  });

  describe('bestseller badge', () => {
    it('should show the Bestseller badge when isBestseller is true', () => {
      const bestsellerBook = { ...mockBook, attributes: { ...mockBook.attributes, isBestseller: true } };
      vi.mocked(useBook).mockReturnValue({ data: bestsellerBook, isLoading: false } as any);
      render(<ProductPage />);

      expect(screen.getByText('Bestseller')).toBeInTheDocument();
    });

    it('should not show the Bestseller badge when isBestseller is false', () => {
      vi.mocked(useBook).mockReturnValue({ data: mockBook, isLoading: false } as any);
      render(<ProductPage />);

      expect(screen.queryByText('Bestseller')).not.toBeInTheDocument();
    });
  });
});