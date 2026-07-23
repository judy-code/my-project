// 面談邀請與評分機制用的固定選項（PRD 5.3／5.4）

export const INTERVIEW_FORMAT_OPTIONS = ['現場', '視訊', '電話']

// 5.4.3 Step 0（由 Sender 填答）／Step 1
export const ATTENDANCE_QUESTION = {
  q: '對方有出席嗎？',
  opts: ['有出席', '未出席'],
}
export const ATTENDANCE_NOTICE_QUESTION = {
  q: '是否有提前告知？',
  opts: ['有告知', '未告知'],
}
export const PUNCTUALITY_QUESTION = {
  q: '面談是否準時開始？',
  opts: ['準時', '未準時但尚可接受', '遲到'],
}

// 5.4.4 評分維度評價設計：Sender 填答（評價 Talent）
export const SENDER_RATING_DIMENSIONS = [
  {
    key: '尊重度',
    positive: ['儀態得體', '適當對應', '真誠回饋'],
    negative: ['禮儀欠佳', '態度輕率', '對職缺或公司明顯不了解'],
  },
  {
    key: '專業度',
    positive: ['邏輯清晰', '準備充分', '經驗敘述具體'],
    negative: ['邏輯混亂反覆', '內容空泛', '履歷過度包裝'],
  },
  {
    key: '穩定度',
    positive: ['動機明確', '主動提問', '開放溝通合理期待'],
    negative: ['求職動機模糊', '被動回應', '過度期待'],
  },
  {
    key: '契合度',
    positive: ['與團隊價值觀相符', '溝通風格契合', '願意接受回饋', '具有合作意識'],
    negative: ['過度強勢', '抗拒回饋或防禦性強', '溝通方式不易合作', '與團隊文化明顯不合'],
  },
]

// 5.4.4 評分維度評價設計：Talent 填答（評價 Sender），供未來若開放 Talent 視角評分時使用
export const TALENT_RATING_DIMENSIONS = [
  {
    key: '尊重度',
    positive: ['環境適切', '專注傾聽', '流程清晰', '態度友善'],
    negative: ['詢問隱私(家庭感情/政治傾向等)', '態度輕率心不在焉', '言語冒犯', '頻繁插話'],
  },
  {
    key: '專業度',
    positive: ['事前有閱讀履歷', '清楚說明職務內容與期待', '提問內容專業有深度', '給予具體回饋'],
    negative: ['沒看過履歷', '無法說明職務或內容模糊', '問題發散無重點', '開空頭支票、過度包裝職務'],
  },
  {
    key: '透明度',
    positive: ['決策角色與決策點明確', '分享團隊現況(共事氛圍與挑戰)', '對大部分的提問能給出具體回答', '明確告知後續流程與評估方向'],
    negative: ['對關鍵問題迴避或模糊帶過', '刊登資訊與實際內容不一致', '無法說明升遷或評估標準'],
  },
  {
    key: '感受度',
    positive: ['面試過程讓人有收穫', '願意再次申請或推薦他人', '面試體驗流暢、專業'],
    negative: ['感受不到誠意', '面試流程繁瑣或重複無意義', '浪費時間，不會想再次應徵'],
  },
]
