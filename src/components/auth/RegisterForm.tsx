import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext';
import { RegisterData } from '@/types/user';

interface RegisterFormProps {
  onSuccess?: () => void;
}

export default function RegisterForm({ onSuccess }: RegisterFormProps) {
  const { register } = useAuth();
  const [formData, setFormData] = useState<RegisterData>({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    gender: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (field: keyof RegisterData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const validateForm = (): string | null => {
    if (!formData.full_name || formData.full_name.length < 2) {
      return 'Full name must be at least 2 characters';
    }
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return 'Please enter a valid email address';
    }
    if (!formData.phone || formData.phone.length < 10) {
      return 'Please enter a valid phone number (at least 10 digits)';
    }
    if (!formData.password || formData.password.length < 8) {
      return 'Password must be at least 8 characters';
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

    const result = await register(formData);
    
    setLoading(false);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        onSuccess?.();
      }, 500);
    } else {
      setError(result.error || 'Registration failed. Please try again.');
    }
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-white text-2xl">✓</span>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Registration Successful!</h3>
        <p className="text-gray-400">Redirecting to browse...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="full_name" className="text-gray-300">Full Name</Label>
        <Input
          id="full_name"
          type="text"
          placeholder="Enter your full name"
          value={formData.full_name}
          onChange={(e) => handleChange('full_name', e.target.value)}
          className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-netflix-red focus:ring-netflix-red"
          disabled={loading}
        />
      </div>

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
        <Label htmlFor="phone" className="text-gray-300">Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="Enter your phone number"
          value={formData.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-netflix-red focus:ring-netflix-red"
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-gray-300">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Create a password (min 8 characters)"
          value={formData.password}
          onChange={(e) => handleChange('password', e.target.value)}
          className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-netflix-red focus:ring-netflix-red"
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="gender" className="text-gray-300">Gender (Optional)</Label>
        <Select 
          value={formData.gender} 
          onValueChange={(value) => handleChange('gender', value)}
        >
          <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
            <SelectValue placeholder="Select your gender" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            <SelectItem value="male" className="text-white focus:bg-gray-700 focus:text-white">Male</SelectItem>
            <SelectItem value="female" className="text-white focus:bg-gray-700 focus:text-white">Female</SelectItem>
            <SelectItem value="other" className="text-white focus:bg-gray-700 focus:text-white">Other</SelectItem>
            <SelectItem value="prefer_not_to_say" className="text-white focus:bg-gray-700 focus:text-white">Prefer not to say</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-netflix-red hover:bg-red-700 text-white font-semibold py-2.5"
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Creating Account...
          </span>
        ) : (
          'Create Account'
        )}
      </Button>

      <p className="text-center text-gray-400 text-sm">
        Already have an account?{' '}
        <Link to="/login" className="text-white hover:underline font-semibold">
          Sign in
        </Link>
      </p>
    </form>
  );
}