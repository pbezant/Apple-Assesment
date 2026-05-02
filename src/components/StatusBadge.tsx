import { cn } from '@/lib/utils'
import type { RunStatus } from '@/lib/types'

const CONFIG: Record<RunStatus, { label: string; className: string; dot?: boolean }> = {
  pending:   { label: 'pending',  className: 'bg-slate-100 text-slate-600 border-slate-200' },
  queued:    { label: 'queued',   className: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  running:   { label: 'running',  className: 'bg-orange-50 text-orange-700 border-orange-200', dot: true },
  done:      { label: 'done',     className: 'bg-green-50 text-green-700 border-green-200' },
  failed:    { label: 'failed',   className: 'bg-red-50 text-red-700 border-red-200' },
  waiting:   { label: 'waiting',  className: 'bg-purple-50 text-purple-700 border-purple-200' },
}

interface Props {
  status: RunStatus
  className?: string
}

export function StatusBadge({ status, className }: Props) {
  const { label, className: cls, dot } = CONFIG[status]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium',
        cls,
        className,
      )}
    >
      {dot && (
        <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-orange-500" />
      )}
      {label}
    </span>
  )
}
