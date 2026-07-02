import { Search, Inbox, CreditCard, MessageCircle } from 'lucide-react'

export const NAV_ITEMS = [
  { to: '/explore', label: '探索', icon: Search },
  { to: '/invites', label: '邀請', icon: Inbox, badge: true },
  { to: '/cardbox', label: '名片夾', icon: CreditCard },
  { to: '/chat', label: '聊天', icon: MessageCircle },
]
