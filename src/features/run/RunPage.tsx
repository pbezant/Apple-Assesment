import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useRun, useRuns } from '@/context/RunsContext'
import { REPOS } from '@/lib/mock-data'
import { StatusBadge } from '@/components/StatusBadge'
import { TraceStepRow } from './TraceStep'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ArrowLeft, Pause, Square, RotateCcw, Send, GitPullRequest } from 'lucide-react'
import { cn } from '@/lib/utils'

function formatElapsed(ms: number) {
  const s = Math.floor(ms / 1000)
  const m = Math.floor(s / 60)
  return m > 0 ? `${m}m ${s % 60}s` : `${s}s`
}

export function RunPage() {
  const { runId } = useParams<{ runId: string }>()
  const run = useRun(runId ?? '')
  const { retryRun, stopRun } = useRuns()
  const navigate = useNavigate()
  const [interrupt, setInterrupt] = useState('')
  const [elapsed, setElapsed] = useState(run?.elapsedMs ?? 0)

  useEffect(() => {
    if (!run || run.status !== 'running') return
    const interval = setInterval(() => {
      setElapsed(Date.now() - run.startedAt)
    }, 1000)
    return () => clearInterval(interval)
  }, [run?.status, run?.startedAt])

  if (!run) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Run not found: {runId}</p>
      </div>
    )
  }

  const repo = REPOS.find((r) => r.id === run.repoId)
  const failedIdx = run.steps.findIndex((s) => s.status === 'failed')
  const pct = Math.round((run.tokens.used / run.tokens.budget) * 100)

  const TOOLS_ALL = ['read', 'grep', 'edit', 'test', 'pr']

  return (
    <div className="flex h-full flex-col">
      {/* Run header */}
      <div className="shrink-0 border-b px-5 py-3">
        <div className="mb-1.5 flex items-center gap-2">
          <button
            onClick={() => navigate(`/repos/${run.repoId}`)}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3 w-3" />
            {run.repoId}
          </button>
          <span className="text-xs text-muted-foreground">/</span>
          <span className="font-mono text-xs text-muted-foreground">run/{run.id}</span>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={run.status} />
          <h1 className="text-base font-semibold">{run.task}</h1>
          <span className="ml-auto font-mono text-xs text-muted-foreground">
            {formatElapsed(run.status === 'running' ? elapsed : run.elapsedMs)} elapsed · {run.repoId}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="grid flex-1 grid-cols-[1fr_240px] overflow-hidden">
        {/* Left — trace */}
        <div className="flex flex-col overflow-hidden">
          <ScrollArea className="flex-1">
            <div className="p-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                trace · running + failed steps open by default
              </p>
              <div className="rounded-lg border">
                {run.steps.map((step, i) => (
                  <TraceStepRow key={step.id} step={step} isLast={i === run.steps.length - 1} />
                ))}
              </div>
            </div>
          </ScrollArea>

          {/* Interrupt bar */}
          <div className="shrink-0 border-t bg-muted/20 p-4">
            <div className="flex gap-2">
              <Input
                value={interrupt}
                onChange={(e) => setInterrupt(e.target.value)}
                placeholder="interrupt · 'also handle refunds'"
                className="flex-1 text-xs"
              />
              <Button size="sm" variant="outline" className="gap-1.5 text-xs">
                <Send className="h-3.5 w-3.5" />
                send
              </Button>
              {run.status === 'running' && (
                <>
                  <Button size="sm" variant="outline" className="gap-1.5 text-xs">
                    <Pause className="h-3.5 w-3.5" />
                    pause
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5 text-xs"
                    onClick={() => stopRun(run.id)}
                  >
                    <Square className="h-3.5 w-3.5" />
                    stop
                  </Button>
                </>
              )}
              {run.status === 'failed' && failedIdx >= 0 && (
                <Button
                  size="sm"
                  variant="default"
                  className="gap-1.5 text-xs"
                  onClick={() => retryRun(run.id)}
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  retry
                </Button>
              )}
              {run.status === 'done' && run.prId && (
                <Button size="sm" variant="default" asChild className="gap-1.5 text-xs">
                  <Link to={`/prs/${run.prId}`}>
                    <GitPullRequest className="h-3.5 w-3.5" />
                    view PR
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="flex flex-col gap-5 overflow-y-auto border-l p-4">
          {/* Repo insights */}
          {repo && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {repo.name} · signals
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  ['cve', `${repo.signals.cves} high`],
                  ['deps', `${repo.signals.staleDeps} stale`],
                  ['flaky', `${repo.signals.flakyTests} tests`],
                  ['cov', `${repo.signals.coverage}%`],
                ].map(([k, v]) => (
                  <div key={k} className="rounded border p-2">
                    <p className="text-[10px] uppercase text-muted-foreground">{k}</p>
                    <p className="font-mono text-sm font-bold">{v}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick actions */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              quick actions
            </p>
            <div className="flex flex-col gap-1.5">
              {['create PR', 'upgrade deps', 'fix CVEs', 'run tests', 'refactor', 'generate docs', 'scan'].map(
                (a) => (
                  <button
                    key={a}
                    className="rounded-md border border-dashed px-3 py-1.5 text-left text-xs text-muted-foreground hover:bg-muted"
                  >
                    {a}
                  </button>
                ),
              )}
            </div>
          </div>

          {/* Tools used */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">tools used</p>
            <div className="flex flex-wrap gap-1.5">
              {TOOLS_ALL.map((tool) => {
                const active = run.toolsUsed.includes(tool)
                const live = run.status === 'running' && tool === 'edit'
                return (
                  <span
                    key={tool}
                    className={cn(
                      'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs',
                      live
                        ? 'border-orange-200 bg-orange-50 text-orange-700'
                        : active
                        ? 'border-border bg-secondary text-secondary-foreground'
                        : 'border-dashed border-border text-muted-foreground',
                    )}
                  >
                    {live && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-500" />}
                    {tool}
                  </span>
                )
              })}
            </div>
          </div>

          {/* Tokens */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">tokens · cost</p>
            <p className="font-mono text-sm">
              {run.tokens.used.toLocaleString()} / ~{run.tokens.budget.toLocaleString()}
            </p>
            <p className="font-mono text-xs text-muted-foreground">${run.tokens.cost.toFixed(3)} spent</p>
            <Progress value={pct} className="mt-2 h-1.5" />
          </div>
        </div>
      </div>
    </div>
  )
}
