import React, { useState, useEffect, useMemo } from 'react';
import { List, RefreshCw } from 'lucide-react';
import { Post, parseFrontmatter } from '../utils/markdown';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// GitHub配置 - 用户需要修改这些值
const GITHUB_OWNER = 'Joeywbbab';
const GITHUB_REPO = 'Joeyconnects';
const POSTS_PATH = 'blog/posts';

type Category = 'blog' | 'newsletter' | 'tutorials';

// 从markdown内容提取标题作为目录
function extractHeadings(content: string): { level: number; text: string; id: string }[] {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const headings: { level: number; text: string; id: string }[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    headings.push({ level, text, id });
  }

  return headings;
}

interface PostListViewProps {
  posts: Post[];
  selectedCategory: Category | 'all';
  onCategoryChange: (category: Category | 'all') => void;
  onSelect: (post: Post) => void;
  onRefresh: () => void;
  loading: boolean;
}

const PostListView: React.FC<PostListViewProps> = ({
  posts,
  selectedCategory,
  onCategoryChange,
  onSelect,
  onRefresh,
  loading
}) => {
  const filteredPosts = useMemo(() => {
    if (selectedCategory === 'all') return posts;
    return posts.filter(p => p.category === selectedCategory);
  }, [posts, selectedCategory]);

  const categories: Array<{ key: Category | 'all'; label: string }> = [
    { key: 'all', label: 'All' },
    { key: 'blog', label: 'Blog' },
    { key: 'newsletter', label: 'Newsletter' },
    { key: 'tutorials', label: 'Tutorials' }
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header with category filters */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold font-sans">Writing</h2>
          <button
            onClick={onRefresh}
            disabled={loading}
            className="px-3 py-1.5 text-sm bg-ph-blue text-white border-2 border-ph-black shadow-retro-sm hover:shadow-retro hover:-translate-y-1 transition-all font-bold font-sans flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 border-b-2 border-ph-black pb-2">
          {categories.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => onCategoryChange(key)}
              className={`px-4 py-2 font-mono text-sm transition-all ${
                selectedCategory === key
                  ? 'bg-ph-blue text-white border-2 border-ph-black shadow-retro-sm'
                  : 'text-gray-600 hover:text-ph-black'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Posts table */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <p className="text-gray-500 text-center font-mono py-8">Loading...</p>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 font-mono mb-4">No posts found</p>
            <p className="text-sm text-gray-400 font-mono">
              GitHub repo: {GITHUB_OWNER}/{GITHUB_REPO}/{POSTS_PATH}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredPosts.map((post) => (
              <button
                key={post.id}
                onClick={() => onSelect(post)}
                className="w-full text-left p-4 bg-white border-2 border-ph-black shadow-retro-sm hover:shadow-retro hover:-translate-y-1 transition-all flex items-start justify-between group"
              >
                <div className="flex-1">
                  <h3 className="text-base font-bold font-sans mb-1 group-hover:text-ph-blue transition-colors">
                    {post.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-gray-500 font-mono">
                    <span>{post.date}</span>
                    {post.tags.length > 0 && (
                      <>
                        <span>•</span>
                        <div className="flex gap-2">
                          {post.tags.map(tag => (
                            <span key={tag} className="text-ph-blue">#{tag}</span>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="text-ph-blue font-mono text-xs mt-1">→</div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

interface PostDetailViewProps {
  post: Post;
  allPosts: Post[];
  onSelectPost: (post: Post) => void;
  onBack: () => void;
}

const PostDetailView: React.FC<PostDetailViewProps> = ({ post, allPosts, onSelectPost, onBack }) => {
  const headings = useMemo(() => extractHeadings(post.content), [post.content]);

  return (
    <div className="h-full flex gap-4">
      {/* Left sidebar - Post list */}
      <div className="w-56 flex-shrink-0 border-r-2 border-ph-black pr-3 overflow-y-auto">
        <button
          onClick={onBack}
          className="mb-3 px-2 py-1 text-xs bg-white border-2 border-ph-black shadow-retro-sm hover:shadow-retro hover:-translate-y-1 transition-all font-bold font-sans flex items-center gap-1.5"
        >
          <List size={12} />
          All Posts
        </button>

        <div className="space-y-0.5">
          {allPosts.map((p) => (
            <button
              key={p.id}
              onClick={() => onSelectPost(p)}
              className={`w-full text-left px-2 py-1.5 text-xs font-mono transition-all ${
                p.id === post.id
                  ? 'bg-ph-blue text-white border-2 border-ph-black'
                  : 'text-gray-600 hover:text-ph-black hover:bg-gray-100'
              }`}
            >
              {p.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto pr-4">
        <h1 className="text-3xl font-bold font-sans mb-3">{post.title}</h1>

        <div className="flex items-center gap-3 mb-6 pb-3 border-b-2 border-ph-black">
          <span className="text-gray-600 font-mono text-xs">{post.date}</span>
          {post.tags.length > 0 && (
            <>
              <span className="text-gray-400">•</span>
              <div className="flex gap-2">
                {post.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 bg-ph-blue text-white text-xs font-mono rounded"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </>
          )}
          <span className="ml-auto px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-mono rounded border border-gray-300">
            {post.category}
          </span>
        </div>

        <div className="prose prose-sm max-w-none prose-headings:font-sans prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-3 prose-p:text-gray-700 prose-p:leading-7 prose-p:mb-4 prose-strong:text-gray-900 prose-strong:font-bold prose-ul:my-4 prose-li:text-gray-700">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </div>
      </div>

      {/* Right sidebar - Table of contents */}
      {headings.length > 0 && (
        <div className="w-52 flex-shrink-0 border-l-2 border-ph-black pl-3 overflow-y-auto">
          <h3 className="text-xs font-bold font-sans mb-2 text-gray-700">On this page</h3>
          <div className="space-y-1">
            {headings.map((heading, index) => (
              <a
                key={index}
                href={`#${heading.id}`}
                className="block text-xs font-mono text-gray-600 hover:text-ph-blue transition-colors leading-tight"
                style={{ paddingLeft: `${(heading.level - 1) * 8}px` }}
              >
                {heading.text}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const WriteApp: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    setError(null);

    try {
      // Check cache first (5 minute cache)
      const cacheKey = `blog-posts-${GITHUB_OWNER}-${GITHUB_REPO}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        const age = Date.now() - timestamp;
        if (age < 5 * 60 * 1000) { // 5 minutes
          setPosts(data);
          setLoading(false);
          return;
        }
      }

      const listUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${POSTS_PATH}`;
      const listRes = await fetch(listUrl);

      if (!listRes.ok) {
        throw new Error(`GitHub API error: ${listRes.status} ${listRes.statusText}`);
      }

      const files = await listRes.json();

      if (!Array.isArray(files)) {
        throw new Error('Failed to read file list');
      }

      const postPromises = files
        .filter(f => f.name && f.name.endsWith('.md'))
        .map(async (file) => {
          try {
            const contentRes = await fetch(file.download_url);
            if (!contentRes.ok) {
              console.error(`Failed to read file ${file.name}`);
              return null;
            }
            const content = await contentRes.text();
            return parseFrontmatter(content, file.name);
          } catch (err) {
            console.error(`Failed to parse file ${file.name}:`, err);
            return null;
          }
        });

      const postsData = await Promise.all(postPromises);
      const validPosts = postsData.filter((p): p is Post => p !== null);

      validPosts.sort((a, b) => {
        const dateA = new Date(a.date || 0).getTime();
        const dateB = new Date(b.date || 0).getTime();
        return dateB - dateA;
      });

      // Save to cache
      localStorage.setItem(cacheKey, JSON.stringify({
        data: validPosts,
        timestamp: Date.now()
      }));

      setPosts(validPosts);
    } catch (err) {
      console.error('Failed to load posts:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    const is403 = error.includes('403');
    return (
      <div className="h-full flex flex-col items-center justify-center bg-ph-beige p-6">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold font-sans mb-4 text-red-500">
            {is403 ? 'GitHub API Rate Limit Exceeded' : 'Failed to Load'}
          </h2>
          <p className="font-mono text-sm text-gray-600 mb-6">{error}</p>
          <button
            onClick={loadPosts}
            className="px-6 py-2 bg-ph-blue text-white border-2 border-ph-black shadow-retro-sm hover:shadow-retro hover:-translate-y-1 transition-all font-bold font-sans"
          >
            Retry
          </button>
          <div className="mt-6 p-4 bg-yellow-50 border-2 border-yellow-300 text-left">
            <p className="font-mono text-xs text-gray-700 mb-2 font-bold">
              {is403 ? 'GitHub API Limits:' : 'Please ensure:'}
            </p>
            {is403 ? (
              <ul className="font-mono text-xs text-gray-600 space-y-1 list-disc list-inside">
                <li>Unauthenticated: 60 requests/hour</li>
                <li>Wait a bit and refresh, or try again in an hour</li>
                <li>Browser cache may help reduce API calls</li>
              </ul>
            ) : (
              <ul className="font-mono text-xs text-gray-600 space-y-1 list-disc list-inside">
                <li>GitHub repo is public</li>
                <li>Repo path is correct: {GITHUB_OWNER}/{GITHUB_REPO}/{POSTS_PATH}</li>
                <li>Posts folder contains .md files</li>
              </ul>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-ph-beige p-6">
      {selectedPost ? (
        <PostDetailView
          post={selectedPost}
          allPosts={posts}
          onSelectPost={setSelectedPost}
          onBack={() => setSelectedPost(null)}
        />
      ) : (
        <PostListView
          posts={posts}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          onSelect={setSelectedPost}
          onRefresh={loadPosts}
          loading={loading}
        />
      )}
    </div>
  );
};
