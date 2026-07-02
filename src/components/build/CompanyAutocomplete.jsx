import { AutocompleteSearch } from '@/components/common/AutocompleteSearch'
import { useAutocomplete } from '@/hooks/useAutocomplete'
import { COMPANIES } from '@/data/companies'

export function CompanyAutocomplete({ value, onChange }) {
  const { results, searching, open, setOpen } = useAutocomplete(value, COMPANIES, {
    debounceMs: 400,
    minChars: 2,
  })

  return (
    <AutocompleteSearch
      value={value}
      onChange={onChange}
      open={open}
      onOpenChange={setOpen}
      results={results}
      searching={searching}
      emptyText="找不到符合的公司"
      placeholder="輸入公司名稱搜尋..."
      onSelect={(item) => {
        onChange(item)
        setOpen(false)
      }}
    />
  )
}
