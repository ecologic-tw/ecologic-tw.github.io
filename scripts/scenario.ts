// 不完整提案放在 contributions/，不載入正式網站。永不標為 reviewed。
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parse, parseDocument, stringify } from 'yaml';
import { loadContent } from './load-content.ts';
import { SCENARIO_FORMATS, scenarioSchema } from '../src/lib/content-schema.ts';
import { checkContent } from '../src/lib/content-checks.ts';
import { splitSections } from '../src/lib/scenario-sections.ts';

const hash = (text: string) => createHash('sha256').update(text).digest('hex');
const today = () => new Date().toISOString().slice(0, 10);
function proposalPath(root: string, slug: string): string {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error('提案名稱請用小寫英數及連字號');
  return join(root, 'contributions/scenarios', `${slug}.md`);
}
function scenarioPath(root: string, id: string): string {
  if (!/^(daily|cons)-\d{3}$/.test(id)) throw new Error('題號格式需為 daily-001 或 cons-001');
  return join(root, 'src/content/scenarios/zh-TW', `${id}.md`);
}
function readDocument(text: string) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(text);
  if (!match) throw new Error('提案需有 YAML 頂端欄位');
  const data: unknown = parse(match[1] ?? '');
  if (!data || typeof data !== 'object' || Array.isArray(data))
    throw new Error('YAML 必須為欄位物件');
  return { data: data as Record<string, unknown>, body: match[2] ?? '', yaml: match[1] ?? '' };
}
const documentText = (data: Record<string, unknown>, body: string) =>
  `---\n${stringify(data)}---\n${body}`;

export type ProposalOptions = {
  theme?: string;
  title?: string;
  target?: string;
  contributor?: string;
  contribution?: string;
  ai?: boolean;
  /** 題型（ADR-0022），預設 judge */
  format?: string;
};

// 各題型的空白欄位；judge 以外的題型只出現在進階模式。
// validity-soundness 與 choice 的改寫練習為選填，需要時再自行加上 betterPhrasing、checklist。
function formatFields(format: string): Record<string, unknown> {
  if (format === 'multi')
    return {
      format,
      answers: [],
      acceptable: [],
      distractors: [],
      notes: {},
      difficulty: 'advanced',
      betterPhrasing: [],
      checklist: [],
    };
  if (format === 'validity-soundness')
    return {
      format,
      validity: '',
      premises: '',
      notes: { validity: '', premises: '' },
      difficulty: 'advanced',
    };
  if (format === 'choice')
    return { format, task: '', prompt: '', choices: [], difficulty: 'advanced' };
  return { answer: '', distractors: [], difficulty: 'basic', betterPhrasing: [], checklist: [] };
}
export function createProposal(root: string, slug: string, options: ProposalOptions) {
  const file = proposalPath(root, slug);
  if (existsSync(file)) throw new Error('提案已存在，請編輯原檔或另取名稱');
  if (!!options.contributor !== !!options.contribution)
    throw new Error('署名需同時提供 --contributor 與 --contribution，或兩者都不填');
  let data: Record<string, unknown>;
  let body: string;
  if (options.target && options.format) throw new Error('修訂提案沿用原題題型，不可指定 --format');
  if (options.target) {
    const text = readFileSync(scenarioPath(root, options.target), 'utf8');
    const original = readDocument(text);
    data = { ...original.data, target: options.target, baseHash: hash(text) };
    body = original.body;
  } else {
    if (!['daily', 'conservation'].includes(options.theme ?? '') || !options.title?.trim())
      throw new Error('新提案需 --theme daily|conservation 與 --title 標題');
    const format = options.format ?? 'judge';
    if (!(SCENARIO_FORMATS as readonly string[]).includes(format))
      throw new Error(`--format 需為 ${SCENARIO_FORMATS.join('|')}`);
    data = {
      title: options.title,
      theme: options.theme,
      ...formatFields(format),
      terms: [],
      sources: [],
      contributors: [],
      aiAssisted: false,
      requiresSecondReview: false,
    };
    body = '\n## 情境\n\n## 解說\n\n## 進階解說\n';
  }
  delete data.id;
  data.status = 'draft';
  data.reviewers = [];
  data.updated = today();
  data.nextSteps = options.target
    ? ['描述要修改的部分；修改後請重新檢查答案、來源與署名']
    : ['先寫一段虛構情境，其餘欄位可由其他人接力補齊'];
  if (options.ai) data.aiAssisted = true;
  if (options.contributor && options.contribution)
    data.contributors = [
      ...(Array.isArray(data.contributors) ? data.contributors : []),
      { name: options.contributor, contribution: options.contribution },
    ];
  mkdirSync(join(root, 'contributions/scenarios'), { recursive: true });
  writeFileSync(file, documentText(data, body), { flag: 'wx' });
  return file;
}

export function preparePromotion(root: string, slug: string) {
  const proposal = proposalPath(root, slug);
  const { data, body, yaml } = readDocument(readFileSync(proposal, 'utf8'));
  if (data.promotedTo)
    throw new Error(`已轉入 ${String(data.promotedTo)}；後續請用 edit 建立新修訂提案`);
  const input = loadContent(join(root, 'src/content'));
  let id: string;
  if (data.target !== undefined) {
    id = String(data.target);
    const current = readFileSync(scenarioPath(root, id), 'utf8');
    if (data.baseHash !== hash(current))
      throw new Error(
        '原題已變動，請先將最新原題與提案人工整合，再建立新的 edit 提案；不可覆寫他人的修改',
      );
    const original = scenarioSchema.parse(readDocument(current).data);
    if (data.theme !== original.theme) throw new Error('修訂提案不可變更原題主題');
    if (original.aiAssisted) data.aiAssisted = true;
    if (original.requiresSecondReview) data.requiresSecondReview = true;
  } else {
    const prefix = data.theme === 'daily' ? 'daily' : 'cons';
    const numbers = input.scenarios
      .map((doc) => String((doc.data as { id: string }).id))
      .filter((value) => value.startsWith(`${prefix}-`))
      .map((value) => Number(value.split('-')[1]));
    const next = Math.max(0, ...numbers) + 1;
    if (next > 999) throw new Error('目前題號已超過三位數，需先調整規格');
    id = `${prefix}-${String(next).padStart(3, '0')}`;
  }
  const candidate = Object.fromEntries(
    Object.entries(data).filter(
      ([key]) => !['target', 'baseHash', 'nextSteps', 'promotedTo'].includes(key),
    ),
  );
  Object.assign(candidate, {
    id,
    status: 'draft',
    reviewers: [],
    updated: today(),
    // 對照題只存在於 judge 題（ADR-0022）
    isControl: (data.format ?? 'judge') === 'judge' && data.answer === 'none',
  });
  const parsed = scenarioSchema.safeParse(candidate);
  const issues = parsed.success
    ? []
    : parsed.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`);
  if (!String(data.title ?? '').trim()) issues.push('title: 請補標題');
  if ((data.format ?? 'judge') === 'judge' && !String(data.answer ?? '').trim())
    issues.push('answer: 請補圖鑑卡 ID 或 none');
  const sections = splitSections(body);
  for (const name of ['情境', '解說'])
    if (!sections.get(name)?.trim()) issues.push(`本文: 請補「## ${name}」`);
  for (const key of ['betterPhrasing', 'checklist', 'distractors', 'answers', 'acceptable']) {
    if (
      Array.isArray(data[key]) &&
      data[key].some((value) => typeof value !== 'string' || !value.trim())
    )
      issues.push(`${key}: 不可用空白項目充數`);
  }
  if (Array.isArray(data.nextSteps) && data.nextSteps.length > 0)
    issues.push('nextSteps: 請完成或移交剩餘待辦，確認後改為 [] 才轉入正式草稿');
  if (data.nextSteps !== undefined && !Array.isArray(data.nextSteps))
    issues.push('nextSteps: 請使用 YAML 清單；沒有待辦時填 []');
  const file = scenarioPath(root, id);
  if (issues.length === 0 && parsed.success) {
    const updated = { file, fileId: id, data: parsed.data, body };
    input.scenarios = input.scenarios.filter((doc) => (doc.data as { id: string }).id !== id);
    input.scenarios.push(updated);
    const checked = checkContent(input);
    issues.push(...checked.errors);
  }
  const draftDocument = parseDocument(yaml);
  for (const key of ['target', 'baseHash', 'nextSteps', 'promotedTo']) draftDocument.delete(key);
  for (const key of [
    'id',
    'status',
    'reviewers',
    'updated',
    'isControl',
    'aiAssisted',
    'requiresSecondReview',
  ]) {
    if (candidate[key] !== undefined) draftDocument.set(key, candidate[key]);
  }
  const proposalDocument = parseDocument(yaml);
  proposalDocument.set('promotedTo', id);
  return {
    id,
    file,
    proposal,
    issues,
    text: `---\n${draftDocument.toString()}---\n${body}`,
    proposalText: `---\n${proposalDocument.toString()}---\n${body}`,
    replacing: data.target !== undefined,
  };
}

export function promoteProposal(root: string, slug: string, dryRun = false) {
  const plan = preparePromotion(root, slug);
  if (plan.issues.length) throw new Error(`待補項目：\n- ${plan.issues.join('\n- ')}`);
  if (!dryRun) {
    // 新題使用 wx，避免並行工作時覆蓋同題號；修訂題已核對原始內容 hash。
    writeFileSync(plan.file, plan.text, { flag: plan.replacing ? 'w' : 'wx' });
    writeFileSync(plan.proposal, plan.proposalText);
  }
  return plan;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    const args = process.argv.slice(2);
    const command = args.shift();
    const positionals: string[] = [];
    const flags = new Map<string, string>();
    for (let i = 0; i < args.length; i++) {
      const arg = args[i] ?? '';
      if (['--ai', '--dry-run'].includes(arg)) flags.set(arg, 'true');
      else if (
        ['--title', '--theme', '--format', '--contributor', '--contribution'].includes(arg)
      ) {
        const value = args[++i];
        if (!value || value.startsWith('--')) throw new Error(`${arg} 缺少值`);
        flags.set(arg, value);
      } else if (arg.startsWith('--')) throw new Error(`未知選項 ${arg}`);
      else positionals.push(arg);
    }
    const root = process.cwd();
    if (command === 'new' || command === 'edit') {
      if (flags.has('--dry-run'))
        throw new Error('--dry-run 僅適用 promote；new/edit 不會修改正式內容');
      const slug = positionals[command === 'edit' ? 1 : 0];
      if (!slug)
        throw new Error(
          '用法：scenario new <提案名稱> --theme daily --title 標題 [--format multi]；或 scenario edit <題號> <提案名稱>',
        );
      console.log(
        createProposal(root, slug, {
          theme: flags.get('--theme'),
          title: flags.get('--title'),
          target: command === 'edit' ? positionals[0] : undefined,
          contributor: flags.get('--contributor'),
          contribution: flags.get('--contribution'),
          ai: flags.has('--ai'),
          format: flags.get('--format'),
        }),
      );
      console.log('已建立可不完整的提案；先補自己想做的部分，留下 nextSteps 讓其他人接力。');
    } else if (command === 'check' || command === 'promote') {
      const slug = positionals[0];
      if (!slug) throw new Error('請提供提案名稱');
      const plan =
        command === 'check'
          ? preparePromotion(root, slug)
          : promoteProposal(root, slug, flags.has('--dry-run'));
      if (plan.issues.length)
        console.log(`待補項目（提案可先提交，不影響正式建置）：\n- ${plan.issues.join('\n- ')}`);
      else
        console.log(
          `${command === 'check' || flags.has('--dry-run') ? '可轉入，未寫入' : '已轉入 draft'}：${plan.file}\n請再執行 npm run check；只有人工可標記 reviewed。`,
        );
    } else throw new Error('用法：npm run scenario -- new|edit|check|promote …');
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}
