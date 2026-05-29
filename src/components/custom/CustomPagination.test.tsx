import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CustomPagination } from './CustomPagination';

// ─── Mocks ──────────────────────────────────────────────────────────────────

const mockSetSearchParams = vi.fn();
const mockSearchParams = new URLSearchParams();

vi.mock('react-router', () => ({
  useSearchParams: () => [mockSearchParams, mockSetSearchParams],
}));

function setPage(page: string | null) {
  if (page === null) {
    mockSearchParams.delete('page');
  } else {
    mockSearchParams.set('page', page);
  }
}

function renderComponent(totalPages = 5) {
  return render(<CustomPagination totalPages={totalPages} />);
}

describe('CustomPagination', () => {

  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
    mockSearchParams.delete('page');
  });

  describe('rendering', () => {
    it('should render the correct number of page buttons', () => {
      renderComponent(5);

      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(7);
    });

    it('should render a button for each page', () => {
      renderComponent(3);

      expect(screen.getByLabelText('Page 1')).toBeInTheDocument();
      expect(screen.getByLabelText('Page 2')).toBeInTheDocument();
      expect(screen.getByLabelText('Page 3')).toBeInTheDocument();
    });

    it('should render the previous and next buttons', () => {
      renderComponent();

      expect(screen.getByLabelText('Previous page')).toBeInTheDocument();
      expect(screen.getByLabelText('Next page')).toBeInTheDocument();
    });
  });

  describe('when no page param is in the URL', () => {
    it('should default to page 1 and disable the previous button', () => {
      renderComponent();

      expect(screen.getByLabelText('Previous page')).toBeDisabled();
    });

    it('should not disable the next button', () => {
      renderComponent();

      expect(screen.getByLabelText('Next page')).not.toBeDisabled();
    });
  });

  describe('when on a middle page', () => {
    beforeEach(() => setPage('3'));

    it('should enable both previous and next buttons', () => {
      renderComponent();

      expect(screen.getByLabelText('Previous page')).not.toBeDisabled();
      expect(screen.getByLabelText('Next page')).not.toBeDisabled();
    });
  });

  describe('when on the last page', () => {
    beforeEach(() => setPage('5'));

    it('should disable the next button', () => {
      renderComponent(5);

      expect(screen.getByLabelText('Next page')).toBeDisabled();
    });

    it('should not disable the previous button', () => {
      renderComponent(5);

      expect(screen.getByLabelText('Previous page')).not.toBeDisabled();
    });
  });

  describe('when the page param is not a valid number', () => {
    it('should fall back to page 1 and disable the previous button', () => {
      setPage('abc');
      renderComponent();

      expect(screen.getByLabelText('Previous page')).toBeDisabled();
    });
  });

  describe('handlePageChange', () => {
    it('should call setSearchParams with the next page when clicking next', () => {
      setPage('2');
      renderComponent();

      fireEvent.click(screen.getByLabelText('Next page'));

      expect(mockSetSearchParams).toHaveBeenCalledTimes(1);
      const updatedParams: URLSearchParams = mockSetSearchParams.mock.calls[0][0];
      expect(updatedParams.get('page')).toBe('3');
    });

    it('should call setSearchParams with the previous page when clicking previous', () => {
      setPage('3');
      renderComponent();

      fireEvent.click(screen.getByLabelText('Previous page'));

      expect(mockSetSearchParams).toHaveBeenCalledTimes(1);
      const updatedParams: URLSearchParams = mockSetSearchParams.mock.calls[0][0];
      expect(updatedParams.get('page')).toBe('2');
    });

    it('should navigate to the correct page when clicking a page button', () => {
      setPage('1');
      renderComponent();

      fireEvent.click(screen.getByLabelText('Page 4'));

      const updatedParams: URLSearchParams = mockSetSearchParams.mock.calls[0][0];
      expect(updatedParams.get('page')).toBe('4');
    });

    it('should not call setSearchParams when clicking previous on page 1', () => {
      setPage('1');
      renderComponent();

      fireEvent.click(screen.getByLabelText('Previous page'));

      expect(mockSetSearchParams).not.toHaveBeenCalled();
    });

    it('should not call setSearchParams when clicking next on the last page', () => {
      setPage('5');
      renderComponent(5);

      fireEvent.click(screen.getByLabelText('Next page'));

      expect(mockSetSearchParams).not.toHaveBeenCalled();
    });
  });
});