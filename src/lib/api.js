const API_BASE = '/api'

async function request(path, { method = 'GET', body } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await res.text()
  const data = text ? JSON.parse(text) : null
  if (!res.ok) {
    throw new Error(data?.message || '發生錯誤，請稍後再試')
  }
  return data
}

export const registerAccount = (payload) => request('/auth/register', { method: 'POST', body: payload })
export const loginAccount = (payload) => request('/auth/login', { method: 'POST', body: payload })
export const logoutAccount = () => request('/auth/logout', { method: 'POST' })
export const fetchCurrentUser = () => request('/auth/me')
