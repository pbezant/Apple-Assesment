import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { REPOS } from '@/lib/mock-data'
import type { Repo } from '@/lib/types'
import { RepoCard } from './RepoCard'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FleetCopilotPanel } from './FleetCopilotPanel'
import { Search, SlidersHorizontal, X, Zap, ShieldCheck, TrendingUp, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'

type FilterKey = 'all' | 'upgradeable' | 'cve' | 'flagged'

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: `all ${REPOS.length}` },
  { key: 'upgradeable', label: 'upgradeable 12' },
  { key: 'cve', label: 'CVE error' },
  { key: 'flagged', label: 'flagged' },
]

const BATCH_ACTIONS = [
  { label: 'Scan for CVEs', icon: ShieldCheck },
  { label: 'Upgrade deps', icon: TrendingUp },
  { label: 'Generate docs', icon: FileText },
  { label: 'Run agent task…', icon: Zap },
]

function filterRepos(repos: Repo[], query: string, filter: FilterKey): Repo[] {
  let result = repos
  if (query.trim()) {
    const q = query.toLowerCase()
    result = result.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.language.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q),
    )
  }
  if (filter === 'cve') result = result.filter((r) => r.signals.cves > 0)
  if (filter === 'flagged') result = result.filter((r) => r.health === 'err')
  return result
}

export function FleetPage() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<FilterKey>('all')
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set())
  const navigate = useNavigate()

  const filtered = useMemo(() => filterRepos(REPOS, query, filter), [query, filter])
  const liveCount = REPOS.filter((r) => r.liveAgents > 0).length

  function toggleCheck(id: string) {
    setCheckedIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function clearSelection() {
    setCheckedIds(new Set())
  }

  function toggleAll() {
    if (checkedIds.size === filtered.length) {
      clearSelection()
    } else {
      setCheckedIds(new Set(filtered.map((r) => r.id)))
    }
  }

  const allChecked = filtered.length > 0 && checkedIds.size === filtered.length
  const anyChecked = checkedIds.size > 0

  // The copilot panel needs a "focused" repo — use first checked, or first in list
  const focusedRepo =
    REPOS.find((r) => checkedIds.has(r.id)) ?? REPOS[0]

  return (
    <div className="flex h-full">
      {/* Left — fleet grid */}
      <div className="flex flex-1 flex-col gap-3 overflow-hidden border-r p-4">
        {/* Header row */}
        <div className="flex shrink-0 items-center gap-3">
          <h2 className="text-base font-semibold">fleet · {REPOS.length} repos</h2>
          <span className="inline-flex items-center gap-1 rounded-full border border-orange-200 bg-orange-50 px-2 py-0.5 text-xs font-medium text-orange-700">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-500" />
            {liveCount} live
          </span>
          <div className="relative ml-auto flex-1 max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="filter by name, language, or type…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-8 h-8 text-xs"
            />
          </div>
          <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
            <SlidersHorizontal className="h-3 w-3" />
            sort: activity
          </Button>
        </div>

        {/* Filter chips */}
        <div className="flex shrink-0 flex-wrap gap-2">
          {FILTERS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={cn(
                'rounded-full border px-3 py-0.5 text-xs transition-colors',
                filter === key
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-background text-muted-foreground hover:bg-muted',
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Batch action bar — shown when any repos are checked */}
        {anyChecked && (
          <div className="flex shrink-0 items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2">
            <input
              type="checkbox"
              checked={allChecked}
              onChange={toggleAll}
              className="h-3.5 w-3.5 accent-primary"
              aria-label="Select all visible repos"
            />
            <span className="text-xs font-semibold text-primary">
              {checkedIds.size} repo{checkedIds.size > 1 ? 's' : ''} selected
            </span>
            <div className="ml-2 flex items-center gap-1.5">
              {BATCH_ACTIONS.map(({ label, icon: Icon }) => (
                <Button key={label} variant="outline" size="sm" className="h-7 gap-1.5 text-xs">
                  <Icon className="h-3 w-3" />
                  {label}
                </Button>
              ))}
            </div>
            <button
              onClick={clearSelection}
              className="ml-auto flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
              clear
            </button>
          </div>
        )}

        {/* Select-all hint when nothing is checked */}
        {!anyChecked && filtered.length > 0 && (
          <div className="flex shrink-0 items-center gap-2">
            <input
              type="checkbox"
              checked={false}
              onChange={toggleAll}
              className="h-3.5 w-3.5 accent-primary"
              aria-label="Select all visible repos"
            />
            <span className="text-xs text-muted-foreground">
              Check boxes to select repos for batch actions
            </span>
          </div>
        )}

        {/* Grid */}
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
              No repos match "{query}"
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2 xl:grid-cols-4">
              {filtered.map((repo) => (
                <RepoCard
                  key={repo.id}
                  repo={repo}
                  checked={checkedIds.has(repo.id)}
                  onCheck={toggleCheck}
                  onClick={() => navigate(`/repos/${repo.id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right — fleet copilot */}
      <FleetCopilotPanel selectedRepo={focusedRepo} />
    </div>
  )
}
