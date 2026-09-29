// 我的應對工具箱（ADR-0037）：點亮的謬誤、偏誤卡，把「善意回應法」收進工具箱。純函式。
// 這支模組會打包進前端，不可 import content-schema（會把完整 zod 帶進瀏覽器）。

/** 有善意回應法、會進入工具箱的卡別（謬誤與偏誤卡必填 charitableResponse） */
export const TOOL_KINDS = ['formal-fallacy', 'informal-fallacy', 'bias'] as const;

export function isToolKind(kind: string): boolean {
  return (TOOL_KINDS as readonly string[]).includes(kind);
}

/** 已收進工具箱的卡 id：工具清單中已點亮的，保留工具清單的順序 */
export function ownedTools(toolIds: readonly string[], lit: ReadonlySet<string>): string[] {
  return toolIds.filter((id) => lit.has(id));
}
