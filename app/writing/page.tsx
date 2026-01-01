'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import WritingGrid from '@/components/WritingGrid';

interface Post {
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt?: string;
  tags?: string[];
}

export default function WritingPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  useEffect(() => {
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => {
        setPosts(data);
      })
      .catch(() => {
        setPosts([]);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    await new Promise(resolve => setTimeout(resolve, 1000));
    setStatus('success');
    setEmail('');
    setTimeout(() => setStatus('idle'), 3000);
  };

  return (
    <div className="container-wide animate-slide-up pt-8">
      {/* Minimal Header - matching Projects page */}
      <div className="mb-8 flex items-center justify-between">
        <div className="text-[10px] font-mono opacity-40 tracking-[0.2em] uppercase">
          Archive / Essays & Notes
        </div>
        <div className="text-[10px] font-mono opacity-30 tracking-[0.2em] uppercase">
          {posts.length} Posts
        </div>
      </div>

      <div className="flex gap-16 lg:gap-24">
        {/* Main Content */}
        <div className="flex-1">
          <WritingGrid posts={posts} />
        </div>

        {/* Right Sidebar - Newsletter */}
        <aside className="hidden lg:block w-64 flex-shrink-0 self-start sticky top-28">
          <div className="border-l border-black/10 pl-8">
            <h3 className="font-serif italic text-xl mb-2">Stay Updated</h3>
            <p className="font-typewriter text-xs opacity-60 mb-6 leading-relaxed">
              Get notified when I publish new posts about GEO, AI, and product building.
            </p>

            {status === 'success' ? (
              <div className="bg-green-50 border border-green-200 px-4 py-3">
                <p className="font-typewriter text-xs text-green-700">
                  Thanks for subscribing!
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-3 py-2 border border-black/10 font-mono text-xs bg-white/50 focus:outline-none focus:border-red-600 transition-colors"
                  required
                  disabled={status === 'loading'}
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full bg-black text-white px-4 py-2 font-mono text-[10px] uppercase tracking-widest hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
                </button>
              </form>
            )}

            <p className="font-mono text-[9px] opacity-40 mt-4 uppercase tracking-wider">
              No spam. Unsubscribe anytime.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
