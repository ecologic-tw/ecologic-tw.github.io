import { expect, it, vi } from 'vitest';
import { checkLink, checkLinks, classifyStatus } from '../../src/lib/link-checks.ts';

it('distinguishes broken links from blocking or temporary failures', () => {
  expect(classifyStatus(200)).toBe('ok');
  expect(classifyStatus(404)).toBe('broken');
  expect(classifyStatus(410)).toBe('broken');
  for (const status of [403, 429, 503]) expect(classifyStatus(status)).toBe('manual');
});
it('records network errors as manual review and rejects non-web URLs', async () => {
  const request = vi.fn<typeof fetch>().mockRejectedValue(new Error('timeout'));
  expect((await checkLink('https://example.org', request)).outcome).toBe('manual');
  expect((await checkLink('file:///tmp/test', request)).outcome).toBe('broken');
  expect(request).toHaveBeenCalledTimes(1);
});
it('deduplicates requests and cancels response bodies', async () => {
  const cancel = vi.fn();
  const request = vi.fn<typeof fetch>().mockResolvedValue({
    status: 200,
    url: 'https://example.org/',
    body: { cancel },
  } as unknown as Response);
  const results = await checkLinks(['https://example.org/', 'https://example.org/'], request);
  expect(results).toHaveLength(1);
  expect(cancel).toHaveBeenCalledTimes(1);
});
