import React, { useState, useEffect } from 'react';
import { supabase, Memo } from '../services/supabase';
import { Image, X } from 'lucide-react';

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

  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;

  return date.toLocaleDateString('en-US', {
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
          Delete
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

      {/* Image */}
      {memo.image_url && (
        <div className="mb-3">
          <img
            src={memo.image_url}
            alt={memo.image_name || 'Memo image'}
            className="max-w-full h-auto border border-ph-black rounded"
          />
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
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

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

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 验证文件类型
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // 验证文件大小 (5MB限制)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      setSelectedImage(file);

      // 创建预览
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handlePost = async () => {
    if (!input.trim() || !supabase) return;

    setUploading(true);

    try {
      const hashtags = extractHashtags(input);
      let imageUrl = null;
      let imageName = null;
      let imagePath = null;

      // 上传图片到 Supabase Storage
      if (selectedImage) {
        const fileExt = selectedImage.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `memo-images/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('memos')
          .upload(filePath, selectedImage);

        if (uploadError) {
          console.error('Error uploading image:', uploadError);
          alert('Failed to upload image');
          setUploading(false);
          return;
        }

        // 获取公开 URL
        const { data: urlData } = supabase.storage
          .from('memos')
          .getPublicUrl(filePath);

        imageUrl = urlData.publicUrl;
        imageName = selectedImage.name;
        imagePath = filePath;
      }

      // 插入 memo 记录
      const { error } = await supabase
        .from('memos')
        .insert({
          content: input,
          hashtags,
          image_url: imageUrl,
          image_name: imageName,
          image_path: imagePath
        });

      if (error) {
        console.error('Error posting memo:', error);
        alert('Failed to post memo');
      } else {
        setInput('');
        clearImage();
        loadMemos();
      }
    } catch (err) {
      console.error('Error:', err);
      alert('An error occurred');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!supabase) return;

    // 先获取 memo 信息以删除关联的图片
    const memo = memos.find(m => m.id === id);

    // 如果有图片，先删除图片
    if (memo?.image_path) {
      const { error: storageError } = await supabase.storage
        .from('memos')
        .remove([memo.image_path]);

      if (storageError) {
        console.error('Error deleting image:', storageError);
      }
    }

    // 删除 memo 记录
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
            Supabase configuration required to use Memo
          </p>
          <div className="text-left bg-white border-2 border-ph-black p-4 shadow-retro-sm">
            <p className="font-mono text-xs mb-2 font-bold">Setup Steps:</p>
            <ol className="font-mono text-xs text-gray-600 space-y-2 list-decimal list-inside">
              <li>Create project at https://supabase.com</li>
              <li>Copy .env.example to .env</li>
              <li>Fill in Supabase URL and anon key</li>
              <li>Restart dev server</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex bg-ph-beige">
      {/* 左侧：历史记录 */}
      <div className="w-1/2 flex flex-col border-r-2 border-ph-black">
        <div className="p-4 border-b-2 border-ph-black bg-white">
          <h2 className="text-xl font-bold font-sans">History</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading ? (
            <p className="text-gray-500 text-center font-mono">Loading...</p>
          ) : memos.length === 0 ? (
            <p className="text-gray-500 text-center font-mono">No memos yet. Write something!</p>
          ) : (
            memos.map((memo) => (
              <MemoCard key={memo.id} memo={memo} onDelete={handleDelete} />
            ))
          )}
        </div>
      </div>

      {/* 右侧：编辑区 */}
      <div className="w-1/2 flex flex-col">
        {/* 顶部标题栏和Post按钮 */}
        <div className="p-4 border-b-2 border-ph-black bg-white flex justify-between items-center">
          <h2 className="text-xl font-bold font-sans">New Memo</h2>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 font-mono">⌘+Enter to post</span>
            <button
              onClick={handlePost}
              disabled={uploading || !input.trim()}
              className="px-4 py-2 bg-ph-blue text-white border-2 border-ph-black shadow-retro-sm hover:shadow-retro hover:-translate-y-1 transition-all font-bold font-sans text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? 'Posting...' : 'Post'}
            </button>
          </div>
        </div>

        {/* 编辑区内容 */}
        <div className="flex-1 p-6 overflow-y-auto">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Write something... Use #hashtags to categorize"
            className="w-full h-40 p-4 border-2 border-ph-black rounded font-mono resize-none focus:outline-none focus:ring-2 focus:ring-ph-blue"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.metaKey) {
                handlePost();
              }
            }}
          />

          {/* 图片预览 */}
          {imagePreview && (
            <div className="mt-4 relative inline-block">
              <img
                src={imagePreview}
                alt="Preview"
                className="max-w-full max-h-64 border-2 border-ph-black rounded"
              />
              <button
                onClick={clearImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* 底部工具栏 */}
          <div className="mt-4 flex items-center gap-4">
            {/* 图片上传按钮 */}
            <label className="cursor-pointer flex items-center gap-2 px-4 py-2 border-2 border-ph-black bg-white hover:bg-gray-50 shadow-retro-sm font-mono text-sm">
              <Image size={18} />
              <span>Add Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
            </label>

            <span className="text-sm text-gray-500 font-mono">
              {input.length} characters
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
