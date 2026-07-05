import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import Navbar from '../../../frontend/src/components/Navbar';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

describe('Navbar Component Unit Tests', () => {
  it('should render the brand title and logo', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    expect(screen.getByText('AarogyaOS')).toBeInTheDocument();
    expect(screen.getByAltText('AarogyaOS Logo')).toBeInTheDocument();
  });

  it('should render the desktop navigation links', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    expect(screen.getAllByRole('link', { name: 'Home' })[0]).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: 'Public Map' })[0]).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: 'Impact' })[0]).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: 'Cost & ROI' })[0]).toBeInTheDocument();
  });

  it('should redirect to portal login when Portal Login button is clicked', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    const loginButton = screen.getByRole('button', { name: 'Portal Login' });
    fireEvent.click(loginButton);
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('should toggle mobile menu drawer when mobile button is clicked', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    const toggleButton = screen.getByRole('button', { name: 'Toggle menu' });
    // Click to open mobile overlay
    fireEvent.click(toggleButton);
    const drawerLinks = screen.getAllByRole('link', { name: 'Home' });
    // Should have both desktop link and mobile link
    expect(drawerLinks.length).toBe(2);
  });

  it('should have zero WCAG violations', async () => {
    const { container } = render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
