import { useState } from 'react'
import { X } from 'lucide-react'
import { AutocompleteSearch } from '@/components/common/AutocompleteSearch'
import { useAutocomplete } from '@/hooks/useAutocomplete'
import { LANGUAGES } from '@/data/languages'

export function LanguageMultiSelect({ selected, onChange }) {
  const [query, setQuery] = useState('')
  const { results, searching, open, setOpen } = useAutocomplete(query, LANGUAGES, {
    exclude: selected,
    debounceMs: 300,
    minChars: 1,
  })

  const handleSelect = (lang) => {
    if (!selected.includes(lang)) onChange([...selected, lang])
    setQuery('')
    setOpen(false)
  }
  const handleRemove = (lang) => onChange(selected.filter((l) => l !== lang))

  return (
    <div>
      <AutocompleteSearch
        value={query}
        onChange={setQuery}
        open={open}
        onOpenChange={setOpen}
        results={results}
        searching={searching}
        emptyText="找不到符合的語言"
        placeholder="輸入語言搜尋..."
        onSelect={handleSelect}
      />
      {selected.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {selected.map((lang) => (
            <span
              key={lang}
              className="inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground"
            >
              {lang}
              <X className="size-3.5 cursor-pointer opacity-70" onClick={() => handleRemove(lang)} />
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
