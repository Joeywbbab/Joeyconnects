import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

const GITHUB_OWNER = 'Joeywbbab';
const GITHUB_REPO = 'Joeyconnects';
const POSTS_PATH = 'blog/posts';

interface Post {
  id: string;
  title: string;
  date: string;
  excerpt: string;
}

export const WriteApp: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    setError(null);

    try {
      const listUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${POSTS_PATH}`;
      const listRes = await fetch(listUrl);

      if (!listRes.ok) {
        throw new Error(`GitHub API error: ${listRes.status}`);
      }

      const files = await listRes.json();

      if (!Array.isArray(files)) {
        throw new Error('Failed to read file list');
      }

      const mdFiles = files.filter(f => f.name && f.name.endsWith('.md'));

      const postsData = mdFiles.map((file) => ({
        id: file.name,
        title: file.name.replace(/\.md$/, ''),
        date: '',
        excerpt: ''
      }));

      setPosts(postsData);
    } catch (err) {
      console.error('Failed to load posts:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-ph-beige p-6">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold font-sans mb-4 text-red-500">
            Failed to Load
          </h2>
          <p className="font-mono text-sm text-gray-600 mb-6">{error}</p>
          <button
            onClick={loadPosts}
            className="px-6 py-2 bg-ph-blue text-white border-2 border-ph-black shadow-retro-sm hover:shadow-retro hover:-translate-y-1 transition-all font-bold font-sans"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-ph-beige p-6">
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold font-sans">Writing</h2>
          <button
            onClick={loadPosts}
            disabled={loading}
            className="px-3 py-1.5 text-sm bg-ph-blue text-white border-2 border-ph-black shadow-retro-sm hover:shadow-retro hover:-translate-y-1 transition-all font-bold font-sans flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <p className="text-gray-500 text-center font-mono py-8">Loading...</p>
          ) : posts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 font-mono mb-4">No posts found</p>
              <p className="text-sm text-gray-400 font-mono">
                GitHub repo: {GITHUB_OWNER}/{GITHUB_REPO}/{POSTS_PATH}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="p-4 bg-white border-2 border-ph-black shadow-retro-sm"
                >
                  <h3 className="text-base font-bold font-sans mb-1">
                    {post.title}
                  </h3>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
