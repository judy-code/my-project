import { useState } from 'react'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { FieldGroup } from '@/components/common/FieldGroup'
import { ResponsiveModal } from '@/components/layout/ResponsiveModal'
import { loginAccount, registerAccount } from '@/lib/api'

const blankLogin = { email: '', password: '' }
const blankRegister = { name: '', email: '', password: '' }

export function EmailAuthDialog({ open, onOpenChange, onAuthSuccess }) {
  const [tab, setTab] = useState('login')
  const [loginDraft, setLoginDraft] = useState(blankLogin)
  const [registerDraft, setRegisterDraft] = useState(blankRegister)
  const [submitting, setSubmitting] = useState(false)

  const close = () => {
    onOpenChange(false)
    setLoginDraft(blankLogin)
    setRegisterDraft(blankRegister)
  }

  const handleLogin = async () => {
    if (!loginDraft.email || !loginDraft.password) {
      toast.error('請輸入 email 與密碼')
      return
    }
    setSubmitting(true)
    try {
      const { user } = await loginAccount(loginDraft)
      onAuthSuccess({ ...user, source: 'local' })
      close()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleRegister = async () => {
    if (!registerDraft.name || !registerDraft.email || !registerDraft.password) {
      toast.error('請填寫姓名、email 與密碼')
      return
    }
    if (registerDraft.password.length < 8) {
      toast.error('密碼至少需要 8 個字元')
      return
    }
    setSubmitting(true)
    try {
      const { user } = await registerAccount(registerDraft)
      onAuthSuccess({ ...user, source: 'local' })
      close()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <ResponsiveModal open={open} onOpenChange={close} title="Email 帳號">
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-4 w-full">
          <TabsTrigger className="flex-1" value="login">
            登入
          </TabsTrigger>
          <TabsTrigger className="flex-1" value="register">
            註冊
          </TabsTrigger>
        </TabsList>

        <TabsContent value="login">
          <FieldGroup label="Email">
            <Input
              type="email"
              value={loginDraft.email}
              onChange={(e) => setLoginDraft((d) => ({ ...d, email: e.target.value }))}
            />
          </FieldGroup>
          <FieldGroup label="密碼">
            <Input
              type="password"
              value={loginDraft.password}
              onChange={(e) => setLoginDraft((d) => ({ ...d, password: e.target.value }))}
            />
          </FieldGroup>
          <Button className="w-full" disabled={submitting} onClick={handleLogin}>
            {submitting ? '登入中…' : '登入'}
          </Button>
        </TabsContent>

        <TabsContent value="register">
          <FieldGroup label="姓名">
            <Input
              value={registerDraft.name}
              onChange={(e) => setRegisterDraft((d) => ({ ...d, name: e.target.value }))}
            />
          </FieldGroup>
          <FieldGroup label="Email">
            <Input
              type="email"
              value={registerDraft.email}
              onChange={(e) => setRegisterDraft((d) => ({ ...d, email: e.target.value }))}
            />
          </FieldGroup>
          <FieldGroup label="密碼" hint="至少 8 個字元">
            <Input
              type="password"
              value={registerDraft.password}
              onChange={(e) => setRegisterDraft((d) => ({ ...d, password: e.target.value }))}
            />
          </FieldGroup>
          <Button className="w-full" disabled={submitting} onClick={handleRegister}>
            {submitting ? '註冊中…' : '註冊'}
          </Button>
        </TabsContent>
      </Tabs>
    </ResponsiveModal>
  )
}
