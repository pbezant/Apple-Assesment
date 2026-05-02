import type { RunStep } from './types'

const STEP_DURATIONS: Record<number, number> = {
  0: 800,
  1: 1200,
  2: 600,
  3: 2200,
  4: 1500,
  5: 1800,
}

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

export async function* simulateRun(
  template: RunStep[],
  signal?: AbortSignal,
): AsyncGenerator<RunStep[]> {
  let steps: RunStep[] = template.map((s) => ({ ...s, status: 'next' as const }))
  yield [...steps]

  for (let i = 0; i < steps.length; i++) {
    if (signal?.aborted) return

    steps = steps.map((s, idx) =>
      idx === i ? { ...s, status: 'running' as const, duration: '—' } : s,
    )
    yield [...steps]

    const ms = STEP_DURATIONS[i] ?? 1200
    await delay(ms)
    if (signal?.aborted) return

    const shouldFail = i === 2 && steps[i].kind === 'term'
    if (shouldFail) {
      steps = steps.map((s, idx) =>
        idx === i ? { ...s, status: 'failed' as const, duration: `${(ms / 1000).toFixed(0)}s` } : s,
      )
      yield [...steps]
      return
    }

    const dur = `${(ms / 1000).toFixed(0)}s`
    steps = steps.map((s, idx) =>
      idx === i ? { ...s, status: 'done' as const, duration: dur } : s,
    )
    yield [...steps]
  }
}

export async function* resumeRun(
  steps: RunStep[],
  fromIndex: number,
  signal?: AbortSignal,
): AsyncGenerator<RunStep[]> {
  let current = steps.map((s, i) =>
    i >= fromIndex ? { ...s, status: 'next' as const } : s,
  )
  yield [...current]

  for (let i = fromIndex; i < current.length; i++) {
    if (signal?.aborted) return

    current = current.map((s, idx) =>
      idx === i ? { ...s, status: 'running' as const, duration: '—' } : s,
    )
    yield [...current]

    const ms = STEP_DURATIONS[i] ?? 1200
    await delay(ms)
    if (signal?.aborted) return

    const dur = `${(ms / 1000).toFixed(0)}s`
    current = current.map((s, idx) =>
      idx === i ? { ...s, status: 'done' as const, duration: dur } : s,
    )
    yield [...current]
  }
}
