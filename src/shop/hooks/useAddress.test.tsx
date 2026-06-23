import type { ReactNode } from 'react';
import { describe, expect, vi, beforeEach, test } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useAddress } from './useAddress';
import { createAddress, getAddresses, type AddressPayload } from '../api/address.api';
import { useAuthStore } from '@/auth/store/auth.store';
import * as sonner from 'sonner';
import type { Address } from '@/interfaces/address.interface';

// ── Mocks ──────────────────────────────────────────────────────────────────

vi.mock('../api/address.api', () => ({
  createAddress: vi.fn(),
  getAddresses: vi.fn(),
}));

vi.mock('@/auth/store/auth.store', () => ({
  useAuthStore: vi.fn(),
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// ── Setup ──────────────────────────────────────────────────────────────────

const mockAddresses = [
  {
    id: '1',
    street: 'Calle 1',
    number: '123',
    city: 'Buenos Aires',
    state: 'Buenos Aires',
    zip_code: '1000',
    country: 'Argentina',
    userId: 'user1',
    is_default: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as any as Address,
  {
    id: '2',
    street: 'Calle 2',
    number: '456',
    city: 'Córdoba',
    state: 'Córdoba',
    zip_code: '5000',
    country: 'Argentina',
    userId: 'user1',
    is_default: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as any as Address,
];

const createQueryWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

const setupAuthStore = (authStatus: 'authenticated' | 'unauthenticated') => {
  vi.mocked(useAuthStore).mockReturnValue({
    authStatus,
  } as any);
};

// ── Tests ──────────────────────────────────────────────────────────────────

describe('useAddress', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupAuthStore('authenticated');
  });

  test('should fetch addresses when user is authenticated', async () => {
    vi.mocked(getAddresses).mockResolvedValue(mockAddresses);

    const { result } = renderHook(() => useAddress(), {
      wrapper: createQueryWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.addresses).toEqual(mockAddresses);
    expect(getAddresses).toHaveBeenCalled();
  });

  test('should return empty array when addresses is undefined', async () => {
    vi.mocked(getAddresses).mockResolvedValue([]);

    const { result } = renderHook(() => useAddress(), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.addresses).toEqual([]);
  });

  test('should not fetch addresses when user is not authenticated', async () => {
    setupAuthStore('unauthenticated');

    const { result } = renderHook(() => useAddress(), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(getAddresses).not.toHaveBeenCalled();
    expect(result.current.addresses).toEqual([]);
  });

  test('should create an address successfully', async () => {
    vi.mocked(getAddresses).mockResolvedValue(mockAddresses);
    const newAddress = {
      street: 'Calle Nueva',
      number: 789,
      city: 'La Plata',
      state: 'Buenos Aires',
      zipCode: '1900',
      country: 'Argentina',
    } as any as AddressPayload;
    vi.mocked(createAddress).mockResolvedValue({
      id: '3',
      ...newAddress,
      userId: 'user1',
      isDefault: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);

    const { result } = renderHook(() => useAddress(), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Execute mutation
    result.current.createAddress(newAddress);

    await waitFor(() => {
      expect(createAddress).toHaveBeenCalledWith(newAddress);
      expect(sonner.toast.success).toHaveBeenCalledWith('Address saved correctly');
    });
  });

  test('should handle address creation error gracefully', async () => {
    vi.mocked(getAddresses).mockResolvedValue([]);
    const newAddress = {
      street: 'Calle Error',
      number: 999,
      city: 'Error City',
      state: 'State',
      zipCode: '0000',
      country: 'Argentina',
    } as any as AddressPayload;
    vi.mocked(createAddress).mockRejectedValue(new Error('API Error'));

    const { result } = renderHook(() => useAddress(), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    result.current.createAddress(newAddress);

    await waitFor(() => {
      expect(createAddress).toHaveBeenCalledWith(newAddress);
    });
  });
});
