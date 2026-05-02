import { Link, Outlet, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Activity, User } from 'lucide-react'
import { RunDetailsDrawer } from './RunDetailsDrawer'

const NAV = [
  { to: '/fleet', label: 'fleet' },
  { to: '/history', label: 'history' },
  { to: '#', label: 'recipes', disabled: true },
  { to: '#', label: 'settings', disabled: true },
]

export function AppShell() {
  const { pathname } = useLocation()

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      {/* Top nav */}
      <header className="flex shrink-0 items-center gap-4 border-b bg-background/95 px-4 py-2 backdrop-blur">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-orange-500" />
          <span className="font-mono text-xs font-bold tracking-wider">MISSION CTL</span>
        </div>
        <Separator />
        <nav className="flex items-center gap-1">
          {NAV.map(({ to, label, disabled }) => (
            <Link
              key={label}
              to={disabled ? '#' : to}
              onClick={disabled ? (e) => e.preventDefault() : undefined}
              className={cn(
                'rounded px-3 py-1 text-sm transition-colors',
                disabled
                  ? 'cursor-not-allowed text-muted-foreground'
                  : pathname.startsWith(to) && to !== '#'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
          <User className="h-3.5 w-3.5" />
          <span>preston · acme-corp</span>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>

      {/* Run details drawer — triggered by ?run= query param */}
      <RunDetailsDrawer />
    </div>
  )
}

function Separator() {
  return <div className="h-4 w-px bg-border" />
}
