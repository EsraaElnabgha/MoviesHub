import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import DetailsPage from '../pages/DetailsPage'
import Favorites from '../pages/Favorites'
import NotFound from '../pages/NotFound'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/movie/:id" element={<DetailsPage />} />
      <Route path="/favorites" element={<Favorites />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRoutes
