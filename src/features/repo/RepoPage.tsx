import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { REPOS } from '@/lib/mock-data'
import { InsightsTab } from './tabs/InsightsTab'
import { NewAgentTab } from './tabs/NewAgentTab'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

const HEALTH_CONFIG = {
  ok: { label: 'main · green', className: 'bg-green-50 text-green-700 border-green-200' },
  warn: { label: 'main · warn', className: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  err: { label: 'main · red', className: 'bg-red-50 text-red-700 border-red-200' },
}

const LANG_CONFIG: Record<string, string> = {
  Go: 'go 1.22',
  TS: 'typescript 5.4',
  Py: 'python 3.12',
  Rust: 'rust 1.77',
  Swift: 'swift 5.10',
  Java: 'java 21',
}

export function RepoPage() {
  const { repoId } = useParams<{ repoId: string }>()
  const [params, setParams] = useSearchParams()
  const navigate = useNavigate()
  const tab = params.get('tab') ?? 'insights'

  const repo = REPOS.find((r) => r.id === repoId)
  if (!repo) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Repo not found: {repoId}</p>
      </div>
    )
  }

  const health = HEALTH_CONFIG[repo.health]

  function setTab(value: string) {
    params.set('tab', value)
    setParams(params, { replace: true })
  }

  return (
    <div className="flex h-full flex-col">
      {/* Repo header */}
      <div className="shrink-0 border-b px-5 py-3">
        <div className="mb-2 flex items-center gap-2">
          <button
            onClick={() => navigate('/fleet')}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3 w-3" />
            fleet
          </button>
          <span className="text-xs text-muted-foreground">/</span>
          <span className="font-mono text-xs font-semibold">{repo.name}</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-lg font-bold">{repo.name}</h1>
          <span className="rounded-full border px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
            {LANG_CONFIG[repo.language] ?? repo.language}
          </span>
          <span className={cn('rounded-full border px-2.5 py-0.5 text-xs font-medium', health.className)}>
            {health.label}
          </span>
          {repo.signals.cves > 0 && (
            <span className="rounded-full border border-yellow-200 bg-yellow-50 px-2.5 py-0.5 text-xs font-medium text-yellow-700">
              {repo.signals.cves} cves
            </span>
          )}
        </div>
      </div>

      {/* Tab bar */}
      <div className="shrink-0 border-b px-5">
        <div className="flex gap-1 overflow-x-auto">
          {[
            { value: 'insights', label: 'insights' },
            { value: 'new-agent', label: '+ new agent' },
            { value: 'files', label: 'files' },
            { value: 'prs', label: `prs · 4` },
            { value: 'agents', label: `agents · ${repo.liveAgents}` },
            { value: 'history', label: 'history' },
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setTab(value)}
              className={cn(
                'shrink-0 border-b-2 px-3 py-2.5 text-sm transition-colors',
                tab === value
                  ? value === 'new-agent'
                    ? 'border-orange-500 font-medium text-orange-600'
                    : 'border-primary font-medium text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground',
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-hidden">
        {tab === 'insights' && <InsightsTab repo={repo} onSwitchToNewAgent={() => setTab('new-agent')} />}
        {tab === 'new-agent' && <NewAgentTab repo={repo} />}
        {(tab === 'files' || tab === 'prs' || tab === 'agents' || tab === 'history') && (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            <div className="text-center">
              <p className="font-medium">{label(tab)}</p>
              <p className="mt-1 text-xs">placeholder — not in scope for this demo</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function label(tab: string) {
  const map: Record<string, string> = {
    files: 'File browser',
    prs: 'Pull requests',
    agents: 'Running agents',
    history: 'Run history',
  }
  return map[tab] ?? tab
}
