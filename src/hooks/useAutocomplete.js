import { useMemo, useState } from 'react'
import { useDebounce } from './useDebounce'

/**
 * 本地端字串比對的自動完成 hook，取代原型 searchCo() 直接呼叫 Anthropic API 的作法。
 * @param {string} query
 * @param {string[]} pool 候選清單
 * @param {{exclude?: string[], debounceMs?: number, minChars?: number, limit?: number}} opts
 */
export function useAutocomplete(query, pool, opts = {}) {
  const { exclude = [], debounceMs = 350, minChars = 1, limit = 8 } = opts
  const debouncedQuery = useDebounce(query, debounceMs)
  const [open, setOpen] = useState(false)

  const results = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase()
    if (q.length < minChars) return []
    return pool
      .filter((item) => item.toLowerCase().includes(q) && !exclude.includes(item))
      .slice(0, limit)
  }, [debouncedQuery, pool, exclude, minChars, limit])

  const searching = query.trim().length >= minChars && query !== debouncedQuery

  return { results, searching, open, setOpen }
}
