import { useState } from 'react'
import type { RunStep } from '@/lib/types'
import { cn } from '@/lib/utils'
import { ChevronRight, ChevronDown, FileText, Terminal } from 'lucide-react'

interface Props {
  step: RunStep
  isLast?: boolean
}

export function TraceStepRow({ step }: Props) {
  const defaultOpen = step.status === 'running' || step.status === 'failed'
  const [open, setOpen] = useState(defaultOpen)

  const statusIcon = {
    done: <span className="font-mono text-xs text-green-600">✓</span>,
    running: <span className="font-mono text-xs text-orange-500 animate-pulse">▸</span>,
    failed: <span className="font-mono text-xs text-red-500">✗</span>,
    next: <span className="font-mono text-xs text-muted-foreground">○</span>,
  }[step.status]

  return (
    <div className={cn('border-b last:border-b-0', step.status === 'next' ? 'opacity-50' : '')}>
      <div
        className={cn(
          'flex cursor-pointer items-center gap-3 px-4 py-2.5 transition-colors',
          step.kind ? 'hover:bg-muted/40' : 'cursor-default',
        )}
        onClick={() => step.kind && setOpen(!open)}
      >
        <div className="flex w-4 items-center justify-center">{statusIcon}</div>
        <span className="flex-1 text-sm">{step.label}</span>
        <div className="flex items-center gap-2">
          {step.kind === 'files' && (
            <span className="inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] text-muted-foreground">
              <FileText className="h-2.5 w-2.5" />
              files
            </span>
          )}
          {step.kind === 'term' && (
            <span className="inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] text-muted-foreground">
              <Terminal className="h-2.5 w-2.5" />
              terminal
            </span>
          )}
          <span className="font-mono text-xs text-muted-foreground">{step.duration ?? '—'}</span>
          {step.kind && (
            <span className="text-muted-foreground">
              {open ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
            </span>
          )}
        </div>
      </div>

      {open && step.kind === 'files' && step.files && (
        <div className="mx-4 mb-3 mt-1 rounded-md border bg-muted/50 p-3">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            touched files · click → diff
          </p>
          {step.files.map((f, i) => (
            <div
              key={i}
              className="flex items-center gap-3 border-b py-1.5 last:border-b-0"
            >
              <span className="flex-1 font-mono text-xs">{f.path}</span>
              <span
                className={cn(
                  'rounded border px-1.5 py-0.5 text-[10px]',
                  f.kind === 'edit'
                    ? 'border-orange-200 bg-orange-50 text-orange-700'
                    : f.kind === 'new'
                    ? 'border-green-200 bg-green-50 text-green-700'
                    : 'border-border bg-background text-muted-foreground',
                )}
              >
                {f.kind}
              </span>
              <span className="font-mono text-xs text-muted-foreground">{f.meta}</span>
              <button className="text-xs text-primary hover:underline">diff →</button>
            </div>
          ))}
        </div>
      )}

      {open && step.kind === 'term' && step.terminal && (
        <div className="mx-4 mb-3 mt-1 overflow-x-auto rounded-md bg-zinc-900 p-3">
          <pre className="font-mono text-[11px] leading-relaxed">
            {step.terminal.map((line, i) => (
              <div
                key={i}
                className={cn(
                  line.startsWith('FAIL') || line.startsWith('---')
                    ? 'text-orange-400'
                    : line.startsWith('$')
                    ? 'text-green-400'
                    : line.startsWith('ok')
                    ? 'text-zinc-300'
                    : 'text-zinc-400',
                )}
              >
                {line}
              </div>
            ))}
          </pre>
        </div>
      )}
    </div>
  )
}
