import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import VaaniBot from '../../../frontend/src/components/VaaniBot';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

// Mock AppContext
vi.mock('../../../frontend/src/context/AppContext', () => ({
  useApp: () => ({
    language: 'en',
    setLanguage: vi.fn(),
  }),
}));

// Mock Gemini Service
vi.mock('../../../frontend/src/services/gemini', () => ({
  sendMessage: vi.fn().mockResolvedValue('This is an automated mock response from Gemini.'),
}));

describe('VaaniBot Component and Accessibility Tests', () => {
  it('should render the chat trigger button on mount', () => {
    render(<VaaniBot />);
    const button = screen.getByTitle(/Ask VaaniBot/);
    expect(button).toBeInTheDocument();
  });

  it('should open the chat drawer when clicked', () => {
    render(<VaaniBot />);
    const trigger = screen.getByTitle(/Ask VaaniBot/);
    fireEvent.click(trigger);
    
    expect(screen.getByText('VaaniBot')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Use voice or type/)).toBeInTheDocument();
  });

  it('should submit query and render response', async () => {
    render(<VaaniBot />);
    // Open drawer
    fireEvent.click(screen.getByTitle(/Ask VaaniBot/));
    
    // Type query
    const input = screen.getByPlaceholderText(/Use voice or type/);
    fireEvent.change(input, { target: { value: 'How is Walajah PHC?' } });
    
    // Send
    const sendButton = screen.getByRole('button', { name: 'Send message' });
    fireEvent.click(sendButton);
    
    // Check if loading indicator appears and then resolves
    await waitFor(() => {
      expect(screen.getByText('This is an automated mock response from Gemini.')).toBeInTheDocument();
    });
  });

  it('should have zero WCAG 2.1 AA accessibility violations', async () => {
    const { container } = render(<VaaniBot />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
