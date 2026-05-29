import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthenticatedRoute, NotAuthenticatedRoute, AdminRoute } from './ProtectedRoutes';
import { useAuthStore } from '@/auth/store/auth.store';

vi.mock('react-router', () => ({
  Navigate: ({ to }: { to: string }) => <div data-testid="navigate" data-to={to} />,
}));

vi.mock('@/auth/store/auth.store');

function mockStore(authStatus: 'authenticated' | 'not-authenticated' | 'checking', isAdmin = false) {
  vi.mocked(useAuthStore).mockReturnValue({
    authStatus,
    isAdmin: vi.fn().mockReturnValue(isAdmin),
  });
}

const ChildComponent = () => <div data-testid="child">Protected content</div>;

describe('ProtectedRoutes', () => {

  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  describe('AuthenticatedRoute', () => {
    it('should render nothing while checking', () => {
      mockStore('checking');
      const { container } = render(<AuthenticatedRoute><ChildComponent /></AuthenticatedRoute>);

      expect(container).toBeEmptyDOMElement();
    });

    it('should redirect to /auth/login when not authenticated', () => {
      mockStore('not-authenticated');
      render(<AuthenticatedRoute><ChildComponent /></AuthenticatedRoute>);

      const navigate = screen.getByTestId('navigate');
      expect(navigate).toBeInTheDocument();
      expect(navigate).toHaveAttribute('data-to', '/auth/login');
    });

    it('should render children when authenticated', () => {
      mockStore('authenticated');
      render(<AuthenticatedRoute><ChildComponent /></AuthenticatedRoute>);

      expect(screen.getByTestId('child')).toBeInTheDocument();
    });
  });

  describe('NotAuthenticatedRoute', () => {
    it('should render nothing while checking', () => {
      mockStore('checking');
      const { container } = render(<NotAuthenticatedRoute><ChildComponent /></NotAuthenticatedRoute>);

      expect(container).toBeEmptyDOMElement();
    });

    it('should redirect to / when already authenticated', () => {
      mockStore('authenticated');
      render(<NotAuthenticatedRoute><ChildComponent /></NotAuthenticatedRoute>);

      const navigate = screen.getByTestId('navigate');
      expect(navigate).toBeInTheDocument();
      expect(navigate).toHaveAttribute('data-to', '/');
    });

    it('should render children when not authenticated', () => {
      mockStore('not-authenticated');
      render(<NotAuthenticatedRoute><ChildComponent /></NotAuthenticatedRoute>);

      expect(screen.getByTestId('child')).toBeInTheDocument();
    });
  });

  describe('AdminRoute', () => {
    it('should render nothing while checking', () => {
      mockStore('checking');
      const { container } = render(<AdminRoute><ChildComponent /></AdminRoute>);

      expect(container).toBeEmptyDOMElement();
    });

    it('should redirect to /auth/login when not authenticated', () => {
      mockStore('not-authenticated');
      render(<AdminRoute><ChildComponent /></AdminRoute>);

      const navigate = screen.getByTestId('navigate');
      expect(navigate).toHaveAttribute('data-to', '/auth/login');
    });

    it('should redirect to / when authenticated but not admin', () => {
      mockStore('authenticated', false);
      render(<AdminRoute><ChildComponent /></AdminRoute>);

      const navigate = screen.getByTestId('navigate');
      expect(navigate).toHaveAttribute('data-to', '/');
    });

    it('should render children when authenticated and is admin', () => {
      mockStore('authenticated', true);
      render(<AdminRoute><ChildComponent /></AdminRoute>);

      expect(screen.getByTestId('child')).toBeInTheDocument();
    });
  });
});