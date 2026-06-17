import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RegisterPage } from './RegisterPage';

// ─── Mocks ──────────────────────────────────────────────────────────────────

vi.mock('react-router', () => ({
  Link: ({ to, children }: { to: string; children: React.ReactNode }) => (
    <a href={to}>{children}</a>
  ),
  useNavigate: vi.fn()
}));

vi.mock('@/components/custom/CustomLogo', () => ({
  CustomLogo: () => <div data-testid="custom-logo" />,
}));

describe('RegisterPage', () => {

  beforeEach(() => {
    cleanup();
    render(<RegisterPage />);
  });

  describe('rendering', () => {
    it('should render the Register button', () => {
      expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
    });
  });

  describe('navigation', () => {
    it('should render the sign in link pointing to /auth/login', () => {
      const link = screen.getByRole('link', { name: /sign in/i });
      expect(link).toHaveAttribute('href', '/auth/login');
    });
  });
});