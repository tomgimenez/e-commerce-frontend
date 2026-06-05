import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAuthStore } from './auth.store';
import { loginAction } from '../actions/login.action';
import { checkStatusAction } from '../actions/check-status.action';
import type { User } from '@/interfaces/user.interface';

vi.mock('../actions/login.action');
vi.mock('../actions/check-status.action');

const mockUser = {
  id: 'uuid-1',
  name: 'John',
  lastname: 'Doe',
  email: 'john@test.com',
  isActive: true,
  roles: [{ name: 'user' }],
} as unknown as User;

const mockAdmin = {
  ...mockUser,
  roles: [{ name: 'admin' }],
} as unknown as User;

const mockToken = 'mock-jwt-token';

describe('useAuthStore', () => {

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();

    useAuthStore.setState({
      user: null,
      token: null,
      authStatus: 'checking',
    });
  });

  describe('initial state', () => {
    it('should have null user', () => {
      expect(useAuthStore.getState().user).toBeNull();
    });

    it('should have null token', () => {
      expect(useAuthStore.getState().token).toBeNull();
    });

    it('should have checking as authStatus', () => {
      expect(useAuthStore.getState().authStatus).toBe('checking');
    });
  });

  describe('isAdmin', () => {
    it('should return false when there is no user', () => {
      expect(useAuthStore.getState().isAdmin()).toBe(false);
    });

    it('should return false when user has no admin role', () => {
      useAuthStore.setState({ user: mockUser });

      expect(useAuthStore.getState().isAdmin()).toBe(false);
    });

    it('should return true when user has admin role', () => {
      useAuthStore.setState({ user: mockAdmin });

      expect(useAuthStore.getState().isAdmin()).toBe(true);
    });
  });

  describe('login', () => {
    it('should return true and set authenticated state on success', async () => {
      vi.mocked(loginAction).mockResolvedValue({ user: mockUser, token: mockToken });

      const result = await useAuthStore.getState().login('john@test.com', '123456');

      expect(result).toBe(true);
      expect(useAuthStore.getState().authStatus).toBe('authenticated');
      expect(useAuthStore.getState().user).toEqual(mockUser);
      expect(useAuthStore.getState().token).toBe(mockToken);
    });

    it('should persist the token in localStorage on success', async () => {
      vi.mocked(loginAction).mockResolvedValue({ user: mockUser, token: mockToken });

      await useAuthStore.getState().login('john@test.com', '123456');

      expect(localStorage.getItem('token')).toBe(mockToken);
    });

    it('should return false and set not-authenticated state on failure', async () => {
      vi.mocked(loginAction).mockRejectedValue(new Error('Unauthorized'));

      const result = await useAuthStore.getState().login('wrong@test.com', 'wrongpass');

      expect(result).toBe(false);
      expect(useAuthStore.getState().authStatus).toBe('not-authenticated');
      expect(useAuthStore.getState().user).toBeNull();
      expect(useAuthStore.getState().token).toBeNull();
    });

    it('should remove token from localStorage on failure', async () => {
      localStorage.setItem('token', 'old-token');
      vi.mocked(loginAction).mockRejectedValue(new Error('Unauthorized'));

      await useAuthStore.getState().login('wrong@test.com', 'wrongpass');

      expect(localStorage.getItem('token')).toBeNull();
    });
  });

  describe('logout', () => {
    beforeEach(() => {
      useAuthStore.setState({ user: mockUser, token: mockToken, authStatus: 'authenticated' });
      localStorage.setItem('token', mockToken);
    });

    it('should clear user and token from state', () => {
      useAuthStore.getState().logout();

      expect(useAuthStore.getState().user).toBeNull();
      expect(useAuthStore.getState().token).toBeNull();
    });

    it('should set authStatus to not-authenticated', () => {
      useAuthStore.getState().logout();

      expect(useAuthStore.getState().authStatus).toBe('not-authenticated');
    });

    it('should remove token from localStorage', () => {
      useAuthStore.getState().logout();

      expect(localStorage.getItem('token')).toBeNull();
    });
  });

  describe('checkAuthStatus', () => {
    it('should return true and set authenticated state on valid token', async () => {
      vi.mocked(checkStatusAction).mockResolvedValue({ user: mockUser, token: mockToken });

      const result = await useAuthStore.getState().checkAuthStatus();

      expect(result).toBe(true);
      expect(useAuthStore.getState().authStatus).toBe('authenticated');
      expect(useAuthStore.getState().user).toEqual(mockUser);
      expect(useAuthStore.getState().token).toBe(mockToken);
    });

    it('should return false and set not-authenticated state on invalid token', async () => {
      vi.mocked(checkStatusAction).mockRejectedValue(new Error('Unauthorized'));

      const result = await useAuthStore.getState().checkAuthStatus();

      expect(result).toBe(false);
      expect(useAuthStore.getState().authStatus).toBe('not-authenticated');
      expect(useAuthStore.getState().user).toBeNull();
      expect(useAuthStore.getState().token).toBeNull();
    });
  });
});