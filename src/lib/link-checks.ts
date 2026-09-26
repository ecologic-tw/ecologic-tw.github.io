export type LinkResult = {
  url: string;
  outcome: 'ok' | 'broken' | 'manual';
  status?: number;
  detail: string;
};

export function classifyStatus(status: number): LinkResult['outcome'] {
  if (status >= 200 && status < 300) return 'ok';
  if ([401, 403, 408, 425, 429].includes(status) || status >= 500) return 'manual';
  return 'broken';
}

/** GET 可處理不支援 HEAD 的出版網站；只讀 headers 並取消本文下載。 */
export async function checkLink(url: string, request: typeof fetch = fetch): Promise<LinkResult> {
  try {
    const parsed = new URL(url);
    if (!['https:', 'http:'].includes(parsed.protocol) || parsed.username || parsed.password)
      return { url, outcome: 'broken', detail: '僅允許無帳密的 HTTP(S) URL' };
    const response = await request(url, {
      signal: AbortSignal.timeout(15000),
      redirect: 'follow',
      headers: {
        'User-Agent': 'EcoLogic-Source-Check/1.0',
        Accept: 'text/html,application/pdf,*/*',
      },
    });
    await response.body?.cancel();
    return {
      url,
      status: response.status,
      outcome: classifyStatus(response.status),
      detail: response.url || url,
    };
  } catch (error) {
    return { url, outcome: 'manual', detail: error instanceof Error ? error.message : '連線失敗' };
  }
}

export async function checkLinks(
  urls: string[],
  request: typeof fetch = fetch,
): Promise<LinkResult[]> {
  const unique = [...new Set(urls)].sort();
  const results: LinkResult[] = [];
  let cursor = 0;
  await Promise.all(
    Array.from({ length: Math.min(3, unique.length) }, async () => {
      while (cursor < unique.length) {
        const url = unique[cursor++];
        if (url) results.push(await checkLink(url, request));
      }
    }),
  );
  return results.sort((a, b) => a.url.localeCompare(b.url));
}
