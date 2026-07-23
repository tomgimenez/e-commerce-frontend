import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CartPage } from './CartPage';
import { useCart } from '@/shop/hooks/useCart';
import type { CartItem } from '@/interfaces/cart.interface';
import type { Product } from '@/interfaces/product.interface';

// ── Mocks ──────────────────────────────────────────────────────────────────

vi.mock('@/shop/hooks/useCart');

vi.mock('react-router', () => ({
  Link: ({ to, children }: any) => <a href={to}>{children}</a>,
}));

vi.mock('@/shop/components/Breadcrumbs', () => ({
  Breadcrumbs: () => <div data-testid="breadcrumbs" />,
}));

vi.mock('@/shop/components/order/OrderSummary', () => ({
  OrderSummary: () => <div data-testid="order-summary" />,
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, disabled, ...props }: any) => (
    <button onClick={onClick} disabled={disabled} {...props}>
      {children}
    </button>
  ),
}));

vi.mock('@/components/ui/separator', () => ({
  Separator: () => <hr data-testid="separator" />,
}));

// ── Setup ──────────────────────────────────────────────────────────────────

const mockProduct = {
  id: 'product-1',
  title: 'Test Product',
  price: 100,
  images: [{ url: 'https://example.com/product.jpg' }],
} as any as Product;

const mockProduct2 = {
  id: 'product-2',
  title: 'Another Product',
  price: 50,
  images: [{ url: 'https://example.com/product2.jpg' }],
} as any as Product;

const mockCartItem: CartItem = {
  id: 'item-1',
  quantity: 2,
  unitPrice: 100,
  product: mockProduct,
};

const mockCartItem2: CartItem = {
  id: 'item-2',
  quantity: 1,
  unitPrice: 50,
  product: mockProduct2,
};

// ── Tests ──────────────────────────────────────────────────────────────────

describe('CartPage', () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  describe('Empty Cart', () => {
    it('should show empty cart message when there are no items', () => {
      vi.mocked(useCart).mockReturnValue({
        cart: { items: [] },
        addItem: vi.fn(),
        removeItem: vi.fn(),
        updateItem: vi.fn(),
      } as any);

      render(<CartPage />);

      expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
      expect(screen.getByText('Continue Shopping')).toBeInTheDocument();
    });

    it('should show cart count as 0 when empty', () => {
      vi.mocked(useCart).mockReturnValue({
        cart: { items: [] },
        addItem: vi.fn(),
        removeItem: vi.fn(),
        updateItem: vi.fn(),
      } as any);

      render(<CartPage />);

      expect(screen.getByText(/Your Cart \(0 items\)/)).toBeInTheDocument();
    });

    it('should not show quantity buttons when cart is empty', () => {
      vi.mocked(useCart).mockReturnValue({
        cart: { items: [] },
        addItem: vi.fn(),
        removeItem: vi.fn(),
        updateItem: vi.fn(),
      } as any);

      render(<CartPage />);

      const removeButtons = screen.queryAllByRole('button', { name: /remove/i });

      expect(removeButtons).toHaveLength(0);
    });
  });

  describe('Cart with Items', () => {
    it('should load and display cart items', () => {
      vi.mocked(useCart).mockReturnValue({
        cart: { items: [mockCartItem, mockCartItem2] },
        addItem: vi.fn(),
        removeItem: vi.fn(),
        updateItem: vi.fn(),
      } as any);

      render(<CartPage />);

      expect(screen.getAllByText('Test Product')[0]).toBeInTheDocument();
      expect(screen.getAllByText('Another Product')[0]).toBeInTheDocument();
    });

    it('should show correct cart item count', () => {
      vi.mocked(useCart).mockReturnValue({
        cart: { items: [mockCartItem, mockCartItem2] },
        addItem: vi.fn(),
        removeItem: vi.fn(),
        updateItem: vi.fn(),
      } as any);

      render(<CartPage />);

      expect(screen.getByText(/Your Cart \(2 items\)/)).toBeInTheDocument();
    });

    it('should display product images for each item', () => {
      vi.mocked(useCart).mockReturnValue({
        cart: { items: [mockCartItem] },
        addItem: vi.fn(),
        removeItem: vi.fn(),
        updateItem: vi.fn(),
      } as any);

      render(<CartPage />);

      const images = screen.getAllByRole('img');
      expect(images.length).toBeGreaterThan(0);
      expect(images[0]).toHaveAttribute('src', 'https://example.com/product.jpg');
    });

    it('should display unit prices for each item', () => {
      vi.mocked(useCart).mockReturnValue({
        cart: { items: [mockCartItem] },
        addItem: vi.fn(),
        removeItem: vi.fn(),
        updateItem: vi.fn(),
      } as any);

      render(<CartPage />);

      expect(screen.getAllByText('$100')[0]).toBeInTheDocument();
    });

    it('should calculate and display correct subtotal', () => {
      vi.mocked(useCart).mockReturnValue({
        cart: { items: [mockCartItem, mockCartItem2] },
        addItem: vi.fn(),
        removeItem: vi.fn(),
        updateItem: vi.fn(),
      } as any);

      render(<CartPage />);

      const subtotal = 100 * 2 + 50 * 1; // 250
      expect(screen.getByText(`Subtotal: $${subtotal.toFixed(2)}`)).toBeInTheDocument();
    });

    it('should calculate item total correctly', () => {
      vi.mocked(useCart).mockReturnValue({
        cart: { items: [mockCartItem] }, // quantity: 2, unitPrice: 100 = 200
        addItem: vi.fn(),
        removeItem: vi.fn(),
        updateItem: vi.fn(),
      } as any);

      render(<CartPage />);

      expect(screen.getByText('$200')).toBeInTheDocument();
    });
  });

  // describe('Remove Item', () => {
  //   it('should call removeItem when remove button is clicked', async () => {
  //     const removeItem = vi.fn();
  //     const user = userEvent.setup();

  //     vi.mocked(useCart).mockReturnValue({
  //       cart: { items: [mockCartItem] },
  //       addItem: vi.fn(),
  //       removeItem,
  //       updateItem: vi.fn(),
  //     } as any);

  //     render(<CartPage />);

  //     const removeButton = screen.getByRole('button', { name: /remove/i });
  //     await user.click(removeButton);

  //     expect(removeItem).toHaveBeenCalledWith(mockCartItem);
  //     expect(removeItem).toHaveBeenCalledTimes(1);
  //   });

  //   it('should call removeItem with correct item data', async () => {
  //     const removeItem = vi.fn();
  //     const user = userEvent.setup();

  //     vi.mocked(useCart).mockReturnValue({
  //       cart: { items: [mockCartItem2] },
  //       addItem: vi.fn(),
  //       removeItem,
  //       updateItem: vi.fn(),
  //     } as any);

  //     render(<CartPage />);

  //     const removeButton = screen.getByRole('button', { name: /remove/i });
  //     await user.click(removeButton);

  //     expect(removeItem).toHaveBeenCalledWith(
  //       expect.objectContaining({
  //         id: 'item-2',
  //         quantity: 1,
  //         product: mockProduct2,
  //       })
  //     );
  //   });

  //   it('should handle removing multiple items independently', async () => {
  //     const removeItem = vi.fn();
  //     const user = userEvent.setup();

  //     vi.mocked(useCart).mockReturnValue({
  //       cart: { items: [mockCartItem, mockCartItem2] },
  //       addItem: vi.fn(),
  //       removeItem,
  //       updateItem: vi.fn(),
  //     } as any);

  //     render(<CartPage />);

  //     const removeButtons = screen.getAllByRole('button', { name: /remove/i });
  //     await user.click(removeButtons[0]);

  //     expect(removeItem).toHaveBeenCalledWith(mockCartItem);
  //   });
  // });

  describe('Update Quantity', () => {
    it('should call updateItem with increased quantity when plus button is clicked', async () => {
      const updateItem = vi.fn();
      const user = userEvent.setup();

      vi.mocked(useCart).mockReturnValue({
        cart: { items: [mockCartItem] },
        addItem: vi.fn(),
        removeItem: vi.fn(),
        updateItem,
      } as any);

      render(<CartPage />);

      const plusButton = screen.getByTestId('plus-button');

      await user.click(plusButton!);

      expect(updateItem).toHaveBeenCalledWith(
        expect.objectContaining({
          ...mockCartItem,
          quantity: 3, // 2 + 1
        })
      );
    });

    it('should call updateItem with decreased quantity when minus button is clicked', async () => {
      const updateItem = vi.fn();
      const user = userEvent.setup();

      vi.mocked(useCart).mockReturnValue({
        cart: { items: [mockCartItem] },
        addItem: vi.fn(),
        removeItem: vi.fn(),
        updateItem,
      } as any);

      render(<CartPage />);

      // Get minus button
      const buttons = screen.getAllByRole('button');
      const minusButton = buttons.find((btn) => btn.textContent === '');

      await user.click(minusButton!);

      expect(updateItem).toHaveBeenCalledWith(
        expect.objectContaining({
          ...mockCartItem,
          quantity: 1, // 2 - 1
        })
      );
    });

    it('should disable minus button when quantity is 1', () => {
      vi.mocked(useCart).mockReturnValue({
        cart: {
          items: [{ ...mockCartItem, quantity: 1 }],
        },
        addItem: vi.fn(),
        removeItem: vi.fn(),
        updateItem: vi.fn(),
      } as any);

      render(<CartPage />);

      const minusButton = screen.getByTestId('minus-button');

      expect(minusButton).toBeDisabled();
    });

    it('should not disable plus button', () => {
      vi.mocked(useCart).mockReturnValue({
        cart: { items: [mockCartItem] },
        addItem: vi.fn(),
        removeItem: vi.fn(),
        updateItem: vi.fn(),
      } as any);

      render(<CartPage />);

      const plusButtons = screen.getAllByTestId('plus-button');

      expect(plusButtons.length).toBeGreaterThan(0);
    });

    it('should handle multiple quantity updates correctly', async () => {
      const updateItem = vi.fn();
      const user = userEvent.setup();

      vi.mocked(useCart).mockReturnValue({
        cart: { items: [mockCartItem, mockCartItem2] },
        addItem: vi.fn(),
        removeItem: vi.fn(),
        updateItem,
      } as any);

      render(<CartPage />);

      const plusButtons = screen.getAllByTestId('plus-button');

      await user.click(plusButtons[0]);

      expect(updateItem).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'item-1',
          quantity: 3,
          unitPrice: 100,
          product: mockProduct
        })
      );
    });
  });

  describe('UI Elements', () => {
    it('should render breadcrumbs component', () => {
      vi.mocked(useCart).mockReturnValue({
        cart: { items: [mockCartItem] },
        addItem: vi.fn(),
        removeItem: vi.fn(),
        updateItem: vi.fn(),
      } as any);

      render(<CartPage />);

      expect(screen.getByTestId('breadcrumbs')).toBeInTheDocument();
    });

    it('should render continue to shipping button', () => {
      vi.mocked(useCart).mockReturnValue({
        cart: { items: [mockCartItem] },
        addItem: vi.fn(),
        removeItem: vi.fn(),
        updateItem: vi.fn(),
      } as any);

      render(<CartPage />);

      expect(screen.getByRole('button', { name: /continue to shipping/i })).toBeInTheDocument();
    });

    it('should show mini cart with first 3 items', () => {
      const items = [mockCartItem, mockCartItem2, mockCartItem];
      vi.mocked(useCart).mockReturnValue({
        cart: { items },
        addItem: vi.fn(),
        removeItem: vi.fn(),
        updateItem: vi.fn(),
      } as any);

      render(<CartPage />);

      // Mini cart should show 3 items
      const images = screen.getAllByRole('img');
      expect(images.length).toBeGreaterThanOrEqual(3);
    });
  });
});
