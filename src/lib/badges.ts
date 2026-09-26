// 徽章規則（docs/sdd/05）：只依學習里程碑發放，不依時間或頻率。純函式。
// 「手下留情」與「謬誤的謬誤」刻意獎勵不亂貼標籤（docs/sdd/08）。
import type { Progress } from './progress.ts';
import { NO_PROBLEM } from './quiz.ts';

export type ScenarioInfo = {
  id: string;
  theme: 'daily' | 'conservation';
  difficulty: 'basic' | 'advanced';
  isControl: boolean;
  answer: string;
};

export type ContentIndex = {
  scenarios: readonly ScenarioInfo[];
  /** 已發布的圖鑑卡 id */
  entries: readonly string[];
};

export const FALLACY_FALLACY = 'fallacy-fallacy';
export const GENTLE_CONTROL_COUNT = 3;
export const REPHRASER_COUNT = 5;

export const BADGES = [
  { id: 'first-step', title: '初入步道', condition: '完成第 1 題' },
  { id: 'daily-observer', title: '日常觀察者', condition: '完成日常主題的全部基礎題' },
  { id: 'conservation-observer', title: '保育觀察者', condition: '完成保育主題的全部基礎題' },
  {
    id: 'gentle',
    title: '手下留情',
    condition: `答對 ${GENTLE_CONTROL_COUNT} 題對照題，辨認出推理其實沒有問題`,
  },
  { id: 'rephraser', title: '換句話說', condition: `完成 ${REPHRASER_COUNT} 次改寫練習自評` },
  { id: 'collector', title: '圖鑑收藏家', condition: '點亮全部圖鑑卡' },
  {
    id: 'fallacy-of-fallacy',
    title: '謬誤的謬誤',
    condition: '讀完「謬誤謬誤」卡，並答對它的情境題',
  },
] as const;

export type BadgeId = (typeof BADGES)[number]['id'];

const correctlyAnswered = (p: Progress, id: string) => p.answered[id]?.correct === true;

/**
 * 點亮的圖鑑卡：答對以該卡為正解的情境題（docs/sdd/05「收集」），
 * 或完成卡內小檢核（存於 progress.collected，docs/sdd/02 規則 4）。只計目前已發布的卡。
 */
export function collectedEntries(p: Progress, index: ContentIndex): Set<string> {
  const published = new Set(index.entries);
  const lit = new Set(p.collected.filter((id) => published.has(id)));
  for (const s of index.scenarios) {
    if (s.answer !== NO_PROBLEM && published.has(s.answer) && correctlyAnswered(p, s.id)) {
      lit.add(s.answer);
    }
  }
  return lit;
}

function completedAllBasic(p: Progress, index: ContentIndex, theme: ScenarioInfo['theme']) {
  const basic = index.scenarios.filter((s) => s.theme === theme && s.difficulty === 'basic');
  return basic.length > 0 && basic.every((s) => s.id in p.answered);
}

const rules: Record<BadgeId, (p: Progress, index: ContentIndex) => boolean> = {
  'first-step': (p, index) => index.scenarios.some((s) => s.id in p.answered),
  'daily-observer': (p, index) => completedAllBasic(p, index, 'daily'),
  'conservation-observer': (p, index) => completedAllBasic(p, index, 'conservation'),
  gentle: (p, index) =>
    index.scenarios.filter((s) => s.isControl && correctlyAnswered(p, s.id)).length >=
    GENTLE_CONTROL_COUNT,
  rephraser: (p) => p.rewrites >= REPHRASER_COUNT,
  collector: (p, index) =>
    index.entries.length > 0 && collectedEntries(p, index).size === index.entries.length,
  'fallacy-of-fallacy': (p, index) =>
    p.read.includes(FALLACY_FALLACY) &&
    index.scenarios.some((s) => s.answer === FALLACY_FALLACY && correctlyAnswered(p, s.id)),
};

/** 依目前進度符合條件的徽章（尚未合併先前已得的徽章） */
export function earnedBadges(p: Progress, index: ContentIndex): BadgeId[] {
  return BADGES.filter((b) => rules[b.id](p, index)).map((b) => b.id);
}
