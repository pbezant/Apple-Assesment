import type { Repo } from '@/lib/types'
import { Sparkline } from '@/components/Sparkline'
import { cn } from '@/lib/utils'

const HEALTH_LABEL = {
  ok: { text: 'Healthy', className: 'text-green-600 bg-green-50 border-green-200' },
  warn: { text: 'Warning', className: 'text-yellow-600 bg-yellow-50 border-yellow-200' },
  err: { text: 'Error', className: 'text-red-600 bg-red-50 border-red-200' },
}

const LANG_COLORS: Record<string, string> = {
  Go: 'bg-sky-100 text-sky-700',
  TS: 'bg-blue-100 text-blue-700',
  Py: 'bg-yellow-100 text-yellow-700',
  Rust: 'bg-orange-100 text-orange-700',
  Swift: 'bg-pink-100 text-pink-700',
  Java: 'bg-red-100 text-red-700',
}

interface Props {
  repo: Repo
  checked?: boolean
  onCheck: (id: string) => void
  onClick: () => void
}

export function RepoCard({ repo, checked, onCheck, onClick }: Props) {
  const health = HEALTH_LABEL[repo.health]

  return (
    <div
      onClick={onClick}
      className={cn(
        'group relative flex cursor-pointer flex-col gap-2.5 rounded-lg border p-3 transition-all hover:shadow-sm',
        checked
          ? 'border-primary bg-primary/5 shadow-sm ring-1 ring-primary/20'
          : 'border-border bg-card hover:border-primary/30',
      )}
    >
      {/* Checkbox — always visible, stops propagation so it doesn't navigate */}
      <input
        type="checkbox"
        checked={!!checked}
        onChange={() => onCheck(repo.id)}
        onClick={(e) => e.stopPropagation()}
        className="absolute left-2.5 top-2.5 h-3.5 w-3.5 cursor-pointer accent-primary"
        aria-label={`Select ${repo.name}`}
      />

      {/* Live agent badge */}
      {repo.liveAgents > 0 && (
        <span className="absolute right-2.5 top-2.5 inline-flex items-center gap-1 rounded-full border border-orange-200 bg-orange-50 px-1.5 py-0.5 text-[9px] font-semibold text-orange-700">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-500" />
          {repo.liveAgents} agent live
        </span>
      )}

      {/* Repo name — pushed right to clear checkbox */}
      <div className="ml-5 min-w-0 pr-14">
        <p className="truncate font-mono text-xs font-bold leading-tight">{repo.name}</p>
        <p className="text-[10px] text-muted-foreground">{repo.category}</p>
      </div>

      {/* Activity sparkline with label */}
      <div className="flex flex-col gap-0.5">
        <span className="text-[9px] font-medium uppercase tracking-wider text-muted-foreground">
          7-day activity
        </span>
        <Sparkline data={repo.activity} width={72} height={20} />
      </div>

      {/* Status row */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span
          className={cn(
            'rounded px-1.5 py-0.5 text-[9px] font-medium',
            LANG_COLORS[repo.language] ?? 'bg-muted text-muted-foreground',
          )}
        >
          {repo.language}
        </span>
        <span className={cn('rounded border px-1.5 py-0.5 text-[9px] font-medium', health.className)}>
          {health.text}
        </span>
        {repo.signals.cves > 0 && (
          <span className="rounded border border-red-200 bg-red-50 px-1.5 py-0.5 text-[9px] font-semibold text-red-600">
            {repo.signals.cves} CVE{repo.signals.cves > 1 ? 's' : ''}
          </span>
        )}
      </div>
    </div>
  )
}
