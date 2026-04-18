import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { apiFetch } from '../../src/api/client.js';

describe('apiFetch — BASE_URL bug', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('sends requests to the correct backend port 3001', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ ok: true }), { status: 200 })
    );

    await apiFetch('/products');

    const calledUrl = vi.mocked(fetch).mock.calls[0][0] as string;
    expect(calledUrl).toContain('3001');
  });
});
