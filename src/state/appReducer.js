import { blankCardData } from './initialState'

export function appReducer(state, action) {
  switch (action.type) {
    case 'ENTER_APP':
      return { ...state, isLoggedIn: action.loggedIn, user: action.user ?? null }
    case 'LOGOUT':
      return { ...state, isLoggedIn: false, user: null }

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
      return { ...state, filterState: { titleKw: '', skill: '', loc: '', sal: '' } }

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
