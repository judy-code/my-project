import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGoogleLogin } from '@react-oauth/google'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { EmailAuthDialog } from '@/components/common/EmailAuthDialog'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { fetchGoogleProfile, isGoogleLoginConfigured } from '@/lib/googleAuth'

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.33 2.56 13.22l7.98 6.19C12.43 13.08 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-3.59-13.46-8.91l-7.98 6.19C6.51 42.67 14.62 48 24 48z"
      />
    </svg>
  )
}

// 只有設定好 VITE_GOOGLE_CLIENT_ID 才會 mount 這個元件，避免 useGoogleLogin 在
// client_id 是空字串時對 Google SDK 初始化，一初始化就丟出例外把整個 App 炸掉
function GoogleLoginButton({ onSuccess }) {
  const [signingIn, setSigningIn] = useState(false)

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const profile = await fetchGoogleProfile(tokenResponse.access_token)
        onSuccess(profile)
      } catch {
        toast.error('登入失敗，請稍後再試')
      } finally {
        setSigningIn(false)
      }
    },
    onError: () => {
      toast.error('Google 登入失敗，請稍後再試')
      setSigningIn(false)
    },
    onNonOAuthError: () => setSigningIn(false),
  })

  return (
    <Button
      className="mb-3 w-full gap-2.5 text-[15px]"
      variant="outline"
      size="lg"
      disabled={signingIn}
      onClick={() => {
        setSigningIn(true)
        googleLogin()
      }}
    >
      <GoogleIcon />
      {signingIn ? '登入中…' : '以 Google 帳號登入'}
    </Button>
  )
}

function GoogleLoginDisabledButton() {
  return (
    <Button
      className="mb-3 w-full gap-2.5 text-[15px]"
      variant="outline"
      size="lg"
      onClick={() => toast.error('尚未設定 Google 登入，請洽系統管理員')}
    >
      <GoogleIcon />
      以 Google 帳號登入
    </Button>
  )
}

export default function WelcomePage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [emailAuthOpen, setEmailAuthOpen] = useState(false)

  const enterApp = (loggedIn, target, user) => {
    dispatch({ type: 'ENTER_APP', loggedIn, user })
    navigate(target)
  }

  const handleEmailAuthSuccess = (user) => enterApp(true, '/build', user)
  const handleGoogleAuthSuccess = (profile) => enterApp(true, '/build', profile)

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-sm flex-col items-center justify-center px-8 py-10">
      <div className="mb-12 text-center">
        <div className="mb-2 text-[36px] font-medium tracking-tight">
          Co<span className="text-primary">Trace</span>
        </div>
        <div className="text-[15px] leading-[1.7] text-muted-foreground">
          翻轉求職邏輯
          <br />
          讓求才方主動找到你
          <br />
          用名片交換建立真實連結
        </div>
      </div>

      {isGoogleLoginConfigured ? (
        <GoogleLoginButton onSuccess={handleGoogleAuthSuccess} />
      ) : (
        <GoogleLoginDisabledButton />
      )}
      <Button
        className="mb-3 w-full text-[15px]"
        variant="outline"
        size="lg"
        onClick={() => setEmailAuthOpen(true)}
      >
        以 Email 帳號登入 / 註冊
      </Button>
      <Button className="mb-3 w-full text-[15px]" variant="outline" size="lg" onClick={() => enterApp(false, '/build')}>
        不登入，先建立名片
      </Button>
      <Button variant="ghost" className="text-muted-foreground" onClick={() => enterApp(false, '/explore')}>
        直接瀏覽探索
      </Button>
      <div className="mt-2 text-center text-xs text-muted-foreground">跳過登入將無法使用邀請、聊天等功能</div>

      <EmailAuthDialog open={emailAuthOpen} onOpenChange={setEmailAuthOpen} onAuthSuccess={handleEmailAuthSuccess} />
    </div>
  )
}
