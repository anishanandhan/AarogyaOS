import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import CostAnalysisWidget from '../../../frontend/src/components/CostAnalysisWidget';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('CostAnalysisWidget Component Tests', () => {
  it('should render correct English title and content by default', () => {
    render(<CostAnalysisWidget language="en" />);
    expect(screen.getByText('Operational Cost Projection (Vellore District)')).toBeInTheDocument();
    expect(screen.getByText('ESTIMATED RUN RATE')).toBeInTheDocument();
    expect(screen.getByText('₹12,860')).toBeInTheDocument();
  });

  it('should render correct Hindi translation when specified', () => {
    render(<CostAnalysisWidget language="hi" />);
    expect(screen.getByText('परिचालन लागत अनुमान (वेल्लोर जिला)')).toBeInTheDocument();
  });

  it('should render correct Tamil translation when specified', () => {
    render(<CostAnalysisWidget language="ta" />);
    expect(screen.getByText('செயல்பாட்டுச் செலவு கணிப்பு (வேலூர் மாவட்டம்)')).toBeInTheDocument();
  });

  it('should list all the cost breakdown items', () => {
    render(<CostAnalysisWidget language="en" />);
    expect(screen.getByText('Offline JSON Database Storage')).toBeInTheDocument();
    expect(screen.getByText('₹2,920')).toBeInTheDocument();
  });

  it('should have zero WCAG 2.1 AA accessibility violations', async () => {
    const { container } = render(<CostAnalysisWidget language="en" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
