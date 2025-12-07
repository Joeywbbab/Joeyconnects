import React, { useState, useEffect, useMemo } from 'react';
import { List } from 'lucide-react';
import { Post, parseFrontmatter } from '../utils/markdown';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const GITHUB_OWNER = 'Joeywbbab';
const GITHUB_REPO = 'Joeyconnects';
const POSTS_PATH = 'blog/posts';

type Category = 'blog' | 'newsletter' | 'tutorials';

// Extract headings from markdown for table of contents
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
  selectedTag: string | null;
  onTagChange: (tag: string | null) => void;
  onSelect: (post: Post) => void;
  loading: boolean;
}

const PostListView: React.FC<PostListViewProps> = ({
  posts,
  selectedCategory,
  onCategoryChange,
  selectedTag,
  onTagChange,
  onSelect,
  loading
}) => {
  // Get all unique tags from posts
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    posts.forEach(post => {
      post.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [posts]);

  const filteredPosts = useMemo(() => {
    let filtered = posts;
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    
    // Filter by tag
    if (selectedTag) {
      filtered = filtered.filter(p => p.tags.includes(selectedTag));
    }
    
    return filtered;
  }, [posts, selectedCategory, selectedTag]);

  const categories: Array<{ key: Category | 'all'; label: string }> = [
    { key: 'all', label: 'All' },
    { key: 'blog', label: 'Blog' },
    { key: 'newsletter', label: 'Newsletter' },
    { key: 'tutorials', label: 'Tutorials' }
  ];

  // Format date for display
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Filter bar */}
      <div className="border-b-2 border-ph-black bg-ph-beige px-4 py-3">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm font-mono text-gray-700">where</span>
          
          {/* Category filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-mono text-gray-700">category</span>
            <span className="text-sm font-mono text-gray-700">eq</span>
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value as Category | 'all')}
              className="px-3 py-1 text-sm font-mono bg-white border-2 border-ph-black focus:outline-none focus:ring-2 focus:ring-ph-blue cursor-pointer"
            >
              {categories.map(({ key, label }) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Tag filter */}
          {allTags.length > 0 && (
            <>
              <span className="text-sm font-mono text-gray-700">and</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono text-gray-700">tags</span>
                <span className="text-sm font-mono text-gray-700">includes</span>
                <select
                  value={selectedTag || 'all'}
                  onChange={(e) => onTagChange(e.target.value === 'all' ? null : e.target.value)}
                  className="px-3 py-1 text-sm font-mono bg-white border-2 border-ph-black focus:outline-none focus:ring-2 focus:ring-ph-blue cursor-pointer"
                >
                  <option value="all">All</option>
                  {allTags.map(tag => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {/* Title */}
        <h1 className="text-3xl font-bold font-sans mb-6">posts.psheet</h1>

        {/* Table */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500 font-mono">Loading posts...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 font-mono mb-2">No posts found</p>
            {(selectedCategory !== 'all' || selectedTag) && (
              <p className="text-sm text-gray-400 font-mono">
                Try adjusting your filters
              </p>
            )}
          </div>
        ) : (
          <div className="border-2 border-ph-black bg-white">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b-2 border-ph-black">
                  <th className="text-left px-4 py-3 text-sm font-bold font-sans border-r-2 border-ph-black">Date</th>
                  <th className="text-left px-4 py-3 text-sm font-bold font-sans border-r-2 border-ph-black">Title</th>
                  <th className="text-left px-4 py-3 text-sm font-bold font-sans">Tags</th>
                </tr>
              </thead>
              <tbody>
                {filteredPosts.map((post, index) => (
                  <tr
                    key={post.id}
                    onClick={() => onSelect(post)}
                    className={`border-b border-gray-300 hover:bg-gray-50 cursor-pointer transition-colors ${
                      index === filteredPosts.length - 1 ? '' : ''
                    }`}
                  >
                    <td className="px-4 py-3 text-sm font-mono text-gray-600 border-r-2 border-ph-black">
                      {formatDate(post.date)}
                    </td>
                    <td className="px-4 py-3 border-r-2 border-ph-black">
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelect(post);
                        }}
                        className="text-left font-sans font-medium text-gray-900 hover:text-ph-blue underline decoration-1 underline-offset-2 transition-colors cursor-pointer"
                      >
                        {post.title}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-x-2 gap-y-1">
                        {post.tags.length > 0 ? (
                          post.tags.map((tag, tagIndex) => (
                            <span key={tag} className="inline-flex items-center">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onTagChange(tag);
                                }}
                                className={`text-xs font-mono underline decoration-1 underline-offset-2 transition-colors ${
                                  selectedTag === tag
                                    ? 'text-ph-blue font-semibold'
                                    : 'text-gray-600 hover:text-ph-blue'
                                }`}
                              >
                                {tag}
                              </button>
                              {tagIndex < post.tags.length - 1 && (
                                <span className="text-xs text-gray-400 mx-1">,</span>
                              )}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs font-mono text-gray-400">—</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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

        <div className="prose prose-base max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({node, ...props}) => <h1 id={props.children?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-')} className="font-sans font-bold text-3xl mt-8 mb-6" {...props} />,
              h2: ({node, ...props}) => <h2 id={props.children?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-')} className="font-sans font-bold text-2xl mt-8 mb-4" {...props} />,
              h3: ({node, ...props}) => <h3 id={props.children?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-')} className="font-sans font-bold text-xl mt-6 mb-3" {...props} />,
              h4: ({node, ...props}) => <h4 id={props.children?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-')} className="font-sans font-bold text-lg mt-4 mb-2" {...props} />,
              h5: ({node, ...props}) => <h5 id={props.children?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-')} className="font-sans font-bold text-base mt-4 mb-2" {...props} />,
              h6: ({node, ...props}) => <h6 id={props.children?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-')} className="font-sans font-bold text-sm mt-4 mb-2" {...props} />,
              p: ({node, ...props}) => <p className="text-gray-700 leading-relaxed mb-6" {...props} />,
              strong: ({node, ...props}) => <strong className="text-gray-900 font-bold" {...props} />,
              ul: ({node, ...props}) => <ul className="my-6 list-disc list-inside" {...props} />,
              ol: ({node, ...props}) => <ol className="my-6 list-decimal list-inside" {...props} />,
              li: ({node, ...props}) => <li className="text-gray-700 leading-relaxed mb-2" {...props} />,
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>
      </div>

      {/* Right sidebar - Table of contents */}
      {headings.length > 0 && (
        <div className="w-52 flex-shrink-0 border-l-2 border-ph-black pl-3 overflow-y-auto">
          <h3 className="text-xs font-bold font-sans mb-2 text-gray-700">Jump to:</h3>
          <div className="space-y-1">
            {headings.map((heading, index) => (
              <a
                key={index}
                href={`#${heading.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById(heading.id);
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className="block text-xs font-mono text-gray-600 hover:text-ph-blue transition-colors leading-tight cursor-pointer"
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
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
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

      // Use GitHub token if available (increases rate limit from 60/hour to 5000/hour)
      const headers: HeadersInit = {};
      const githubToken = import.meta.env.VITE_GITHUB_TOKEN;
      if (githubToken && githubToken !== 'your_token_here') {
        headers['Authorization'] = `token ${githubToken}`;
      }

      console.log('[WriteApp] Fetching posts from:', listUrl);
      const listRes = await fetch(listUrl, { headers });

      if (!listRes.ok) {
        throw new Error(`GitHub API error: ${listRes.status}`);
      }

      const files = await listRes.json();
      console.log('[WriteApp] Found files:', files);

      if (!Array.isArray(files)) {
        throw new Error('Failed to read file list');
      }

      const mdFiles = files.filter(f => f.name && f.name.endsWith('.md'));
      console.log('[WriteApp] Markdown files:', mdFiles.map(f => f.name));

      const postPromises = mdFiles.map(async (file) => {
        try {
          console.log('[WriteApp] Fetching content for:', file.name);
          // Don't use auth headers for raw.githubusercontent.com to avoid CORS preflight issues
          const contentRes = await fetch(file.download_url);
          if (!contentRes.ok) {
            console.error(`Failed to read file ${file.name}`);
            return null;
          }
          const content = await contentRes.text();
          console.log('[WriteApp] Parsing:', file.name);
          const post = parseFrontmatter(content, file.name);
          console.log('[WriteApp] Parsed post:', post);
          return post;
        } catch (err) {
          console.error(`Failed to parse file ${file.name}:`, err);
          return null;
        }
      });

      const postsData = await Promise.all(postPromises);
      const validPosts = postsData.filter((p): p is Post => p !== null);
      console.log('[WriteApp] Valid posts:', validPosts);

      validPosts.sort((a, b) => {
        const dateA = new Date(a.date || 0).getTime();
        const dateB = new Date(b.date || 0).getTime();
        return dateB - dateA;
      });

      setPosts(validPosts);
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
          selectedTag={selectedTag}
          onTagChange={setSelectedTag}
          onSelect={setSelectedPost}
          loading={loading}
        />
      )}
    </div>
  );
};
