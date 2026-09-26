import { showDrafts } from '../lib/content.ts';
import { SITE_URL } from '../lib/site.ts';

export function GET() {
  const text = showDrafts
    ? 'User-agent: *\nDisallow: /\n'
    : `User-agent: *\nAllow: /\nSitemap: ${SITE_URL}/sitemap.xml\n`;
  return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
