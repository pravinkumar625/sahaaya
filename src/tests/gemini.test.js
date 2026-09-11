/**
 * @fileoverview Tests for the Gemini API client utility
 * Covers: input validation, security checks, response parsing
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { callGemini, fileToBase64 } from '../lib/gemini';

describe('callGemini — input validation', () => {
  it('throws when no API key is provided', async () => {
    await expect(
      callGemini({ text: 'test' }, '')
    ).rejects.toThrow('No API key provided');
  });

  it('throws when API key is undefined', async () => {
    await expect(
      callGemini({ text: 'test' }, undefined)
    ).rejects.toThrow('No API key provided');
  });

  it('throws when API key is null', async () => {
    await expect(
      callGemini({ text: 'test' }, null)
    ).rejects.toThrow('No API key provided');
  });
});

describe('callGemini — API error handling', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('throws a descriptive error when Gemini returns 400', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ error: { message: 'Invalid request' } }),
    });

    await expect(
      callGemini({ text: 'test' }, 'valid-api-key')
    ).rejects.toThrow('Invalid request');
  });

  it('throws when response has no candidates', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ candidates: [] }),
    });

    await expect(
      callGemini({ text: 'test' }, 'valid-api-key')
    ).rejects.toThrow('No response from Gemini');
  });

  it('throws when Gemini response cannot be parsed as JSON', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        candidates: [{ content: { parts: [{ text: 'This is not JSON' }] } }],
      }),
    });

    await expect(
      callGemini({ text: 'test' }, 'valid-api-key')
    ).rejects.toThrow('Could not parse structured response from Gemini');
  });

  it('returns parsed result when Gemini returns valid JSON', async () => {
    const mockResult = {
      severity: 'HIGH',
      verified_facts: ['fact 1', 'fact 2'],
      actions: [{ label: 'Call 112', type: 'call', detail: 'Call immediately' }],
      confidence: 88,
      why_this_matters: 'Lives at stake.',
      cross_checks: ['Check 1'],
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        candidates: [{ content: { parts: [{ text: JSON.stringify(mockResult) }] } }],
      }),
    });

    const result = await callGemini({ text: 'I feel sick' }, 'valid-api-key');
    expect(result.severity).toBe('HIGH');
    expect(result.confidence).toBe(88);
    expect(result.actions).toHaveLength(1);
  });

  it('builds correct fetch call with text input', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        candidates: [{ content: { parts: [{ text: '{"severity":"LOW","verified_facts":[],"actions":[],"confidence":50,"why_this_matters":"test","cross_checks":[]}' }] } }],
      }),
    });

    await callGemini({ text: 'test input', contextActive: false }, 'my-api-key');

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('generativelanguage.googleapis.com'),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
      })
    );
  });
});

describe('callGemini — security', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('API key is passed as URL query param, NOT in request body', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        candidates: [{ content: { parts: [{ text: '{"severity":"LOW","verified_facts":[],"actions":[],"confidence":50,"why_this_matters":"ok","cross_checks":[]}' }] } }],
      }),
    });

    await callGemini({ text: 'test' }, 'secret-key-12345');

    const [url, options] = fetch.mock.calls[0];
    expect(url).toContain('secret-key-12345');

    const body = JSON.parse(options.body);
    const allText = JSON.stringify(body);
    expect(allText).not.toContain('secret-key-12345');
  });
});

describe('fileToBase64', () => {
  it('strips the data URL prefix and returns only base64 data', async () => {
    const mockFile = new File(['hello'], 'test.jpg', { type: 'image/jpeg' });

    // Mock FileReader
    const mockReader = {
      onload: null,
      onerror: null,
      readAsDataURL: vi.fn(function () {
        setTimeout(() => {
          this.result = 'data:image/jpeg;base64,aGVsbG8=';
          this.onload();
        }, 0);
      }),
    };

    vi.stubGlobal('FileReader', vi.fn(() => mockReader));

    const result = await fileToBase64(mockFile);
    expect(result).toBe('aGVsbG8=');
    expect(result).not.toContain('data:');
    expect(result).not.toContain('base64,');

    vi.unstubAllGlobals();
  });
});
