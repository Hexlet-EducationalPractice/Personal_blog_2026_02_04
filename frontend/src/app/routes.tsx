import { createBrowserRouter } from 'react-router-dom'
import { Layout } from '@/components/Layout/Layout'
import { Home } from '@/pages/Home/Home'
import { Works } from '@/pages/Works/Works'
import { Profile } from '@/pages/Profile/Profile'
import { Auth } from '@/pages/Auth/Auth'
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute'

export const router = createBrowserRouter([
  {
    path: '/auth',
    element: <Auth />,
  },
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/works', element: <Works /> },
      {
        path: '/profile',
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
    ],
  },
])
