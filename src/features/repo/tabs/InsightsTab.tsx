import type { Repo } from '@/lib/types'
import { StatusBadge } from '@/components/StatusBadge'
import { Button } from '@/components/ui/button'
import { useNavigate, Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { TrendingUp, Bug, Shield, TestTube, GitPullRequest } from 'lucide-react'

interface Props {
  repo: Repo
  onSwitchToNewAgent: () => void
}

export function InsightsTab({ repo, onSwitchToNewAgent }: Props) {
  const navigate = useNavigate()

  const signals = [
    { key: 'cves', label: 'CVEs', value: repo.signals.cves, icon: Shield, alert: repo.signals.cves > 0 },
    { key: 'staleDeps', label: 'stale deps', value: repo.signals.staleDeps, icon: TrendingUp, alert: repo.signals.staleDeps > 10 },
    { key: 'flakyTests', label: 'flaky tests', value: repo.signals.flakyTests, icon: TestTube, alert: repo.signals.flakyTests > 0 },
    { key: 'coverage', label: 'coverage', value: `${repo.signals.coverage}%`, icon: Bug, alert: repo.signals.coverage < 70 },
  ]

  return (
    <div className="grid h-full grid-cols-[1fr_280px] overflow-hidden">
      {/* Left */}
      <div className="flex flex-col gap-4 overflow-y-auto p-5">
        {/* Signals */}
        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            repo signals
          </h3>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {signals.map(({ key, label, value, icon: Icon, alert }) => (
              <div
                key={key}
                className={cn(
                  'flex flex-col gap-1 rounded-lg border p-3',
                  alert ? 'border-yellow-200 bg-yellow-50' : 'border-border bg-card',
                )}
              >
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Icon className="h-3 w-3" />
                  {label}
                </div>
                <span
                  className={cn(
                    'font-mono text-xl font-bold',
                    alert ? 'text-yellow-700' : 'text-foreground',
                  )}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Suggested runs */}
        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            suggested for this repo
          </h3>
          <div className="flex flex-col gap-2">
            {repo.suggestedRuns.map((sr) => (
              <button
                key={sr.id}
                onClick={onSwitchToNewAgent}
                className={cn(
                  'flex flex-col items-start gap-0.5 rounded-lg border px-3 py-2.5 text-left text-sm transition-all hover:shadow-sm',
                  sr.severity === 'err'
                    ? 'border-red-200 bg-red-50 hover:bg-red-100'
                    : sr.severity === 'warn'
                    ? 'border-yellow-200 bg-yellow-50 hover:bg-yellow-100'
                    : 'border-border bg-card hover:bg-muted',
                )}
              >
                <span className="font-medium">{sr.label}</span>
                <span
                  className={cn(
                    'text-xs',
                    sr.severity === 'err'
                      ? 'text-red-600'
                      : sr.severity === 'warn'
                      ? 'text-yellow-600'
                      : 'text-muted-foreground',
                  )}
                >
                  {sr.detail}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="flex flex-col gap-4 overflow-y-auto border-l p-5">
        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            recent runs
          </h3>
          <div className="flex flex-col gap-2">
            {repo.recentRuns.length === 0 ? (
              <p className="text-xs text-muted-foreground">No runs yet</p>
            ) : (
              repo.recentRuns.map((run) => (
                <div
                  key={run.id}
                  className="flex items-center gap-2 rounded-md border px-3 py-2 text-xs"
                >
                  <button
                    onClick={() => navigate(`/runs/${run.id}`)}
                    className="flex flex-1 items-center gap-2 truncate text-left hover:underline"
                  >
                    <span className="font-mono text-muted-foreground">{run.id}</span>
                    <span className="flex-1 truncate">{run.task}</span>
                  </button>
                  <StatusBadge status={run.status} />
                  {run.prId && (
                    <Link
                      to={`/prs/${run.prId}`}
                      className="inline-flex items-center gap-1 rounded border border-violet-200 bg-violet-50 px-1.5 py-0.5 text-[10px] font-medium text-violet-700 hover:bg-violet-100"
                      title="View pull request"
                    >
                      <GitPullRequest className="h-2.5 w-2.5" />
                      PR #{run.prId}
                    </Link>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <Button className="w-full" onClick={onSwitchToNewAgent}>
          + Run Agent Task
        </Button>
      </div>
    </div>
  )
}
