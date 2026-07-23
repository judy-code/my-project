// 面談風險警示（PRD 5.2）：等級定義與顯示門檻
export const MIN_REVIEWS_FOR_RISK = 5

export const RISK_LEVELS = {
  low: { label: '低風險', colorClass: 'bg-status-risk-low', description: '無負面預警，大多正向回饋' },
  medium: { label: '中風險', colorClass: 'bg-status-risk-medium', description: '存在零星負面回饋' },
  high: { label: '高風險', colorClass: 'bg-status-risk-high', description: '大多負面回饋' },
  insufficient: { label: '資料不足', colorClass: 'bg-status-risk-insufficient', description: '評價筆數低於 5 筆，暫不足以評估' },
}

/** 依 reviewCount／riskLevel 決定實際顯示的等級（未達門檻一律顯示「資料不足」） */
export function resolveRiskLevel(talent) {
  if (!talent?.riskLevel && !talent?.reviewCount) return null
  if (!talent.reviewCount || talent.reviewCount < MIN_REVIEWS_FOR_RISK) return 'insufficient'
  return talent.riskLevel ?? 'insufficient'
}
