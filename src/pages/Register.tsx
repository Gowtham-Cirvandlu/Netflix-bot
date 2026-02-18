import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '@/components/auth/RegisterForm';
import { useAuth } from '@/context/AuthContext';

export default function Register() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/browse');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-netflix-black flex flex-col">
      {/* Background with overlay */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/90" />
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=1920&q=80')`,
          }}
        />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 px-4 md:px-8 py-6">
        <a href="/" className="text-netflix-red font-bold text-4xl tracking-tight">
          NETFLIX
        </a>
      </nav>

      {/* Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-black/75 backdrop-blur-md rounded-lg p-8 shadow-2xl border border-gray-800">
            <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-gray-400 mb-6">Sign up to discover movies</p>
            
            <RegisterForm onSuccess={() => navigate('/browse')} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 py-8 px-4">
        <div className="max-w-md mx-auto text-center text-gray-500 text-sm">
          <p>© 2024 Netflix Bot. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}