import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useAppState } from '@/hooks/useAppState'
import { EmptyState } from '@/components/common/EmptyState'
import { CardBoxRow } from '@/components/cardbox/CardBoxRow'
import { FolderManagerSheet } from '@/components/cardbox/FolderManagerSheet'

const TABS = [
  { value: 'main', label: '名片夾', emptyText: '尚無名片，同意邀請後會自動加入' },
  { value: 'keep', label: '保留區', emptyText: '保留區是空的' },
  { value: 'block', label: '黑名單', emptyText: '黑名單是空的' },
]

export default function CardBoxPage() {
  const { cardBoxList, keepList, blockList } = useAppState()
  const [tab, setTab] = useState('main')
  const [search, setSearch] = useState('')
  const [folderManagerOpen, setFolderManagerOpen] = useState(false)

  const listByTab = { main: cardBoxList, keep: keepList, block: blockList }

  return (
    <div className="mx-auto flex h-full max-w-2xl flex-col">
      <div className="shrink-0 border-b border-border px-4 py-4 md:px-8">
        <h2 className="text-base font-medium">名片夾</h2>
      </div>
      <Tabs value={tab} onValueChange={setTab} className="min-h-0 flex-1 gap-0">
        <div className="shrink-0 border-b border-border px-4 md:px-8">
          <TabsList variant="line" className="h-10 w-full justify-start">
            {TABS.map((t) => (
              <TabsTrigger key={t.value} value={t.value}>
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        <div className="flex shrink-0 gap-2 border-b border-border px-4 py-2.5 md:px-8">
          <Input placeholder="搜尋名片..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <Button variant="outline" className="shrink-0" onClick={() => setFolderManagerOpen(true)}>
            資料夾
          </Button>
        </div>
        {TABS.map((t) => {
          const list = listByTab[t.value].filter((item) =>
            !search.trim() ? true : item.name.toLowerCase().includes(search.trim().toLowerCase())
          )
          return (
            <TabsContent key={t.value} value={t.value} className="min-h-0 flex-1 overflow-y-auto px-4 md:px-8">
              {!list.length ? (
                <EmptyState text={t.emptyText} />
              ) : (
                list.map((item) => <CardBoxRow key={item.id} talent={item} tab={t.value} />)
              )}
            </TabsContent>
          )
        })}
      </Tabs>
      <FolderManagerSheet open={folderManagerOpen} onOpenChange={setFolderManagerOpen} />
    </div>
  )
}
