import { useParams, useNavigate } from 'react-router-dom'
import { RationalePanel } from './RationalePanel'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ArrowLeft, GitMerge, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

const DIFF_BEFORE = [
  { ln: 41, content: 'if seen[orderID] {', type: 'ctx' },
  { ln: 42, content: '  return ErrDup', type: 'del' },
  { ln: 43, content: '}', type: 'del' },
  { ln: 44, content: 'seen[orderID] = true', type: 'ctx' },
  { ln: 45, content: '', type: 'ctx' },
  { ln: 46, content: 'return h.process(o)', type: 'ctx' },
]

const DIFF_AFTER = [
  { ln: 41, content: 'h.mu.Lock()', type: 'ctx' },
  { ln: 42, content: 'defer h.mu.Unlock()', type: 'add' },
  { ln: 43, content: 'if seen[orderID] {', type: 'add' },
  { ln: 44, content: '  return ErrDup', type: 'add' },
  { ln: 45, content: '}', type: 'ctx' },
  { ln: 46, content: 'seen[orderID] = true', type: 'ctx' },
  { ln: 47, content: 'return h.process(o)', type: 'ctx' },
]

const PR_CHECKS = [
  { label: 'unit · 412/412', pass: true },
  { label: 'lint', pass: true },
  { label: 'vet', pass: true },
]

export function PRPage() {
  const { prId } = useParams<{ prId: string }>()
  const navigate = useNavigate()

  return (
    <div className="flex h-full flex-col">
      {/* PR header */}
      <div className="shrink-0 border-b px-5 py-3">
        <div className="mb-2 flex items-center gap-2">
          <button
            onClick={() => navigate('/fleet')}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3 w-3" />
            fleet
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-base font-semibold">
            fix: race in charge_handler on duplicate stripe webhook
          </h1>
          <span className="font-mono text-xs text-muted-foreground">#{prId}</span>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full border border-green-200 bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
            open
          </span>
          <span className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground">
            agent · run 9f3a
          </span>
          <span className="text-xs text-muted-foreground">
            wants to merge <strong>1 commit</strong> into{' '}
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">main</code> from{' '}
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">agent/fix-race-9f3a</code>
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="shrink-0 border-b px-5">
        <div className="flex gap-1">
          {['conversation · 3', 'commits · 1', 'checks · ✓ 3', 'files changed · 2'].map((tab, i) => (
            <button
              key={tab}
              className={cn(
                'border-b-2 px-3 py-2.5 text-sm transition-colors',
                i === 3
                  ? 'border-primary font-medium text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground',
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="grid flex-1 grid-cols-[180px_1fr] overflow-hidden">
        {/* File tree + meta */}
        <div className="flex flex-col gap-4 overflow-y-auto border-r p-4">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">files · 2</p>
            <div className="font-mono text-xs leading-relaxed">
              <div className="text-muted-foreground">charge/</div>
              <div className="ml-3 border-l-2 border-orange-400 bg-orange-50 pl-2 py-0.5">
                charge_handler.go{' '}
                <span className="text-green-600">+8</span>{' '}
                <span className="text-red-500">−2</span>
              </div>
              <div className="mt-1 text-muted-foreground">charge/test/</div>
              <div className="ml-3 pl-2">
                webhook_test.go <span className="text-green-600">+38</span>
              </div>
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">reviewers</p>
            <div className="flex items-center gap-2">
              <span className="rounded-full border px-2 py-0.5 text-[10px] font-semibold">JD</span>
              <span className="text-xs text-muted-foreground">jdoe · pending</span>
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">checks</p>
            {PR_CHECKS.map((c) => (
              <div key={c.label} className="flex items-center gap-1.5 font-mono text-xs py-0.5">
                <CheckCircle className={cn('h-3 w-3', c.pass ? 'text-green-500' : 'text-red-500')} />
                {c.label}
              </div>
            ))}
          </div>
        </div>

        {/* Diff + rationale */}
        <div className="flex flex-col overflow-hidden">
          {/* Diff header */}
          <div className="flex shrink-0 items-center gap-3 border-b bg-muted/30 px-4 py-2">
            <span className="font-mono text-sm font-semibold">charge/charge_handler.go</span>
            <span className="ml-auto text-xs text-muted-foreground">split · unified</span>
            <span className="rounded-full border px-2 py-0.5 text-[10px] text-muted-foreground">viewed</span>
          </div>

          <ScrollArea className="flex-1">
            {/* Split diff */}
            <div className="grid grid-cols-2 border-b font-mono text-xs leading-6">
              {/* Before */}
              <div className="border-r bg-white p-3">
                <div className="mb-1 text-muted-foreground">@@ −41,7 +41,9 @@ func (h *Handler) Charge(</div>
                {DIFF_BEFORE.map(({ ln, content, type }) => (
                  <div
                    key={`b-${ln}`}
                    className={cn(
                      'flex',
                      type === 'del' ? 'bg-red-50' : '',
                    )}
                  >
                    <span className="mr-3 w-6 text-right text-muted-foreground">{ln}</span>
                    <span className={type === 'del' ? 'text-red-700' : ''}>{content}</span>
                  </div>
                ))}
              </div>

              {/* After */}
              <div className="bg-white p-3">
                <div className="mb-1 text-muted-foreground">@@ −41,7 +41,9 @@ func (h *Handler) Charge(</div>
                {DIFF_AFTER.map(({ ln, content, type }) => (
                  <div
                    key={`a-${ln}`}
                    className={cn('flex', type === 'add' ? 'bg-green-50' : '')}
                  >
                    <span className="mr-3 w-6 text-right text-muted-foreground">{ln}</span>
                    <span className={type === 'add' ? 'text-green-700' : ''}>{content}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rationale + agent comment */}
            <RationalePanel />

            <div className="mx-4 mb-4 rounded-lg border border-orange-200 bg-orange-50 p-4">
              <div className="mb-2 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full border border-orange-200 bg-white px-2 py-0.5 text-[10px] font-medium text-orange-700">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-500" />
                  agent
                </span>
                <span className="text-xs text-muted-foreground">commented on line 42</span>
              </div>
              <p className="text-sm text-foreground/80">
                Added a mutex around the duplicate-id check. Without it, two webhook deliveries within ~3ms
                could both pass the seen[] check before either set the flag.
              </p>
            </div>
          </ScrollArea>

          {/* Merge bar */}
          <div className="flex shrink-0 items-center gap-3 border-t bg-muted/20 px-5 py-3">
            <span className="flex items-center gap-1.5 text-xs font-medium text-green-700">
              <CheckCircle className="h-3.5 w-3.5 text-green-500" />
              all checks passed
            </span>
            <span className="text-xs text-muted-foreground">no conflicts with main</span>
            <div className="ml-auto flex items-center gap-2">
              <Button variant="outline" size="sm">
                request changes
              </Button>
              <Button variant="outline" size="sm">
                approve
              </Button>
              <Button size="sm" className="gap-1.5">
                <GitMerge className="h-3.5 w-3.5" />
                merge pull request ▾
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
