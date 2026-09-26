// 共用於內容建置、檢查器與人工標記工具（ADR-0017）。
// 目前只有一位維護者，對照題雙審先保留設計、不啟用。
// 未來由維護者透過 PR 將此值改為 true，並補齊既有 reviewed 對照題的第二審核者。
export const REVIEW_POLICY = { controlRequiresSecondReview: false };
export type ReviewPolicy = typeof REVIEW_POLICY;

export function minimumReviewers(
  data: { isControl?: boolean; requiresSecondReview: boolean },
  policy: ReviewPolicy = REVIEW_POLICY,
): number {
  // 爭議保育內容原有的雙審要求不受對照題開關影響。
  return data.requiresSecondReview || (data.isControl && policy.controlRequiresSecondReview)
    ? 2
    : 1;
}
