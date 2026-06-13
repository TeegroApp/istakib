import { Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Layout from './components/Layout'
import BoardPage from './pages/BoardPage'
import ArchivePage from './pages/ArchivePage'
import CategoriesPage from './pages/CategoriesPage'
import StagesPage from './pages/StagesPage'
import SetupPage from './pages/SetupPage'

export default function App() {
  const hasEnv =
    import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY

  if (!hasEnv) return <SetupPage />

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
