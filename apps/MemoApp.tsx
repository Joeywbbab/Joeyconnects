import React, { useState, useEffect } from 'react';
import { supabase, Memo } from '../services/supabase';

// Hashtag提取函数
function extractHashtags(text: string): string[] {
  const regex = /#[\p{L}\p{N}_]+/gu;
  const matches = text.match(regex) || [];
  return matches.map(tag => tag.slice(1)); // 去掉 #
}

// 日期格式化
function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));

  if (hours < 1) return '刚刚';
  if (hours < 24) return `${hours}小时前`;

  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Memo卡片组件
interface MemoCardProps {
  memo: Memo;
  onDelete: (id: string) => void;
}

const MemoCard: React.FC<MemoCardProps> = ({ memo, onDelete }) => {
  return (
    <div className="p-4 bg-white border-2 border-ph-black shadow-retro-sm">
      <div className="flex justify-between items-start mb-2">
        <div className="text-xs text-gray-500 font-mono">
          {formatDate(memo.created_at)}
        </div>
        <button
          onClick={() => onDelete(memo.id)}
          className="text-xs text-red-500 hover:underline font-mono"
        >
          删除
        </button>
      </div>

      {/* Hashtags */}
      {memo.hashtags.length > 0 && (
        <div className="mb-2 flex gap-2 flex-wrap">
          {memo.hashtags.map(tag => (
            <span
              key={tag}
              className="text-xs px-2 py-1 bg-ph-blue text-white rounded font-mono"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Content */}
      <p className="font-mono text-sm whitespace-pre-wrap">{memo.content}</p>
    </div>
  );
};

export const MemoApp: React.FC = () => {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (supabase) {
      loadMemos();
    } else {
      setLoading(false);
    }
  }, []);

  const loadMemos = async () => {
    if (!supabase) return;

    const { data, error } = await supabase
      .from('memos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading memos:', error);
    } else {
      setMemos(data || []);
    }
    setLoading(false);
  };

  const handlePost = async () => {
    if (!input.trim() || !supabase) return;

    const hashtags = extractHashtags(input);

    const { error } = await supabase
      .from('memos')
      .insert({
        content: input,
        hashtags
      });

    if (error) {
      console.error('Error posting memo:', error);
    } else {
      setInput('');
      loadMemos(); // 重新加载
    }
  };

  const handleDelete = async (id: string) => {
    if (!supabase) return;

    const { error } = await supabase
      .from('memos')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting memo:', error);
    } else {
      loadMemos();
    }
  };

  // 如果没有配置Supabase，显示配置提示
  if (!supabase) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-ph-beige p-6">
        <div className="max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4 font-sans text-ph-blue">Memo App</h2>
          <p className="font-mono text-sm text-gray-600 mb-6">
            需要配置Supabase才能使用Memo功能
          </p>
          <div className="text-left bg-white border-2 border-ph-black p-4 shadow-retro-sm">
            <p className="font-mono text-xs mb-2 font-bold">配置步骤：</p>
            <ol className="font-mono text-xs text-gray-600 space-y-2 list-decimal list-inside">
              <li>在 https://supabase.com 创建项目</li>
              <li>复制 .env.example 为 .env</li>
              <li>填入 Supabase URL 和 anon key</li>
              <li>重启开发服务器</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-ph-beige p-6">
      <h2 className="text-2xl font-bold mb-4 font-sans">Memos</h2>

      {/* 输入框 */}
      <div className="mb-6">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="写点什么... 使用 #标签 来分类"
          className="w-full p-4 border-2 border-ph-black rounded font-mono resize-none focus:outline-none focus:ring-2 focus:ring-ph-blue"
          rows={3}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.metaKey) {
              handlePost();
            }
          }}
        />
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm text-gray-500 font-mono">
            {input.length} 字符
          </span>
          <button
            onClick={handlePost}
            className="px-6 py-2 bg-ph-blue text-white border-2 border-ph-black shadow-retro-sm hover:shadow-retro hover:-translate-y-1 transition-all font-bold font-sans"
          >
            发布 (⌘+Enter)
          </button>
        </div>
      </div>

      {/* 列表 */}
      <div className="flex-1 overflow-y-auto space-y-4">
        {loading ? (
          <p className="text-gray-500 text-center font-mono">加载中...</p>
        ) : memos.length === 0 ? (
          <p className="text-gray-500 text-center font-mono">还没有随笔，写点什么吧！</p>
        ) : (
          memos.map((memo) => (
            <MemoCard key={memo.id} memo={memo} onDelete={handleDelete} />
          ))
        )}
      </div>
    </div>
  );
};
