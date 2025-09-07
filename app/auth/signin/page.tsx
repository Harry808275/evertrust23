'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

export default function SignInPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Redirect if already authenticated (run side-effect after render)
  useEffect(() => {
    if (status === 'authenticated' && session) {
      setIsRedirecting(true);
      const target = session.user?.role === 'admin' ? '/admin' : '/';
      // Use router.replace for faster navigation and prevent back button issues
      router.replace(target);
    }
  }, [status, session, router]);

  // Redirect if already authenticated - MOVED AFTER useEffect
  if (status === 'loading' || isRedirecting) {
    return (
      <div className="min-h-screen bg-white pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="font-body text-lg text-gray-600">
            {isRedirecting ? 'Redirecting...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
      }
      // Remove the router.push('/') here - let useEffect handle the redirect
      // This prevents the slow redirect and potential race conditions
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-24">
      <div className="container mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-md mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-heading text-4xl font-light text-black mb-4 tracking-wide">
              Welcome Back
            </h1>
            <p className="font-body text-lg text-gray-600">
              Sign in to your Style at Home account
            </p>
          </div>

          {/* Sign In Form */}
          <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg font-body text-sm"
                >
                  {error}
                </motion.div>
              )}

              <div>
                <label className="font-body font-medium text-black mb-2 block">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg font-body text-gray-700 focus:border-amber-400 focus:outline-none transition-colors"
                    placeholder="Enter your email"
                  />
                  <Mail size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="font-body font-medium text-black mb-2 block">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    required
                    className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-lg font-body text-gray-700 focus:border-amber-400 focus:outline-none transition-colors"
                    placeholder="Enter your password"
                  />
                  <Lock size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || isRedirecting}
                className={`w-full py-4 px-8 font-body font-medium tracking-wider transition-colors duration-300 uppercase rounded-lg flex items-center justify-center space-x-3 ${
                  isLoading || isRedirecting
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-black text-white hover:bg-gray-800'
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Signing In...</span>
                  </>
                ) : isRedirecting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Redirecting...</span>
                  </>
                ) : (
                  <span>Sign In</span>
                )}
              </button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="font-body text-gray-600">
                Don't have an account?{' '}
                <Link
                  href="/auth/signup"
                  className="text-amber-600 hover:text-amber-700 font-medium transition-colors"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
