import { describe, it, expect, vi, beforeEach } from 'vitest';
import { registerAction } from './register.action';
import { backendApi } from '@/api/backendApi';
import type { AuthResponse } from '../interfaces/auth.reponse';

vi.mock('@/api/backendApi', () => ({
  backendApi: {
    post: vi.fn(),
  },
}));

// ── Setup ──────────────────────────────────────────────────────────────────

const mockAuthResponse: AuthResponse = {
  user: {
    id: 'user-1',
    email: 'test@example.com',
    name: 'John',
    lastname: 'Doe',
    isActive: true,
    roles: [
      {
        id: 'role-1',
        name: 'user',
        description: 'Regular user',
      },
    ],
  },
  token: 'jwt-token-12345',
};

const registerData = {
  name: 'John',
  lastname: 'Doe',
  email: 'test@example.com',
  password: 'securePassword123!',
};

// ── Tests ──────────────────────────────────────────────────────────────────

describe('registerAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Successful Registration', () => {
    it('should call the correct endpoint with registration data', async () => {
      vi.mocked(backendApi.post).mockResolvedValue({
        data: mockAuthResponse,
      } as any);

      await registerAction(
        registerData.name,
        registerData.lastname,
        registerData.email,
        registerData.password
      );

      expect(backendApi.post).toHaveBeenCalledWith('/auth/register', {
        name: registerData.name,
        lastname: registerData.lastname,
        email: registerData.email,
        password: registerData.password,
      });
      expect(backendApi.post).toHaveBeenCalledTimes(1);
    });

    it('should return AuthResponse with user and token', async () => {
      vi.mocked(backendApi.post).mockResolvedValue({
        data: mockAuthResponse,
      } as any);

      const result = await registerAction(
        registerData.name,
        registerData.lastname,
        registerData.email,
        registerData.password
      );

      expect(result).toEqual(mockAuthResponse);
      expect(result.user).toBeDefined();
      expect(result.token).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should throw error when API returns error', async () => {
      const error = new Error('Email already exists');
      vi.mocked(backendApi.post).mockRejectedValue(error);

      await expect(
        registerAction(
          registerData.name,
          registerData.lastname,
          registerData.email,
          registerData.password
        )
      ).rejects.toThrow('Email already exists');
    });

    it('should throw error when network fails', async () => {
      const networkError = new Error('Network error');
      vi.mocked(backendApi.post).mockRejectedValue(networkError);

      await expect(
        registerAction(
          registerData.name,
          registerData.lastname,
          registerData.email,
          registerData.password
        )
      ).rejects.toThrow('Network error');
    });

    it('should throw error with proper error message', async () => {
      const apiError = new Error('Invalid password format');
      vi.mocked(backendApi.post).mockRejectedValue(apiError);

      try {
        await registerAction(
          registerData.name,
          registerData.lastname,
          registerData.email,
          'weak'
        );
      } catch (error) {
        expect(error).toEqual(apiError);
      }
    });
  });
});
