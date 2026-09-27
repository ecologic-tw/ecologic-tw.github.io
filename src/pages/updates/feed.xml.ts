// Atom 訂閱源（ADR-0024）：只含已審內容與手寫說明；含草稿的建置輸出空的訂閱源。
import {
  getPublishedEntries,
  getPublishedScenarios,
  getPublishedTerms,
  getUpdateNotes,
  showDrafts,
} from '../../lib/content.ts';
import { atomFeed, contentUpdates, noteUpdates } from '../../lib/updates.ts';

export async function GET() {
  const reviewed = <T extends { data: { status: string } }>(docs: T[]) =>
    docs.filter((doc) => doc.data.status === 'reviewed');
  const items = showDrafts
    ? []
    : [
        ...noteUpdates(await getUpdateNotes()),
        ...contentUpdates('entry', reviewed(await getPublishedEntries())).items,
        ...contentUpdates('scenario', reviewed(await getPublishedScenarios())).items,
        ...contentUpdates('term', reviewed(await getPublishedTerms())).items,
      ];
  return new Response(atomFeed(items), {
    headers: { 'Content-Type': 'application/atom+xml; charset=utf-8' },
  });
}
