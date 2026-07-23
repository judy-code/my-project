import { blankCardData } from './initialState'
import { MAX_JOB_CARDS } from '@/data/jobCardOptions'

export function appReducer(state, action) {
  switch (action.type) {
    case 'ENTER_APP':
      return { ...state, isLoggedIn: action.loggedIn, user: action.user ?? null }
    case 'LOGOUT':
      return { ...state, isLoggedIn: false, user: null }
    case 'OPEN_AUTH_DIALOG':
      return { ...state, authDialogOpen: true }
    case 'CLOSE_AUTH_DIALOG':
      return { ...state, authDialogOpen: false }

    case 'SET_CARD_DATA':
      return { ...state, cardData: action.payload }

    case 'RESET_CARD_DATA':
      return { ...state, cardData: blankCardData() }

    // ---- 探索 / 保留區 ----
    case 'ADD_KEEP': {
      if (state.keepList.some((t) => t.id === action.talent.id)) return state
      return { ...state, keepList: [...state.keepList, action.talent] }
    }
    case 'REMOVE_TALENT': {
      return { ...state, talentPool: state.talentPool.filter((t) => t.id !== action.id) }
    }
    case 'MARK_KEEP_INVITE_SENT': {
      return {
        ...state,
        keepList: state.keepList.map((t) => (t.id === action.id ? { ...t, inviteSent: true } : t)),
      }
    }

    // ---- 篩選 ----
    case 'SET_FILTER_STATE':
      return { ...state, filterState: { ...state.filterState, ...action.payload } }
    case 'RESET_FILTER':
      return { ...state, filterState: { titleKw: '', skill: '', locs: [], sal: '', salUnit: 'year' } }

    // ---- 探索視角 ----
    case 'SET_EXPLORE_PERSPECTIVE':
      return { ...state, explorePerspective: action.value }

    // ---- 關注（需求名片） ----
    case 'FOLLOW_JOB_CARD': {
      if (state.followedJobCards.some((j) => j.id === action.jobCard.id)) return state
      return { ...state, followedJobCards: [...state.followedJobCards, action.jobCard] }
    }
    case 'UNFOLLOW_JOB_CARD': {
      return { ...state, followedJobCards: state.followedJobCards.filter((j) => j.id !== action.id) }
    }

    // ---- 名片夾 / 黑名單 ----
    case 'SET_CARDBOX_FOLDER': {
      return {
        ...state,
        cardBoxList: state.cardBoxList.map((t) => (t.id === action.id ? { ...t, folder: action.folder } : t)),
      }
    }
    case 'MOVE_CARDBOX_TO_BLOCK': {
      const item = state.cardBoxList.find((t) => t.id === action.id)
      if (!item) return state
      return {
        ...state,
        cardBoxList: state.cardBoxList.filter((t) => t.id !== action.id),
        blockList: [...state.blockList, item],
      }
    }
    case 'MOVE_BLOCK_TO_CARDBOX': {
      const item = state.blockList.find((t) => t.id === action.id)
      if (!item) return state
      return {
        ...state,
        blockList: state.blockList.filter((t) => t.id !== action.id),
        cardBoxList: [...state.cardBoxList, item],
      }
    }
    case 'REMOVE_FROM_LIST': {
      return { ...state, [action.list]: state[action.list].filter((t) => t.id !== action.id) }
    }

    // ---- 資料夾 ----
    case 'ADD_FOLDER': {
      const name = action.name.trim()
      if (!name || state.folders.includes(name)) return state
      return { ...state, folders: [...state.folders, name] }
    }
    case 'DELETE_FOLDER': {
      return { ...state, folders: state.folders.filter((_, i) => i !== action.index) }
    }

    // ---- 邀請 ----
    case 'ACCEPT_INVITE': {
      const invite = state.invites.find((i) => i.id === action.inviteId)
      if (!invite) return state
      const newCard = {
        id: action.newThreadId + 1,
        name: invite.from,
        ini: invite.av.slice(0, 1),
        title: invite.role,
        company: invite.company,
        lang: invite.card?.lang || [],
        skills: invite.card?.skills || [],
        goodAt: invite.card?.goodAt || '',
        wantTo: invite.card?.wantTo || '',
        ai: invite.ai,
        folder: '',
      }
      const newThread = {
        id: action.newThreadId,
        name: invite.from,
        company: invite.company,
        preview: '名片交換成功！',
        time: '剛剛',
        unread: true,
        av: invite.av,
        ai: invite.ai,
        msgs: [{ f: 'sys', t: '名片交換成功，對話已開啟' }],
        unlockSent: false,
        unlockDone: false,
      }
      return {
        ...state,
        invites: state.invites.map((i) => (i.id === invite.id ? { ...i, status: 'accepted' } : i)),
        cardBoxList: [...state.cardBoxList, newCard],
        chatThreads: [...state.chatThreads, newThread],
      }
    }
    case 'REJECT_INVITE': {
      return {
        ...state,
        invites: state.invites.map((i) =>
          i.id === action.id ? { ...i, status: 'rejected', rejectReason: action.reason } : i
        ),
      }
    }
    case 'SEND_INVITE': {
      const { talent, why, position, salary } = action
      const newSentInvite = {
        id: Date.now(),
        talentId: talent.id,
        name: talent.name,
        title: talent.title,
        company: talent.company,
        ai: talent.ai,
        why,
        position,
        salary,
        status: 'pending',
      }
      return { ...state, sentInvites: [...state.sentInvites, newSentInvite] }
    }

    // ---- 需求名片 ----
    case 'ADD_JOB_CARD': {
      if (state.jobCards.length >= MAX_JOB_CARDS) return state
      return { ...state, jobCards: [...state.jobCards, { ...action.payload, id: Date.now() }] }
    }
    case 'UPDATE_JOB_CARD': {
      return {
        ...state,
        jobCards: state.jobCards.map((c) => (c.id === action.payload.id ? action.payload : c)),
      }
    }
    case 'DELETE_JOB_CARD': {
      return { ...state, jobCards: state.jobCards.filter((c) => c.id !== action.id) }
    }

    // ---- 聊天 ----
    case 'ADD_MESSAGE': {
      return {
        ...state,
        chatThreads: state.chatThreads.map((t) =>
          t.id === action.threadId ? { ...t, msgs: [...t.msgs, action.message] } : t
        ),
      }
    }
    case 'SET_THREAD_READ': {
      return {
        ...state,
        chatThreads: state.chatThreads.map((t) => (t.id === action.threadId ? { ...t, unread: false } : t)),
      }
    }
    case 'SET_THREAD_UNLOCK': {
      return {
        ...state,
        chatThreads: state.chatThreads.map((t) =>
          t.id === action.threadId ? { ...t, ...action.payload } : t
        ),
      }
    }

    // ---- 面談邀請與評分（PRD 5.3／5.4） ----
    // 一個對話串同一時間僅追蹤一筆面談邀請，做法比照 unlockSent/unlockDone 那組欄位
    case 'SEND_INTERVIEW_INVITE': {
      return {
        ...state,
        chatThreads: state.chatThreads.map((t) =>
          t.id === action.threadId
            ? { ...t, interviewInvite: { ...action.payload, status: 'scheduled', senderRated: false } }
            : t
        ),
      }
    }
    case 'COMPLETE_INTERVIEW': {
      return {
        ...state,
        chatThreads: state.chatThreads.map((t) =>
          t.id === action.threadId && t.interviewInvite
            ? { ...t, interviewInvite: { ...t.interviewInvite, status: 'completed' } }
            : t
        ),
      }
    }
    case 'SUBMIT_INTERVIEW_RATING': {
      return {
        ...state,
        chatThreads: state.chatThreads.map((t) =>
          t.id === action.threadId && t.interviewInvite
            ? { ...t, interviewInvite: { ...t.interviewInvite, senderRated: true, ratingResult: action.result } }
            : t
        ),
      }
    }

    // ---- 設置 / 聯絡資料 ----
    case 'SET_CONTACT_DATA':
      return { ...state, contactData: { ...state.contactData, ...action.payload } }
    case 'SET_VERIFIED':
      return { ...state, isVerified: action.value }
    case 'SET_PERMISSION':
      return { ...state, permission: action.value }

    default:
      return state
  }
}
