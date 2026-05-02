import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Undo2 } from 'lucide-react'

export function RationalePanel() {
  const [state, setState] = useState<'open' | 'submitted'>('open')
  const [vote, setVote] = useState<'up' | 'down' | null>(null)
  const [note, setNote] = useState('')

  if (state === 'submitted') {
    return (
      <div className="mx-4 my-3 flex items-center gap-3 rounded-lg border bg-muted/30 px-4 py-2.5">
        <span className="text-base">{vote === 'up' ? '👍' : '👎'}</span>
        <span className="text-xs text-muted-foreground">feedback recorded</span>
        {note && (
          <span className="flex-1 truncate text-xs italic text-muted-foreground">"{note}"</span>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="ml-auto gap-1.5 text-xs"
          onClick={() => { setState('open'); setVote(null); setNote('') }}
        >
          <Undo2 className="h-3 w-3" />
          undo
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-4 my-3 rounded-lg border bg-muted/20 p-4">
      <div className="mb-2 flex items-center gap-2">
        <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
          agent rationale
        </span>
        <span className="text-xs text-muted-foreground">why this change</span>
      </div>
      <p className="text-sm leading-relaxed text-foreground/80">
        Two webhook deliveries from Stripe within ~3ms can both pass the{' '}
        <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">seen[orderID]</code> check before either
        sets the flag, causing a duplicate charge. A mutex around the check-and-set is the minimal fix; the
        regression test in{' '}
        <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">webhook_test.go</code> reproduces the
        race with a 50ms window.
      </p>

      <div className="mt-3 flex items-center gap-2 border-t pt-3">
        <span className="text-xs text-muted-foreground">was this rationale useful?</span>
        <button
          onClick={() => setVote(vote === 'up' ? null : 'up')}
          className={cn(
            'rounded-md border px-2.5 py-1 text-sm transition-all',
            vote === 'up'
              ? 'border-green-300 bg-green-100'
              : 'border-dashed border-border hover:bg-muted',
          )}
        >
          👍
        </button>
        <button
          onClick={() => setVote(vote === 'down' ? null : 'down')}
          className={cn(
            'rounded-md border px-2.5 py-1 text-sm transition-all',
            vote === 'down'
              ? 'border-red-300 bg-red-100'
              : 'border-dashed border-border hover:bg-muted',
          )}
        >
          👎
        </button>
        <Input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="add a comment (optional)…"
          className="flex-1 text-xs"
        />
        <Button
          size="sm"
          disabled={!vote && !note}
          onClick={() => (vote || note) && setState('submitted')}
          className="text-xs"
        >
          submit
        </Button>
      </div>
    </div>
  )
}
