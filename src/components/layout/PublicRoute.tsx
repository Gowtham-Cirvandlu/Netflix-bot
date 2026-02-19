import { useAuth } from '@/context/AuthContext';

interface PublicRouteProps {
  children: React.ReactNode;
}

/**
 * PublicRoute component allows both authenticated and guest users
 * Renders children immediately without requiring authentication
 */
export default function PublicRoute({ children }: PublicRouteProps) {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-netflix-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-netflix-red mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
