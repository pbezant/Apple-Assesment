export type Lang = 'Go' | 'TS' | 'Py' | 'Rust' | 'Swift' | 'Java'
export type RepoHealth = 'ok' | 'warn' | 'err'
export type RunStatus = 'pending' | 'queued' | 'running' | 'done' | 'failed' | 'waiting'
export type StepStatus = 'done' | 'running' | 'failed' | 'next'
export type ApprovalMode = 'fireforget' | 'plan' | 'checkpoint' | 'interactive'

export interface RepoSignals {
  cves: number
  staleDeps: number
  flakyTests: number
  coverage: number
}

export interface SuggestedRun {
  id: string
  label: string
  detail: string
  severity: 'ok' | 'warn' | 'err'
}

export interface RecentRun {
  id: string
  task: string
  status: RunStatus
  prId?: string
}

export interface Repo {
  id: string
  name: string
  language: Lang
  health: RepoHealth
  category: 'svc' | 'UI' | 'ml' | 'etl' | 'app'
  liveAgents: number
  activity: number[]
  signals: RepoSignals
  suggestedRuns: SuggestedRun[]
  recentRuns: RecentRun[]
}

export interface TouchedFile {
  path: string
  meta: string
  kind: 'read' | 'edit' | 'new'
}

export interface RunStep {
  id: string
  label: string
  status: StepStatus
  duration?: string
  kind?: 'files' | 'term' | null
  files?: TouchedFile[]
  terminal?: string[]
}

export interface Run {
  id: string
  repoId: string
  task: string
  status: RunStatus
  startedAt: number
  elapsedMs: number
  steps: RunStep[]
  tokens: { used: number; budget: number; cost: number }
  toolsUsed: string[]
  prId?: string
}

export interface HistoryRow {
  id: string
  task: string
  repoId: string
  status: RunStatus
  duration: string
  cost: string
  prId?: string
}
