import { Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Layout from './components/Layout'
import BoardPage from './pages/BoardPage'
import ArchivePage from './pages/ArchivePage'
import CategoriesPage from './pages/CategoriesPage'
import StagesPage from './pages/StagesPage'

export default function App() {
  return (
    <AppProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<BoardPage />} />
          <Route path="/arsiv" element={<ArchivePage />} />
          <Route path="/kategoriler" element={<CategoriesPage />} />
          <Route path="/ashamalar" element={<StagesPage />} />
        </Routes>
      </Layout>
    </AppProvider>
  )
}
