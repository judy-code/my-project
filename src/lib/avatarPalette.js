export const AVATAR_COLORS = [
  { bg: '#fdf0ee', fg: '#8a2e1e' },
  { bg: '#EEEDFE', fg: '#3C3489' },
  { bg: '#E6F1FB', fg: '#0C447C' },
  { bg: '#EAF3DE', fg: '#27500A' },
  { bg: '#FAEEDA', fg: '#633806' },
]

export function avatarColor(index) {
  return AVATAR_COLORS[(index ?? 0) % AVATAR_COLORS.length]
}
