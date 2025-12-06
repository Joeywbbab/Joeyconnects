import React, { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { Post, parseFrontmatter } from '../utils/markdown';

// GitHub配置 - 用户需要修改这些值
const GITHUB_OWNER = 'joeyconnects'; // 替换为你的GitHub用户名
const GITHUB_REPO = 'blog'; // 替换为你的repo名称
const POSTS_PATH = 'posts'; // posts文件夹路径

interface PostListProps {
  posts: Post[];
  onSelect: (post: Post) => void;
  onRefresh: () => void;
  loading: boolean;
}

const PostList: React.FC<PostListProps> = ({ posts, onSelect, onRefresh, loading }) => {
  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold font-sans">Blog Posts</h2>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="px-4 py-2 bg-ph-blue text-white border-2 border-ph-black shadow-retro-sm hover:shadow-retro hover:-translate-y-1 transition-all font-bold font-sans flex items-center gap-2 disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          刷新
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4">
        {loading ? (
          <p className="text-gray-500 text-center font-mono">加载中...</p>
        ) : posts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 font-mono mb-4">没有找到文章</p>
            <p className="text-sm text-gray-400 font-mono">
              请在 GitHub repo: {GITHUB_OWNER}/{GITHUB_REPO}/{POSTS_PATH}
            </p>
          </div>
        ) : (
          posts.map((post) => (
            <button
              key={post.id}
              onClick={() => onSelect(post)}
              className="w-full text-left p-4 bg-white border-2 border-ph-black shadow-retro-sm hover:shadow-retro hover:-translate-y-1 transition-all"
            >
              <h3 className="text-xl font-bold font-sans mb-2">{post.title}</h3>
              <div className="flex items-center gap-2 mb-2 text-sm text-gray-500 font-mono">
                <span>{post.date}</span>
                {post.tags.length > 0 && (
                  <>
                    <span>•</span>
                    {post.tags.map(tag => (
                      <span key={tag} className="text-ph-blue">#{tag}</span>
                    ))}
                  </>
                )}
              </div>
              <p className="text-sm text-gray-600 font-mono line-clamp-2">
                {post.excerpt}
              </p>
              <div className="mt-3 text-ph-blue font-mono text-sm">
                Read More →
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

interface PostDetailProps {
  post: Post;
  onBack: () => void;
}

const PostDetail: React.FC<PostDetailProps> = ({ post, onBack }) => {
  return (
    <div className="h-full flex flex-col">
      <button
        onClick={onBack}
        className="mb-6 px-4 py-2 bg-white border-2 border-ph-black shadow-retro-sm hover:shadow-retro hover:-translate-y-1 transition-all font-bold font-sans flex items-center gap-2 w-fit"
      >
        <ArrowLeft size={16} />
        返回
      </button>

      <div className="flex-1 overflow-y-auto">
        <h1 className="text-4xl font-bold font-sans mb-4">{post.title}</h1>

        <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-ph-black">
          <span className="text-gray-600 font-mono">{post.date}</span>
          {post.tags.length > 0 && (
            <div className="flex gap-2">
              {post.tags.map(tag => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-ph-blue text-white text-xs font-mono rounded"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="prose prose-lg max-w-none">
          <div className="font-mono text-base leading-relaxed whitespace-pre-wrap">
            {post.content}
          </div>
        </div>
      </div>
    </div>
  );
};

export const WriteApp: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    setError(null);

    try {
      // 1. 获取文件列表
      const listUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${POSTS_PATH}`;
      const listRes = await fetch(listUrl);

      if (!listRes.ok) {
        throw new Error(`GitHub API错误: ${listRes.status} ${listRes.statusText}`);
      }

      const files = await listRes.json();

      if (!Array.isArray(files)) {
        throw new Error('无法读取文件列表');
      }

      // 2. 读取每个Markdown文件内容
      const postPromises = files
        .filter(f => f.name && f.name.endsWith('.md'))
        .map(async (file) => {
          try {
            const contentRes = await fetch(file.download_url);
            if (!contentRes.ok) {
              console.error(`无法读取文件 ${file.name}`);
              return null;
            }
            const content = await contentRes.text();
            return parseFrontmatter(content, file.name);
          } catch (err) {
            console.error(`解析文件 ${file.name} 失败:`, err);
            return null;
          }
        });

      const postsData = await Promise.all(postPromises);
      const validPosts = postsData.filter((p): p is Post => p !== null);

      // 3. 按日期排序
      validPosts.sort((a, b) => {
        const dateA = new Date(a.date || 0).getTime();
        const dateB = new Date(b.date || 0).getTime();
        return dateB - dateA;
      });

      setPosts(validPosts);
    } catch (err) {
      console.error('加载文章失败:', err);
      setError(err instanceof Error ? err.message : '未知错误');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-ph-beige p-6">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold font-sans mb-4 text-red-500">加载失败</h2>
          <p className="font-mono text-sm text-gray-600 mb-6">{error}</p>
          <button
            onClick={loadPosts}
            className="px-6 py-2 bg-ph-blue text-white border-2 border-ph-black shadow-retro-sm hover:shadow-retro hover:-translate-y-1 transition-all font-bold font-sans"
          >
            重试
          </button>
          <div className="mt-6 p-4 bg-yellow-50 border-2 border-yellow-300 text-left">
            <p className="font-mono text-xs text-gray-700 mb-2">
              请确保：
            </p>
            <ul className="font-mono text-xs text-gray-600 space-y-1 list-disc list-inside">
              <li>GitHub repo是public的</li>
              <li>repo路径正确: {GITHUB_OWNER}/{GITHUB_REPO}/{POSTS_PATH}</li>
              <li>posts文件夹中有.md文件</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-ph-beige p-6">
      {selectedPost ? (
        <PostDetail post={selectedPost} onBack={() => setSelectedPost(null)} />
      ) : (
        <PostList
          posts={posts}
          onSelect={setSelectedPost}
          onRefresh={loadPosts}
          loading={loading}
        />
      )}
    </div>
  );
};
