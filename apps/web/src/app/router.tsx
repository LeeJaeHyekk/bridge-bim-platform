import { createBrowserRouter } from 'react-router-dom'
import { AppLayout } from './layout'
import { DashboardPage } from '@/pages/dashboard/index'
import { BridgeListPage } from '@/pages/bridge-list/index'
import { BridgeDetailPage } from '@/pages/bridge-detail/index'

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
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
    ],
  },
])
