'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

interface Post {
  slug: string;
  title: string;
  date: string;
  tags?: string[];
  category?: string;
}

export default function WritingPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  useEffect(() => {
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => {
        setPosts(data);
        const tags = new Set<string>();
        data.forEach((post: Post) => {
          post.tags?.forEach(tag => tags.add(tag));
        });
        setAllTags(['All', ...Array.from(tags)]);
      })
      .catch(() => {
        setPosts([]);
      });
  }, []);

  const filteredPosts = selectedTag === 'All'
    ? posts
    : posts.filter(post => post.tags?.includes(selectedTag));

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
    <div className="animate-fade-in pt-8 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl md:text-4xl font-bold italic">Blog.</h1>
        <p className="font-typewriter text-sm opacity-60 mt-2">Ideas on GEO, AI, and product building.</p>
      </div>

      <div className="flex gap-16 lg:gap-24">
        {/* Main Content */}
        <div className="flex-1">
          {/* Filter */}
          <div className="mb-8 flex items-center gap-3">
            <span className="font-mono text-[10px] opacity-40 uppercase tracking-[0.2em]">Filter by tag:</span>
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="appearance-none border border-black/10 px-3 py-1.5 pr-8 bg-white/50 font-mono text-xs cursor-pointer hover:border-red-600/50 hover:bg-red-50/30 focus:outline-none focus:border-red-600 transition-all"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center' }}
            >
              {allTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>

          {/* Posts List */}
          <div className="space-y-8">
            {filteredPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/writing/${post.slug}`}
                className="block group"
              >
                <article className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6 py-4 border-b border-black/10 hover:border-red-600/30 transition-colors">
                  <time className="font-mono text-xs opacity-40 shrink-0 w-24">
                    {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                  </time>
                  <div className="flex-1">
                    <h2 className="font-serif text-lg md:text-xl group-hover:text-red-600 transition-colors">
                      {post.title}
                    </h2>
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {post.tags.map((tag: string) => (
                          <span key={tag} className="font-mono text-[10px] opacity-50 uppercase tracking-wider">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="opacity-0 group-hover:opacity-50 transition-opacity shrink-0 hidden sm:block"
                  >
                    <path d="M5 12h14"/>
                    <path d="m12 5 7 7-7 7"/>
                  </svg>
                </article>
              </Link>
            ))}

            {filteredPosts.length === 0 && (
              <div className="py-16 text-center">
                <p className="font-mono text-sm opacity-50">No posts found.</p>
              </div>
            )}
          </div>
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
