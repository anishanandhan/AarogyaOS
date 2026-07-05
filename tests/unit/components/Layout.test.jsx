import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import Layout from '../../../frontend/src/components/Layout';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

// Mock AppContext
const mockLogout = vi.fn();
const mockSetLanguage = vi.fn();
vi.mock('../../../frontend/src/context/AppContext', () => ({
  useApp: () => ({
    logout: mockLogout,
    criticalCount: 3,
    language: 'en',
    setLanguage: mockSetLanguage,
    userRole: 'District Admin'
  })
}));

describe('Layout Component Unit Tests', () => {
  it('should render children content inside main tag', () => {
    render(
      <MemoryRouter>
        <Layout>
          <div data-testid="child-content">Main Page Content</div>
        </Layout>
      </MemoryRouter>
    );
    expect(screen.getByTestId('child-content')).toBeInTheDocument();
    expect(screen.getByText('Main Page Content')).toBeInTheDocument();
  });

  it('should show the critical alerts count correctly on the badge', () => {
    render(
      <MemoryRouter>
        <Layout>
          <div>Content</div>
        </Layout>
      </MemoryRouter>
    );
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('should trigger language switch when language button is clicked', () => {
    render(
      <MemoryRouter>
        <Layout>
          <div>Content</div>
        </Layout>
      </MemoryRouter>
    );
    const hiButton = screen.getByRole('button', { name: 'HI' });
    fireEvent.click(hiButton);
    expect(mockSetLanguage).toHaveBeenCalledWith('hi');
  });

  it('should call logout function when sign out button is clicked', () => {
    render(
      <MemoryRouter>
        <Layout>
          <div>Content</div>
        </Layout>
      </MemoryRouter>
    );
    const signOutBtn = screen.getByRole('button', { name: /Sign Out/ });
    fireEvent.click(signOutBtn);
    expect(mockLogout).toHaveBeenCalled();
  });

  it('should have zero WCAG violations', async () => {
    const { container } = render(
      <MemoryRouter>
        <Layout>
          <div>Content</div>
        </Layout>
      </MemoryRouter>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
