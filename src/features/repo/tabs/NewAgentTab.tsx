import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Repo } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { StatusBadge } from '@/components/StatusBadge'
import { useRuns } from '@/context/RunsContext'
import { RUN_TEMPLATES } from '@/lib/mock-data'
import type { Run } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Zap } from 'lucide-react'

const ACTIONS = ['create PR', 'refactor', 'deps upgrade', 'docs', 'tests', 'review', 'scan', 'audit']

const DEFAULT_PROMPTS: Record<string, string> = {
  'create PR': 'open a pull request with the proposed changes.\nkeep tests green.',
  'refactor': 'refactor the selected scope for clarity and maintainability.',
  'deps upgrade': 'upgrade stale dependencies to latest stable versions.\nopen one PR. keep tests green.',
  'docs': 'generate or update documentation for the public API surface.',
  'tests': 'write unit tests for uncovered code paths. target 80% coverage.',
  'review': 'review the diff and leave inline comments with suggestions.',
  'scan': 'scan for security vulnerabilities and outdated dependencies.',
  'audit': 'audit code quality, performance hotspots, and tech debt.',
}

interface Props {
  repo: Repo
}

let runCounter = 1

export function NewAgentTab({ repo }: Props) {
  const [action, setAction] = useState('deps upgrade')
  const [prompt, setPrompt] = useState(DEFAULT_PROMPTS['deps upgrade'])
  const [scope, setScope] = useState<string[]>([])
  const navigate = useNavigate()
  const { startRun } = useRuns()

  function applyTemplate(label: string) {
    const act = label.includes('upgrade') ? 'deps upgrade' : 'create PR'
    setAction(act)
    setPrompt(label + '\n' + (DEFAULT_PROMPTS[act] ?? ''))
  }

  function handleActionClick(a: string) {
    setAction(a)
    setPrompt(DEFAULT_PROMPTS[a] ?? '')
  }

  function launch() {
    const tpl = RUN_TEMPLATES['fix-race']
    const id = `run-${Date.now()}-${runCounter++}`
    const run: Run = {
      id,
      repoId: repo.id,
      task: prompt.split('\n')[0].slice(0, 60),
      status: 'pending',
      startedAt: Date.now(),
      elapsedMs: 0,
      tokens: { used: 0, budget: tpl.tokens.budget, cost: 0 },
      toolsUsed: [],
      steps: tpl.steps.map((s) => ({ ...s })),
    }
    startRun(run)
    navigate(`/runs/${id}`)
  }

  return (
    <div className="grid h-full grid-cols-[1fr_260px] gap-0 overflow-hidden">
      {/* Left — composer */}
      <div className="flex flex-col gap-4 overflow-y-auto p-5">
        {/* Action picker */}
        <div className="rounded-lg border p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">action</p>
          <div className="grid grid-cols-4 gap-2">
            {ACTIONS.map((a) => (
              <button
                key={a}
                onClick={() => handleActionClick(a)}
                className={cn(
                  'rounded-md border px-2.5 py-1.5 text-xs font-medium transition-all',
                  a === action
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-dashed border-border bg-background hover:bg-muted',
                )}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        {/* Prompt */}
        <div className="flex flex-1 flex-col rounded-lg border p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">prompt</p>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="flex-1 resize-none font-mono text-xs"
            rows={6}
          />

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">scope</p>
              <div className="flex flex-wrap gap-1.5">
                {scope.map((s) => (
                  <button
                    key={s}
                    onClick={() => setScope(scope.filter((x) => x !== s))}
                    className="rounded-full border border-primary/20 bg-primary/5 px-2.5 py-0.5 text-xs text-primary hover:bg-primary/10"
                  >
                    {s} ×
                  </button>
                ))}
                <button
                  onClick={() => {
                    const p = prompt.trim()
                    if (p) setScope([...scope, '/' + p.split(' ')[0]])
                  }}
                  className="rounded-full border border-dashed px-2.5 py-0.5 text-xs text-muted-foreground hover:bg-muted"
                >
                  + path
                </button>
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">guardrails</p>
              <div className="flex flex-wrap gap-1.5">
                <span className="rounded-full border border-green-200 bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">
                  tests must pass
                </span>
                <button className="rounded-full border border-dashed px-2.5 py-0.5 text-xs text-muted-foreground hover:bg-muted">
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Launch bar */}
        <div className="flex shrink-0 items-center gap-3 rounded-lg border bg-muted/30 px-4 py-3">
          <span className="text-xs text-muted-foreground">est ~14k tok · ~$0.07</span>
          <Button variant="outline" size="sm" className="ml-auto gap-1.5 text-xs">
            save as recipe
          </Button>
          <Button size="sm" className="gap-1.5" onClick={launch}>
            <Zap className="h-3.5 w-3.5" />
            Launch ↵
          </Button>
        </div>
      </div>

      {/* Right — context rail */}
      <div className="flex flex-col gap-4 overflow-y-auto border-l p-5">
        {/* Suggested */}
        <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-orange-700">suggested</p>
          <div className="flex flex-col gap-2">
            {repo.suggestedRuns.map((sr, i) => (
              <button
                key={sr.id}
                onClick={() => applyTemplate(sr.label)}
                className={cn(
                  'flex flex-col items-start gap-0.5 rounded-md border px-3 py-2 text-left text-xs transition-all hover:shadow-sm',
                  i === 0
                    ? 'border-orange-300 bg-white'
                    : 'border-dashed border-orange-200 bg-orange-50/50 hover:bg-white',
                )}
              >
                <span className="font-medium text-sm">{sr.label}</span>
                <span
                  className={cn(
                    'text-xs',
                    sr.severity === 'err' ? 'text-red-600' : sr.severity === 'warn' ? 'text-yellow-600' : 'text-green-600',
                  )}
                >
                  {sr.detail}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Repo signals */}
        <div className="rounded-lg border p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">repo signals</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              ['cves', String(repo.signals.cves), repo.signals.cves > 0 ? 'text-yellow-600' : 'text-muted-foreground'],
              ['stale deps', String(repo.signals.staleDeps), 'text-muted-foreground'],
              ['flaky', String(repo.signals.flakyTests), repo.signals.flakyTests > 0 ? 'text-yellow-600' : 'text-muted-foreground'],
              ['coverage', `${repo.signals.coverage}%`, repo.signals.coverage >= 80 ? 'text-green-600' : 'text-yellow-600'],
            ].map(([k, v, c]) => (
              <div key={k} className="flex items-center justify-between rounded border px-2 py-1.5">
                <span className="text-xs text-muted-foreground">{k}</span>
                <span className={cn('font-mono text-sm font-bold', c)}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent runs */}
        <div className="rounded-lg border p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">recent runs</p>
          <div className="flex flex-col gap-1.5">
            {repo.recentRuns.slice(0, 3).map((run) => (
              <div key={run.id} className="flex items-center gap-2 text-xs">
                <span className="font-mono text-muted-foreground">{run.id}</span>
                <span className="flex-1 truncate">{run.task}</span>
                <StatusBadge status={run.status} />
              </div>
            ))}
            {repo.recentRuns.length === 0 && (
              <p className="text-xs text-muted-foreground">No runs yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
