import { Routes, Route, Navigate } from 'react-router-dom'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AuthProvider } from '@/context/AuthContext'
import NetflixNavbar from '@/components/layout/NetflixNavbar'
import ProtectedRoute from '@/components/layout/ProtectedRoute'
import PublicRoute from '@/components/layout/PublicRoute'
import Browse from '@/pages/Browse'
import Search from '@/pages/Search'
import NotFound from '@/pages/NotFound'
import Login from '@/pages/Login'
import Register from '@/pages/Register'

function App() {
  return (
    <TooltipProvider>
      <AuthProvider>
        <div className="min-h-screen bg-netflix-black text-white">
          <NetflixNavbar />
          <Routes>
            <Route path="/" element={<Navigate to="/browse" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/browse" 
              element={
                <PublicRoute>
                  <Browse />
                </PublicRoute>
              } 
            />
            <Route 
              path="/search" 
              element={
                <ProtectedRoute>
                  <Search />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </AuthProvider>
    </TooltipProvider>
  )
}

export default App
