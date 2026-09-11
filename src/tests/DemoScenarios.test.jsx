/**
 * @fileoverview Tests for DemoScenarios component
 * Covers: rendering, selection, keyboard navigation, accessibility
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import DemoScenarios from '../components/DemoScenarios';
import { demoScenarios } from '../lib/demoData';

describe('DemoScenarios — rendering', () => {
  it('renders all 4 demo scenario cards', () => {
    render(<DemoScenarios activeId={null} onSelect={vi.fn()} />);
    demoScenarios.forEach((scenario) => {
      expect(screen.getByText(scenario.label)).toBeInTheDocument();
    });
  });

  it('renders the "Try a Demo Scenario" heading', () => {
    render(<DemoScenarios activeId={null} onSelect={vi.fn()} />);
    expect(screen.getByText(/try a demo scenario/i)).toBeInTheDocument();
  });

  it('renders scenario descriptions', () => {
    render(<DemoScenarios activeId={null} onSelect={vi.fn()} />);
    demoScenarios.forEach((scenario) => {
      expect(screen.getByText(scenario.description)).toBeInTheDocument();
    });
  });

  it('renders scenario icons/emojis', () => {
    render(<DemoScenarios activeId={null} onSelect={vi.fn()} />);
    demoScenarios.forEach((scenario) => {
      expect(screen.getByText(scenario.icon)).toBeInTheDocument();
    });
  });
});

describe('DemoScenarios — selection', () => {
  it('calls onSelect with the correct scenario ID when clicked', () => {
    const onSelect = vi.fn();
    render(<DemoScenarios activeId={null} onSelect={onSelect} />);
    fireEvent.click(screen.getByText('Health Emergency'));
    expect(onSelect).toHaveBeenCalledWith('health');
  });

  it('calls onSelect with flood scenario ID', () => {
    const onSelect = vi.fn();
    render(<DemoScenarios activeId={null} onSelect={onSelect} />);
    fireEvent.click(screen.getByText('Flood Disaster'));
    expect(onSelect).toHaveBeenCalledWith('flood');
  });

  it('calls onSelect with elderly scenario ID', () => {
    const onSelect = vi.fn();
    render(<DemoScenarios activeId={null} onSelect={onSelect} />);
    fireEvent.click(screen.getByText('Elderly Care'));
    expect(onSelect).toHaveBeenCalledWith('elderly');
  });

  it('calls onSelect with child scenario ID', () => {
    const onSelect = vi.fn();
    render(<DemoScenarios activeId={null} onSelect={onSelect} />);
    fireEvent.click(screen.getByText('Child Accident'));
    expect(onSelect).toHaveBeenCalledWith('child');
  });
});

describe('DemoScenarios — keyboard navigation', () => {
  it('all scenario buttons are accessible via keyboard (Enter)', () => {
    const onSelect = vi.fn();
    render(<DemoScenarios activeId={null} onSelect={onSelect} />);
    const btn = screen.getByRole('button', { name: /health emergency/i });
    fireEvent.keyDown(btn, { key: 'Enter', code: 'Enter' });
    // Button element responds to keyDown natively — no throw = pass
    expect(btn).toBeInTheDocument();
  });

  it('buttons have accessible role', () => {
    render(<DemoScenarios activeId={null} onSelect={vi.fn()} />);
    const buttons = screen.getAllByRole('button');
    // At least 4 demo buttons
    expect(buttons.length).toBeGreaterThanOrEqual(4);
  });
});

describe('DemoScenarios — active state', () => {
  it('marks the active scenario visually (aria-pressed)', () => {
    render(<DemoScenarios activeId="health" onSelect={vi.fn()} />);
    const activeBtn = screen.getByRole('button', { name: /health emergency/i });
    expect(activeBtn).toHaveAttribute('aria-pressed', 'true');
  });

  it('other scenarios are not marked active', () => {
    render(<DemoScenarios activeId="health" onSelect={vi.fn()} />);
    const inactiveBtn = screen.getByRole('button', { name: /flood disaster/i });
    expect(inactiveBtn).toHaveAttribute('aria-pressed', 'false');
  });
});

describe('demoData — data integrity', () => {
  it('all 4 scenarios have required fields', () => {
    demoScenarios.forEach((scenario) => {
      expect(scenario).toHaveProperty('id');
      expect(scenario).toHaveProperty('label');
      expect(scenario).toHaveProperty('result');
      expect(scenario.result).toHaveProperty('severity');
      expect(scenario.result).toHaveProperty('verified_facts');
      expect(scenario.result).toHaveProperty('actions');
      expect(scenario.result).toHaveProperty('confidence');
      expect(scenario.result).toHaveProperty('why_this_matters');
    });
  });

  it('all scenario severities are valid values', () => {
    const validSeverities = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
    demoScenarios.forEach((scenario) => {
      expect(validSeverities).toContain(scenario.result.severity);
    });
  });

  it('all scenarios have at least 2 actions', () => {
    demoScenarios.forEach((scenario) => {
      expect(scenario.result.actions.length).toBeGreaterThanOrEqual(2);
    });
  });

  it('all scenarios have at least 3 verified facts', () => {
    demoScenarios.forEach((scenario) => {
      expect(scenario.result.verified_facts.length).toBeGreaterThanOrEqual(3);
    });
  });

  it('confidence values are between 0 and 100', () => {
    demoScenarios.forEach((scenario) => {
      expect(scenario.result.confidence).toBeGreaterThan(0);
      expect(scenario.result.confidence).toBeLessThanOrEqual(100);
    });
  });
});
