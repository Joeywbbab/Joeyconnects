'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Post {
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt?: string;
  tags?: string[];
}

interface WritingGridProps {
  posts: Post[];
}

const categories = [
  { id: 'all', label: 'All' },
  { id: 'work', label: 'Work & Tech' },
  { id: 'thoughts', label: 'Society Observation' },
  { id: 'reviews', label: 'Growth' },
];

export default function WritingGrid({ posts }: WritingGridProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredPosts = activeCategory === 'all'
    ? posts
    : posts.filter((p) => p.category === activeCategory);

  // Count posts per category
  const categoryCounts = {
    all: posts.length,
    thoughts: posts.filter((p) => p.category === 'thoughts').length,
    work: posts.filter((p) => p.category === 'work').length,
    reviews: posts.filter((p) => p.category === 'reviews').length,
  };

  return (
    <>
      {/* Category Filter */}
      <div className="mb-10 flex flex-wrap gap-3">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 font-mono text-xs uppercase tracking-wider transition-all cursor-pointer border-2 ${
              activeCategory === cat.id
                ? 'border-red-600 text-black bg-transparent'
                : 'border-black/20 text-black/60 hover:border-black hover:text-black bg-transparent'
            }`}
          >
            {cat.label}
            <span className="ml-2 opacity-60">({categoryCounts[cat.id as keyof typeof categoryCounts]})</span>
          </button>
        ))}
      </div>

      {/* Posts List */}
      <div className="space-y-6">
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
                  <div className="flex gap-2 mt-1">
                    {post.tags.map((tag: string) => (
                      <span key={tag} className="px-2 py-0.5 text-[10px] uppercase font-mono border border-black/20 text-black/50">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                {post.excerpt && (
                  <p className="font-typewriter text-sm opacity-60 mt-1 line-clamp-2">
                    {post.excerpt}
                  </p>
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
          <div className="text-center py-20">
            <p className="font-typewriter text-xl opacity-60">No posts in this category yet.</p>
          </div>
        )}
      </div>
    </>
  );
}
