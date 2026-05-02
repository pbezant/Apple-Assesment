import { useState } from 'react'
import type { Repo } from '@/lib/types'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useNavigate } from 'react-router-dom'
import { Send } from 'lucide-react'

interface Message {
  role: 'user' | 'agent'
  content: string
  chips?: string[]
  runId?: string
}

const SEED_MESSAGES: Message[] = [
  {
    role: 'user',
    content: 'which of my repos are most at risk this week?',
  },
  {
    role: 'agent',
    content:
      '3 repos with high-severity CVEs, 2 with failing main builds. data-pipe looks worst — 4 stale deps + a red build.',
    chips: ['open data-pipe', 'scan all 3', 'draft PRs'],
  },
  {
    role: 'user',
    content: 'fix the race in payments-svc charge_handler — open a PR',
  },
  {
    role: 'agent',
    content: 'On it. Reading charge_handler.go + tests now.',
    runId: '9f3a',
  },
]

interface Props {
  selectedRepo: Repo
}

export function FleetCopilotPanel({ selectedRepo }: Props) {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>(SEED_MESSAGES)
  const navigate = useNavigate()

  function sendMessage() {
    if (!input.trim()) return
    setMessages((prev) => [...prev, { role: 'user', content: input.trim() }])
    setInput('')
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: 'agent',
          content: `Got it. Working on "${prev[prev.length - 1].content}" for ${selectedRepo.name}.`,
        },
      ])
    }, 800)
  }

  return (
    <div className="flex w-72 shrink-0 flex-col border-l">
      <div className="flex shrink-0 items-center gap-2 border-b px-3 py-2.5">
        <span className="inline-flex items-center gap-1 rounded-full border border-orange-200 bg-orange-50 px-1.5 py-0.5 text-[9px] font-medium text-orange-700">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-500" />
          agent
        </span>
        <span className="text-sm font-semibold">fleet copilot</span>
        <span className="ml-auto text-xs text-muted-foreground">scope · all {12} repos</span>
      </div>

      <ScrollArea className="flex-1 px-3 py-2">
        <div className="flex flex-col gap-3 pb-2 text-xs">
          <p className="text-center text-[10px] text-muted-foreground">today · 9:42</p>
          {messages.map((msg, i) => (
            <div key={i} className={msg.role === 'user' ? 'flex justify-end' : ''}>
              {msg.role === 'user' ? (
                <div className="max-w-[85%] rounded-lg border border-primary/20 bg-primary/5 px-2.5 py-1.5 text-xs">
                  {msg.content}
                </div>
              ) : (
                <div className="rounded-lg border bg-card px-2.5 py-1.5 text-xs">
                  <p>{msg.content}</p>
                  {msg.chips && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {msg.chips.map((chip) => (
                        <button
                          key={chip}
                          className="rounded-full border px-2 py-0.5 text-[10px] hover:bg-muted"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  )}
                  {msg.runId && (
                    <button
                      onClick={() => navigate(`?run=${msg.runId}`)}
                      className="mt-1.5 flex items-center gap-1 text-[10px] text-orange-600 hover:underline"
                    >
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-500" />
                      run/{msg.runId} → open in live view
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="border-t bg-muted/30 p-3">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="ask anything · @ to scope to a repo"
          className="h-8 text-xs"
        />
        <div className="mt-2 flex items-center gap-1.5">
          <button className="rounded-full border px-2 py-0.5 text-[9px] text-muted-foreground">
            @{selectedRepo.name}
          </button>
          <button className="rounded-full border px-2 py-0.5 text-[9px] text-muted-foreground">
            /create-pr
          </button>
          <Button size="sm" className="ml-auto h-6 gap-1 text-[10px]" onClick={sendMessage}>
            <Send className="h-3 w-3" />
            send
          </Button>
        </div>
      </div>
    </div>
  )
}
