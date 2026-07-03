import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import HealthScoreRing from '../../src/components/HealthScoreRing';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('HealthScoreRing Component and Accessibility Tests', () => {
  it('should render the component without crashing', () => {
    render(<HealthScoreRing score={75} size={80} />);
    expect(screen.getByText('75')).toBeInTheDocument();
  });

  it('should apply the correct color based on score levels', () => {
    const { rerender } = render(<HealthScoreRing score={30} size={80} />);
    // Red color for score < 40
    let text = screen.getByText('30');
    expect(text.style.color).toBe('rgb(239, 68, 68)'); // Hex #EF4444

    rerender(<HealthScoreRing score={55} size={80} />);
    // Amber color for score 40-69
    text = screen.getByText('55');
    expect(text.style.color).toBe('rgb(245, 158, 11)'); // Hex #F59E0B

    rerender(<HealthScoreRing score={85} size={80} />);
    // Emerald color for score >= 70
    text = screen.getByText('85');
    expect(text.style.color).toBe('rgb(16, 185, 129)'); // Hex #10B981
  });

  it('should have zero WCAG 2.1 AA accessibility violations', async () => {
    const { container } = render(<HealthScoreRing score={85} size={80} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
