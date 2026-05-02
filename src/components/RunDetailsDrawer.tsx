import { useSearchParams, useNavigate } from 'react-router-dom'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from './ui/sheet'
import { useRun } from '@/context/RunsContext'
import { StatusBadge } from './StatusBadge'
import { Progress } from './ui/progress'
import { Button } from './ui/button'
import { TraceStepRow } from '@/features/run/TraceStep'
import { ScrollArea } from './ui/scroll-area'
import { useRuns } from '@/context/RunsContext'
import { Link } from 'react-router-dom'
import { ExternalLink, RotateCcw, GitPullRequest } from 'lucide-react'

export function RunDetailsDrawer() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const runId = params.get('run')
  const run = useRun(runId ?? '')
  const { retryRun } = useRuns()

  const open = !!runId && !!run

  function close() {
    params.delete('run')
    navigate({ search: params.toString() }, { replace: true })
  }

  return (
    <Sheet open={open} onOpenChange={(v) => !v && close()}>
      <SheetContent side="right" className="flex w-full max-w-lg flex-col gap-0 p-0 sm:max-w-lg">
        {run && (
          <>
            <SheetHeader className="border-b px-6 py-4">
              <div className="flex items-center gap-3 pr-6">
                <StatusBadge status={run.status} />
                <SheetTitle className="text-sm font-semibold">{run.task}</SheetTitle>
              </div>
              <SheetDescription className="text-xs">
                {run.repoId} · run {run.id}
              </SheetDescription>
            </SheetHeader>

            <ScrollArea className="flex-1">
              <div className="flex flex-col gap-4 p-6">
                {/* Tokens / cost */}
                <div className="rounded-lg border p-3">
                  <p className="mb-2 text-xs font-medium text-muted-foreground">tokens · cost</p>
                  <div className="font-mono text-sm">
                    {run.tokens.used.toLocaleString()} / ~{run.tokens.budget.toLocaleString()}
                    <span className="ml-3 text-muted-foreground">${run.tokens.cost.toFixed(3)} spent</span>
                  </div>
                  <Progress
                    value={Math.round((run.tokens.used / run.tokens.budget) * 100)}
                    className="mt-2 h-1.5"
                  />
                </div>

                {/* Trace */}
                <div>
                  <p className="mb-2 text-xs font-medium text-muted-foreground">trace</p>
                  <div className="flex flex-col gap-1 rounded-lg border">
                    {run.steps.map((step, i) => (
                      <TraceStepRow key={step.id} step={step} isLast={i === run.steps.length - 1} />
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>

            <div className="flex items-center gap-2 border-t px-6 py-4">
              {run.status === 'failed' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => retryRun(run.id)}
                  className="gap-1.5"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Retry
                </Button>
              )}
              {run.prId && (
                <Button variant="outline" size="sm" asChild className="gap-1.5">
                  <Link to={`/prs/${run.prId}`} onClick={close}>
                    <GitPullRequest className="h-3.5 w-3.5" />
                    View PR #{run.prId}
                  </Link>
                </Button>
              )}
              <Button variant="ghost" size="sm" asChild className="ml-auto gap-1.5">
                <Link to={`/runs/${run.id}`} onClick={close}>
                  <ExternalLink className="h-3.5 w-3.5" />
                  Full view
                </Link>
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
