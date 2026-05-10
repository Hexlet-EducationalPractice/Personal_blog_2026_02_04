import { createBrowserRouter } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { Home } from '@/pages/Home/Home'
import { TextPage } from '@/pages/TextPage/TextPage'
import { SearchResult } from '@/pages/SearchResult/SearchResult'
import { Works } from '@/pages/Works/Works'
import { Profile } from '@/pages/Profile/Profile'
import { Auth } from '@/pages/Auth/Auth'
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute/ProtectedRoute'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'post/:id', element: <TextPage /> },
      { path: 'search', element: <SearchResult /> },
      { path: 'works', element: <Works /> },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      { path: 'auth', element: <Auth /> },
    ],
  },
])