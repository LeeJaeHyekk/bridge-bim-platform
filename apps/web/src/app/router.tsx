import { createBrowserRouter } from 'react-router-dom'
import { DashboardPage } from '@/pages/dashboard/index'
import { BridgeListPage } from '@/pages/bridge-list/index'
import { BridgeDetailPage } from '@/pages/bridge-detail/index'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <DashboardPage />,
  },
  {
    path: '/bridges',
    element: <BridgeListPage />,
  },
  {
    path: '/bridges/:id',
    element: <BridgeDetailPage />,
  },
])
