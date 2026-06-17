import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Chatbot } from './Chatbot';
import { useChatbot } from './useChatbot';

vi.mock('./useChatbot');

describe('Chatbot', () => {
  beforeEach(() => {
    vi.mocked(useChatbot).mockReturnValue({
      messages: [
        {
          role: 'bot',
          content: 'Welcome to The LoreVault Market! How can I help you find your next magical adventure?'
        }
      ],
      isConnected: true,
      isLoading: false,
      sendMessage: vi.fn(),
    } as any);
  });

  it('should display welcome message when online', async () => {
    const user = userEvent.setup();
    render(<Chatbot />);

    // Open chat window
    const chatButton = screen.getByRole('button', { name: /Open chat/i });
    await user.click(chatButton);

    // Verify welcome message is displayed
    expect(
      screen.getByText('Welcome to The LoreVault Market! How can I help you find your next magical adventure?')
    ).toBeInTheDocument();

    // Verify online status
    expect(screen.getByText('Online')).toBeInTheDocument();
  });
});
