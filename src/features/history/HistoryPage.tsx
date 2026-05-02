import { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { HISTORY_ROWS } from '@/lib/mock-data'
import { StatusBadge } from '@/components/StatusBadge'
import { Input } from '@/components/ui/input'
import { Search, GitPullRequest } from 'lucide-react'

const COLS = ['id', 'task', 'repo', 'status', 'time', 'cost', 'pr']

export function HistoryPage() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const [, setParams] = useSearchParams()

  const filtered = query.trim()
    ? HISTORY_ROWS.filter(
        (r) =>
          r.task.toLowerCase().includes(query.toLowerCase()) ||
          r.repoId.toLowerCase().includes(query.toLowerCase()) ||
          r.id.toLowerCase().includes(query.toLowerCase()),
      )
    : HISTORY_ROWS

  function openDrawer(id: string) {
    setParams({ run: id })
  }

  return (
    <div className="flex h-full flex-col p-5">
      {/* Header */}
      <div className="mb-4 flex shrink-0 items-center gap-3">
        <h2 className="text-lg font-bold">fleet history</h2>
        <span className="rounded-full border border-dashed px-2.5 py-0.5 text-xs text-muted-foreground">
          last 7d
        </span>
        <span className="rounded-full border px-2.5 py-0.5 text-xs">
          {HISTORY_ROWS.length} runs
        </span>
        <div className="relative ml-auto w-48">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="search…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-8 h-8 text-xs"
          />
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-hidden rounded-lg border">
        {/* Header row */}
        <div className="grid grid-cols-[72px_1fr_140px_110px_64px_64px_80px] border-b bg-muted/40 px-4 py-2">
          {COLS.map((h) => (
            <span key={h} className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {h}
            </span>
          ))}
        </div>

        {/* Body */}
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(100% - 41px)' }}>
          {filtered.map((row) => (
            <div
              key={row.id}
              className="grid cursor-pointer grid-cols-[72px_1fr_140px_110px_64px_64px_80px] items-center border-b px-4 py-3 text-sm transition-colors hover:bg-muted/20 last:border-b-0"
              onClick={() => openDrawer(row.id)}
            >
              <span className="font-mono text-xs text-muted-foreground">{row.id}</span>
              <span className="truncate">{row.task}</span>
              <button
                className="truncate text-left text-xs text-muted-foreground hover:text-primary hover:underline"
                onClick={(e) => {
                  e.stopPropagation()
                  navigate(`/repos/${row.repoId}`)
                }}
              >
                {row.repoId}
              </button>
              <StatusBadge status={row.status} />
              <span className="font-mono text-xs text-muted-foreground">{row.duration}</span>
              <span className="font-mono text-xs text-muted-foreground">{row.cost}</span>
              <div onClick={(e) => e.stopPropagation()}>
                {row.prId ? (
                  <Link
                    to={`/prs/${row.prId}`}
                    className="inline-flex items-center gap-1 rounded border border-violet-200 bg-violet-50 px-2 py-0.5 text-xs font-medium text-violet-700 hover:bg-violet-100 transition-colors"
                  >
                    <GitPullRequest className="h-3 w-3" />
                    #{row.prId}
                  </Link>
                ) : (
                  <span className="text-xs text-muted-foreground">—</span>
                )}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="flex h-24 items-center justify-center text-sm text-muted-foreground">
              No runs match "{query}"
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
