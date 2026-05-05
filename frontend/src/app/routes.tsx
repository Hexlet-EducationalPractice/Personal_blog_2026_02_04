import { Routes, Route } from 'react-router-dom'
import { Home } from '@/pages/Home/Home'
import { TextPage } from '@/pages/TextPage/TextPage'
import { SearchResult } from '@/pages/SearchResult/SearchResult'
import { Works } from '@/pages/Works/Works'
import { Auth } from '@/pages/Auth/Auth'
import { Profile } from '@/pages/Profile/Profile'
import { NotFound } from '@/pages/NotFound/NotFound'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/post/:id" element={<TextPage />} />
      <Route path="/search" element={<SearchResult />} />
      <Route path="/works" element={<Works />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
