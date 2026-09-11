/**
 * @fileoverview Tests for ActionCard component
 * Covers: rendering, severity, accessibility, actions, confidence
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ActionCard from '../components/ActionCard';

const mockResult = {
  severity: 'HIGH',
  verified_facts: [
    'Bleeding uncontrolled after 10 minutes',
    'Child reports numbness',
    'Age 5: higher infection risk',
  ],
  actions: [
    { label: 'Go to ER', type: 'navigate', detail: 'Visit emergency room within 30 minutes.' },
    { label: 'Apply Pressure', type: 'reminder', detail: 'Use a clean cloth and press firmly.' },
  ],
  confidence: 87,
  why_this_matters: 'Fast action prevents infection and nerve damage.',
  cross_checks: ['Bleeding threshold exceeded', 'Age protocol applied'],
};

const criticalResult = {
  ...mockResult,
  severity: 'CRITICAL',
  confidence: 94,
};

describe('ActionCard — rendering', () => {
  it('renders the severity badge', () => {
    render(<ActionCard result={mockResult} onReset={vi.fn()} />);
    expect(screen.getByText('HIGH')).toBeInTheDocument();
  });

  it('renders all verified facts', () => {
    render(<ActionCard result={mockResult} onReset={vi.fn()} />);
    expect(screen.getByText(/Bleeding uncontrolled/)).toBeInTheDocument();
    expect(screen.getByText(/Child reports numbness/)).toBeInTheDocument();
    expect(screen.getByText(/Age 5/)).toBeInTheDocument();
  });

  it('renders all actions', () => {
    render(<ActionCard result={mockResult} onReset={vi.fn()} />);
    expect(screen.getByText('Go to ER')).toBeInTheDocument();
    expect(screen.getByText('Apply Pressure')).toBeInTheDocument();
  });

  it('renders the confidence percentage', () => {
    render(<ActionCard result={mockResult} onReset={vi.fn()} />);
    const confidenceElements = screen.getAllByText(/87%/);
    expect(confidenceElements.length).toBeGreaterThan(0);
  });

  it('renders "why this matters" footer', () => {
    render(<ActionCard result={mockResult} onReset={vi.fn()} />);
    expect(screen.getByText(/Fast action prevents/)).toBeInTheDocument();
  });

  it('renders CRITICAL severity correctly', () => {
    render(<ActionCard result={criticalResult} onReset={vi.fn()} />);
    expect(screen.getByText('CRITICAL')).toBeInTheDocument();
  });
});

describe('ActionCard — accessibility', () => {
  it('has a "Try Another Scenario" button accessible by role', () => {
    render(<ActionCard result={mockResult} onReset={vi.fn()} />);
    expect(screen.getByRole('button', { name: /try another/i })).toBeInTheDocument();
  });

  it('calls onReset when "Try Another Scenario" is clicked', () => {
    const onReset = vi.fn();
    render(<ActionCard result={mockResult} onReset={onReset} />);
    fireEvent.click(screen.getByRole('button', { name: /try another/i }));
    expect(onReset).toHaveBeenCalledTimes(1);
  });

  it('action buttons are keyboard accessible', () => {
    render(<ActionCard result={mockResult} onReset={vi.fn()} />);
    const actionBtn = screen.getByRole('button', { name: /go to er/i });
    expect(actionBtn).toBeInTheDocument();
    fireEvent.keyDown(actionBtn, { key: 'Enter', code: 'Enter' });
    // Should not throw
  });

  it('cross-checks section is toggleable', () => {
    render(<ActionCard result={mockResult} onReset={vi.fn()} />);
    const toggleBtn = screen.getByRole('button', { name: /show cross-verifications/i });
    expect(toggleBtn).toBeInTheDocument();
    fireEvent.click(toggleBtn);
    expect(screen.getByText(/Bleeding threshold exceeded/)).toBeInTheDocument();
  });
});

describe('ActionCard — edge cases', () => {
  it('handles empty verified_facts gracefully', () => {
    const result = { ...mockResult, verified_facts: [] };
    expect(() => render(<ActionCard result={result} onReset={vi.fn()} />)).not.toThrow();
  });

  it('handles empty actions gracefully', () => {
    const result = { ...mockResult, actions: [] };
    expect(() => render(<ActionCard result={result} onReset={vi.fn()} />)).not.toThrow();
  });

  it('handles missing cross_checks gracefully', () => {
    const result = { ...mockResult, cross_checks: undefined };
    expect(() => render(<ActionCard result={result} onReset={vi.fn()} />)).not.toThrow();
  });
});
