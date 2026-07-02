export const isGoogleLoginConfigured = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID)

export async function fetchGoogleProfile(accessToken) {
  const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!res.ok) throw new Error('取得 Google 個人資料失敗')
  const data = await res.json()
  return { name: data.name, email: data.email, picture: data.picture, sub: data.sub, source: 'google' }
}
