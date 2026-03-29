import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const { loginWithEmail, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: Location })?.from?.pathname ?? '/';

  const [error, setError] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginForm) => {
    try {
      setError('');
      await loginWithEmail(data.email, data.password);
      navigate(from, { replace: true });
    } catch {
      setError('Invalid email or password. Please try again.');
    }
  };

  const handleGoogle = async () => {
    try {
      setGoogleLoading(true);
      setError('');
      await loginWithGoogle();
      navigate(from, { replace: true });
    } catch {
      setError('Google sign-in failed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 to-secondary-500 text-white flex-col justify-center px-16">
        <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center mb-6">
          <span className="font-heading font-bold text-2xl">GN</span>
        </div>
        <h1 className="font-heading font-bold text-4xl mb-4 leading-tight">
          GNHS SSLG<br />Portal
        </h1>
        <p className="text-primary-100 italic text-lg">
          "Happy, Ready, and Willing to Serve"
        </p>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="font-heading font-bold text-2xl text-gray-900">Sign In</h2>
            <p className="text-gray-500 text-sm mt-1">
              Access the GNHS SSLG student portal
            </p>
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              required
              error={errors.email?.message}
              {...register('email')}
              placeholder="you@example.com"
            />
            <Input
              label="Password"
              type="password"
              required
              error={errors.password?.message}
              {...register('password')}
              placeholder="••••••••"
            />
            <Button type="submit" loading={isSubmitting} className="w-full" size="lg">
              Sign In
            </Button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <hr className="flex-1 border-gray-200" />
            <span className="text-xs text-gray-400">or</span>
            <hr className="flex-1 border-gray-200" />
          </div>

          <Button
            variant="outline"
            onClick={handleGoogle}
            loading={googleLoading}
            className="w-full"
            size="lg"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </Button>

          <p className="text-center text-xs text-gray-500 mt-6">
            By signing in, you agree to the GNHS SSLG Portal's terms of use.{' '}
            <Link to="/" className="text-primary-500 hover:underline">
              Go back to Home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
