import { Routes, Route, Navigate } from 'react-router-dom'
import { TooltipProvider } from '@/components/ui/tooltip'
import Browse from '@/pages/Browse'
import Search from '@/pages/Search'
import NotFound from '@/pages/NotFound'

function App() {
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-netflix-black text-white">
        <Routes>
          <Route path="/" element={<Navigate to="/browse" replace />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/search" element={<Search />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </TooltipProvider>
  )
}

export default App
