import React, { createContext, useContext, useReducer, useCallback, useRef } from 'react'
import type { Run, RunStatus } from '@/lib/types'
import { SEED_RUNS } from '@/lib/mock-data'
import { simulateRun, resumeRun } from '@/lib/mock-stream'

interface RunsState {
  runs: Record<string, Run>
}

type RunsAction =
  | { type: 'UPSERT_RUN'; run: Run }
  | { type: 'UPDATE_STEPS'; runId: string; steps: Run['steps']; status: RunStatus; elapsedMs: number; tokensUsed?: number }

function runsReducer(state: RunsState, action: RunsAction): RunsState {
  switch (action.type) {
    case 'UPSERT_RUN':
      return { runs: { ...state.runs, [action.run.id]: action.run } }
    case 'UPDATE_STEPS': {
      const prev = state.runs[action.runId]
      return {
        runs: {
          ...state.runs,
          [action.runId]: {
            ...prev,
            steps: action.steps,
            status: action.status,
            elapsedMs: action.elapsedMs,
            tokens: action.tokensUsed !== undefined
              ? { ...prev.tokens, used: action.tokensUsed, cost: +(action.tokensUsed * 0.000005).toFixed(4) }
              : prev.tokens,
          },
        },
      }
    }
    default:
      return state
  }
}

const seed: Record<string, Run> = {}
for (const r of SEED_RUNS) seed[r.id] = r

interface RunsContextValue {
  runs: Record<string, Run>
  startRun: (run: Run) => void
  retryRun: (runId: string) => void
  stopRun: (runId: string) => void
}

const RunsContext = createContext<RunsContextValue | null>(null)

export function RunsProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(runsReducer, { runs: seed })
  const abortRefs = useRef<Record<string, AbortController>>({})

  const startRun = useCallback((run: Run) => {
    dispatch({ type: 'UPSERT_RUN', run: { ...run, status: 'running' } })
    const ctrl = new AbortController()
    abortRefs.current[run.id] = ctrl
    const startedAt = Date.now()

    ;(async () => {
      const gen = simulateRun(run.steps, ctrl.signal)
      let stepIdx = 0
      for await (const steps of gen) {
        const failedIdx = steps.findIndex((s) => s.status === 'failed')
        const hasRunning = steps.some((s) => s.status === 'running')
        const allDone = steps.every((s) => s.status === 'done')
        const status: RunStatus = failedIdx >= 0 ? 'failed' : allDone ? 'done' : 'running'
        stepIdx++
        const tokensUsed = Math.min(
          run.tokens.budget,
          Math.floor((stepIdx / run.steps.length) * run.tokens.budget * 0.9),
        )
        dispatch({
          type: 'UPDATE_STEPS',
          runId: run.id,
          steps,
          status,
          elapsedMs: Date.now() - startedAt,
          tokensUsed,
        })
        if (!hasRunning && status !== 'running') break
      }
    })()
  }, [])

  const retryRun = useCallback(
    (runId: string) => {
      const run = state.runs[runId]
      if (!run) return
      const failedIdx = run.steps.findIndex((s) => s.status === 'failed')
      if (failedIdx < 0) return

      abortRefs.current[runId]?.abort()
      const ctrl = new AbortController()
      abortRefs.current[runId] = ctrl
      const startedAt = Date.now()

      dispatch({
        type: 'UPDATE_STEPS',
        runId,
        steps: run.steps,
        status: 'running',
        elapsedMs: run.elapsedMs,
      })

      ;(async () => {
        const gen = resumeRun(run.steps, failedIdx, ctrl.signal)
        for await (const steps of gen) {
          const hasRunning = steps.some((s) => s.status === 'running')
          const allDone = steps.every((s) => s.status === 'done')
          const status: RunStatus = allDone ? 'done' : hasRunning ? 'running' : 'failed'
          dispatch({
            type: 'UPDATE_STEPS',
            runId,
            steps,
            status,
            elapsedMs: run.elapsedMs + (Date.now() - startedAt),
          })
        }
      })()
    },
    [state.runs],
  )

  const stopRun = useCallback((runId: string) => {
    abortRefs.current[runId]?.abort()
    const run = state.runs[runId]
    if (!run) return
    dispatch({
      type: 'UPDATE_STEPS',
      runId,
      steps: run.steps.map((s) =>
        s.status === 'running' ? { ...s, status: 'next' as const } : s,
      ),
      status: 'failed',
      elapsedMs: run.elapsedMs,
    })
  }, [state.runs])

  return (
    <RunsContext.Provider value={{ runs: state.runs, startRun, retryRun, stopRun }}>
      {children}
    </RunsContext.Provider>
  )
}

export function useRuns() {
  const ctx = useContext(RunsContext)
  if (!ctx) throw new Error('useRuns must be used within RunsProvider')
  return ctx
}

export function useRun(id: string) {
  const { runs } = useRuns()
  return runs[id] ?? null
}
