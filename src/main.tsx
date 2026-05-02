import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import { AppShell } from './components/AppShell'
import { FleetPage } from './features/fleet/FleetPage'
import { RepoPage } from './features/repo/RepoPage'
import { RunPage } from './features/run/RunPage'
import { PRPage } from './features/pr/PRPage'
import { HistoryPage } from './features/history/HistoryPage'
import { RunsProvider } from './context/RunsContext'
import { Navigate } from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <Navigate to="/fleet" replace /> },
      { path: 'fleet', element: <FleetPage /> },
      { path: 'repos/:repoId', element: <RepoPage /> },
      { path: 'runs/:runId', element: <RunPage /> },
      { path: 'prs/:prId', element: <PRPage /> },
      { path: 'history', element: <HistoryPage /> },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RunsProvider>
      <RouterProvider router={router} />
    </RunsProvider>
  </StrictMode>,
)
