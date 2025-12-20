import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, LogOut, User } from 'lucide-react';

export const LoginApp: React.FC = () => {
  const { user, isAdmin, signIn, signOut } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signIn(email, password);
      setEmail('');
      setPassword('');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
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
