import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { toast } from 'sonner';

import { LoginPage } from './LoginPage';

// ─── Mocks ──────────────────────────────────────────────────────────────────

const mockNavigate = vi.fn();
const mockLogin    = vi.fn();

vi.mock('react-router', () => ({
  useNavigate: () => mockNavigate,
  Link: ({ to, children }: { to: string; children: React.ReactNode }) => (
    <a href={to}>{children}</a>
  ),
}));

vi.mock('@/auth/store/auth.store', () => ({
  useAuthStore: () => ({ login: mockLogin }),
}));

vi.mock('sonner', () => ({
  toast: { error: vi.fn() },
}));

vi.mock('@/components/custom/CustomLogo', () => ({
  CustomLogo: () => <div data-testid="custom-logo" />,
}));


// ─── Helpers ────────────────────────────────────────────────────────────────

function fillAndSubmit(email = 'user@test.com', password = 'secret123') {
  fireEvent.change(screen.getByLabelText(/email/i),    { target: { value: email } });
  fireEvent.change(screen.getByLabelText(/password/i), { target: { value: password } });
  fireEvent.submit(screen.getByRole('button', { name: /^login$/i }).closest('form')!);
}

describe('LoginPage', () => {

  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
    render(<LoginPage />);
  });

  it('should render the email input', () => {
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  describe('when login succeeds', () => {
    beforeEach(() => {
      mockLogin.mockResolvedValue(true);
    });

    it('should call login with the entered email and password', async () => {
      fillAndSubmit('admin@test.com', 'mypassword');

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith('admin@test.com', 'mypassword');
      });
    });

    it('should navigate to / after a successful login', async () => {
      fillAndSubmit();

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });
    });

    it('should not show an error toast', async () => {
      fillAndSubmit();

      await waitFor(() => expect(mockNavigate).toHaveBeenCalled());
      expect(toast.error).not.toHaveBeenCalled();
    });
  });

  describe('when login fails', () => {
    beforeEach(() => {
      mockLogin.mockResolvedValue(false);
    });

    it('should show an error toast with the right message', async () => {
      fillAndSubmit();

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Invalid credentials. Please try again.');
      });
    });

    it('should not navigate', async () => {
      fillAndSubmit();

      await waitFor(() => expect(toast.error).toHaveBeenCalled());
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should re-enable the submit button after failure', async () => {
      fillAndSubmit();

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /^login$/i })).not.toBeDisabled();
      });
    });
  });

  describe('isPosting state', () => {
    it('should disable the submit button while the request is in flight', async () => {
      mockLogin.mockReturnValue(new Promise(() => {}));

      fillAndSubmit();

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /^login$/i })).toBeDisabled();
      });
    });
  });
});