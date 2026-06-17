import { renderHook, act, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useChatbot } from './useChatbot';
import { useAuthStore } from '@/auth/store/auth.store';

vi.mock('@/auth/store/auth.store');
vi.mock('socket.io-client');

import { io } from 'socket.io-client';

describe('useChatbot', () => {
  let mockSocket: any;

  beforeEach(() => {
    mockSocket = {
      on: vi.fn(),
      emit: vi.fn(),
      disconnect: vi.fn(),
      off: vi.fn(),
    };

    vi.clearAllMocks();
    vi.mocked(io).mockReturnValue(mockSocket);
    vi.mocked(useAuthStore).mockReturnValue(null as any);
  });

  it('should initialize with welcome message', () => {
    const { result } = renderHook(() => useChatbot());

    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages[0]).toEqual({
      role: 'bot',
      content: 'Welcome to The LoreVault Market! How can I help you find your next magical adventure?'
    });
  });

  it('should connect to chatbot WebSocket', () => {
    renderHook(() => useChatbot());

    expect(io).toHaveBeenCalledWith(
      `${import.meta.env.VITE_WS_URL}/chatbot`,
      {
        extraHeaders: {}
      }
    );
  });

  it('should send authentication token in headers when available', () => {
    const token = 'test-token-123';
    vi.mocked(useAuthStore).mockReturnValue(token as any);

    renderHook(() => useChatbot());

    expect(io).toHaveBeenCalledWith(
      `${import.meta.env.VITE_WS_URL}/chatbot`,
      {
        extraHeaders: { authentication: token }
      }
    );
  });

  it('should set isConnected to true on connect event', () => {
    const { result } = renderHook(() => useChatbot());

    act(() => {
      const connectHandler = vi.mocked(mockSocket.on).mock.calls.find(
        (call: any) => call[0] === 'connect'
      )?.[1];
      connectHandler?.();
    });

    expect(result.current.isConnected).toBe(true);
  });

  it('should set isConnected to false on disconnect event', () => {
    const { result } = renderHook(() => useChatbot());

    act(() => {
      const connectHandler = vi.mocked(mockSocket.on).mock.calls.find(
        (call: any) => call[0] === 'connect'
      )?.[1];
      connectHandler?.();
    });

    expect(result.current.isConnected).toBe(true);

    act(() => {
      const disconnectHandler = vi.mocked(mockSocket.on).mock.calls.find(
        (call: any) => call[0] === 'disconnect'
      )?.[1];
      disconnectHandler?.();
    });

    expect(result.current.isConnected).toBe(false);
  });

  it('should add bot response to messages on chatbot.response event', async () => {
    const { result } = renderHook(() => useChatbot());

    const initialLength = result.current.messages.length;

    act(() => {
      const responseHandler = vi.mocked(mockSocket.on).mock.calls.find(
        (call: any) => call[0] === 'chatbot.response'
      )?.[1];
      responseHandler?.({ response: 'Hello user!' });
    });

    await waitFor(() => {
      expect(result.current.messages).toHaveLength(initialLength + 1);
    });

    expect(result.current.messages[result.current.messages.length - 1]).toEqual({
      role: 'bot',
      content: 'Hello user!'
    });
  });

  it('should set isLoading to false when receiving bot response', async () => {
    const { result } = renderHook(() => useChatbot());

    act(() => {
      const responseHandler = vi.mocked(mockSocket.on).mock.calls.find(
        (call: any) => call[0] === 'chatbot.response'
      )?.[1];
      responseHandler?.({ response: 'Response received' });
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('should send message and set isLoading to true', () => {
    const { result } = renderHook(() => useChatbot());
    const messageContent = 'Hello chatbot!';

    act(() => {
      result.current.sendMessage(messageContent);
    });

    expect(result.current.messages).toContainEqual({
      role: 'user',
      content: messageContent
    });

    expect(result.current.isLoading).toBe(true);

    expect(mockSocket.emit).toHaveBeenCalledWith('chatbot.message', {
      message: messageContent
    });
  });

  it('should not send empty messages', () => {
    const { result } = renderHook(() => useChatbot());

    act(() => {
      result.current.sendMessage('   ');
    });

    expect(mockSocket.emit).not.toHaveBeenCalled();
  });

  it('should disconnect socket on unmount', () => {
    const { unmount } = renderHook(() => useChatbot());

    unmount();

    expect(mockSocket.disconnect).toHaveBeenCalled();
  });

  it('should re-create socket when token changes', () => {
    const { rerender } = renderHook(() => useChatbot(), {
      initialProps: {}
    });

    const initialCallCount = vi.mocked(io).mock.calls.length;

    vi.mocked(useAuthStore).mockReturnValue('new-token' as any);

    rerender({});

    expect(vi.mocked(io).mock.calls.length).toBeGreaterThan(initialCallCount);
  });
});
