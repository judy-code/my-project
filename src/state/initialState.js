import { genCode } from '@/lib/code'
import { FOLDER_DEFAULTS } from '@/data/folderDefaults'
import { INITIAL_TALENT_POOL } from '@/data/talentPool'
import { INITIAL_INVITES } from '@/data/invites'
import { INITIAL_CHAT_THREADS } from '@/data/chatThreads'

export function blankCardData() {
  return {
    title: '',
    jobTitle: '',
    level: '',
    company: '',
    companyHidden: false,
    lang: [],
    bio: '',
    skills: [],
    goodAt: '',
    wantTo: '',
    values: [],
    valCustom: '',
    salary: '',
    salaryUnit: '年薪',
    salaryMinus: 0,
    location: '',
    workMode: [],
    workTime: [],
    styleQ: {},
    code: genCode(),
  }
}

export function createInitialState() {
  return {
    isLoggedIn: false,
    user: null,
    isVerified: false,
    permission: '1',
    contactData: {
      firstName: '',
      lastName: '',
      areaCode: '+886',
      phone: '',
      emailAccount: '',
      emailDomain: 'gmail.com',
      emailCustomDomain: '',
      price: '',
    },
    folders: [...FOLDER_DEFAULTS],
    keepList: [],
    blockList: [],
    cardBoxList: [],
    filterState: { titleKw: '', skill: '', loc: '', sal: '' },
    cardData: blankCardData(),
    talentPool: [...INITIAL_TALENT_POOL],
    invites: [...INITIAL_INVITES],
    chatThreads: [...INITIAL_CHAT_THREADS],
  }
}
