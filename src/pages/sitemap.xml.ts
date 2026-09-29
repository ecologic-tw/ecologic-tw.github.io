import {
  getPublishedCases,
  getPublishedEntries,
  getPublishedScenarios,
  getPublishedToolkit,
  showDrafts,
} from '../lib/content.ts';
import { INDEX_PATHS, sitemapXml } from '../lib/site.ts';

export async function GET() {
  const entries = await getPublishedEntries();
  const scenarios = await getPublishedScenarios();
  const toolkit = await getPublishedToolkit();
  const cases = (await getPublishedCases()).filter((item) => item.data.status === 'reviewed');
  const paths = showDrafts
    ? []
    : [
        ...INDEX_PATHS,
        ...entries
          .filter((entry) => entry.data.status === 'reviewed')
          .map((entry) => `/guide/${entry.id}/`),
        ...scenarios
          .filter((scenario) => scenario.data.status === 'reviewed')
          .map((scenario) => `/scenario/${scenario.id}/`),
        ...toolkit
          .filter((item) => item.data.status === 'reviewed')
          .map((item) => `/toolkit/${item.id}/`),
        ...cases.map((item) => `/cases/${item.id}/`),
      ];
  return new Response(sitemapXml(paths), {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
