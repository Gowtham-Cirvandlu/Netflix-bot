import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { LoginCredentials } from '@/types/user';

interface LoginFormProps {
  onSuccess?: () => void;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const { login } = useAuth();
  const [formData, setFormData] = useState<LoginCredentials>({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: keyof LoginCredentials, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const validateForm = (): string | null => {
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return 'Please enter a valid email address';
    }
    if (!formData.password) {
      return 'Please enter your password';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);

    const result = await login(formData);
    
    setLoading(false);

    if (result.success) {
      onSuccess?.();
    } else {
      setError(result.error || 'Login failed. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email" className="text-gray-300">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-netflix-red focus:ring-netflix-red"
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-gray-300">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-netflix-red focus:ring-netflix-red pr-10"
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            disabled={loading}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center space-x-2 text-sm text-gray-400 cursor-pointer">
          <input
            type="checkbox"
            className="rounded border-gray-700 bg-gray-800 text-netflix-red focus:ring-netflix-red"
          />
          <span>Remember me</span>
        </label>
        <Link to="#" className="text-sm text-gray-400 hover:text-white hover:underline">
          Forgot password?
        </Link>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-netflix-red hover:bg-red-700 text-white font-semibold py-2.5"
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Signing In...
          </span>
        ) : (
          'Sign In'
        )}
      </Button>

      <p className="text-center text-gray-400 text-sm">
        New to Netflix Bot?{' '}
        <Link to="/register" className="text-white hover:underline font-semibold">
          Sign up now
        </Link>
      </p>
    </form>
  );
}