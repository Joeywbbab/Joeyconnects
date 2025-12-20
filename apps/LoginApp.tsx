import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, LogOut, User } from 'lucide-react';

export const LoginApp: React.FC = () => {
  const { user, isAdmin, signInWithPassword, signInWithGoogle, signOut } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signInWithPassword(email, password);
      setEmail('');
      setPassword('');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google');
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut();
    } catch (err: any) {
      setError(err.message || 'Failed to sign out');
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return (
      <div className="h-full bg-white p-8 font-sans">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <User className="text-ph-blue" size={32} />
            <h1 className="text-3xl font-bold">Account</h1>
          </div>

          <div className="bg-ph-beige border-2 border-ph-black p-6 shadow-retro-sm mb-6">
            <div className="mb-4">
              <p className="text-sm text-gray-600 font-mono mb-1">Email</p>
              <p className="font-bold">{user.email}</p>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-600 font-mono mb-1">Role</p>
              <span className={`inline-block px-3 py-1 text-sm font-bold border-2 border-ph-black ${isAdmin ? 'bg-ph-orange' : 'bg-gray-200'}`}>
                {isAdmin ? 'ADMIN' : 'VIEWER'}
              </span>
            </div>
            {isAdmin && (
              <div className="mt-4 p-3 bg-yellow-50 border-2 border-yellow-400">
                <p className="text-sm font-mono text-yellow-800">
                  ✓ You have full edit permissions
                </p>
              </div>
            )}
          </div>

          <button
            onClick={handleSignOut}
            disabled={loading}
            className="w-full px-4 py-3 bg-ph-red text-white border-2 border-ph-black shadow-retro-sm hover:shadow-retro hover:-translate-y-1 transition-all font-bold flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-white p-8 font-sans">
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <LogIn className="text-ph-blue" size={32} />
          <h1 className="text-3xl font-bold">Sign In</h1>
        </div>

        <div className="mb-6 p-4 bg-blue-50 border-2 border-ph-blue">
          <p className="text-sm font-mono">
            <strong>Visitor Mode:</strong> You can view all content without signing in.
            <br />
            <strong>Admin Mode:</strong> Sign in to create, edit, and delete content.
          </p>
        </div>

        {/* Google Sign In Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full px-4 py-3 bg-white text-gray-700 border-2 border-ph-black shadow-retro-sm hover:shadow-retro hover:-translate-y-1 transition-all font-bold flex items-center justify-center gap-3 disabled:opacity-50 mb-6"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {loading ? 'Signing in...' : 'Continue with Google'}
        </button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t-2 border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500 font-mono">Or sign in with email</span>
          </div>
        </div>

        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label className="block text-sm font-mono font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border-2 border-ph-black font-mono focus:outline-none focus:ring-2 focus:ring-ph-blue"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-mono font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border-2 border-ph-black font-mono focus:outline-none focus:ring-2 focus:ring-ph-blue"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border-2 border-red-400 text-red-700 text-sm font-mono">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 bg-ph-blue text-white border-2 border-ph-black shadow-retro-sm hover:shadow-retro hover:-translate-y-1 transition-all font-bold disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500 font-mono">
          <p>Admin access only. Visitors can browse freely.</p>
        </div>
      </div>
    </div>
  );
};
