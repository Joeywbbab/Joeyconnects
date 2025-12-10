import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { Upload, X, Maximize2 } from 'lucide-react';

interface Comic {
  id: string;
  title: string;
  image_url: string;
  image_path: string;
  description?: string;
  created_at: string;
}

export const ComicsApp: React.FC = () => {
  const [comics, setComics] = useState<Comic[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [viewingComic, setViewingComic] = useState<Comic | null>(null);

  useEffect(() => {
    if (supabase) {
      loadComics();
    } else {
      setLoading(false);
    }
  }, []);

  const loadComics = async () => {
    if (!supabase) return;

    const { data, error } = await supabase
      .from('comics')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading comics:', error);
    } else {
      setComics(data || []);
    }
    setLoading(false);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        alert('Image size should be less than 10MB');
        return;
      }

      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearForm = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setTitle('');
    setDescription('');
  };

  const handleUpload = async () => {
    if (!selectedImage || !title.trim() || !supabase) return;

    setUploading(true);

    try {
      const fileExt = selectedImage.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `comics/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('memos')
        .upload(filePath, selectedImage);

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        alert('Failed to upload image');
        setUploading(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from('memos')
        .getPublicUrl(filePath);

      const { error } = await supabase
        .from('comics')
        .insert({
          title: title.trim(),
          description: description.trim() || null,
          image_url: urlData.publicUrl,
          image_path: filePath
        });

      if (error) {
        console.error('Error saving comic:', error);
        alert('Failed to save comic');
      } else {
        clearForm();
        loadComics();
      }
    } catch (err) {
      console.error('Error:', err);
      alert('An error occurred');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (comic: Comic) => {
    if (!supabase || !confirm('Delete this comic?')) return;

    if (comic.image_path) {
      await supabase.storage
        .from('memos')
        .remove([comic.image_path]);
    }

    const { error } = await supabase
      .from('comics')
      .delete()
      .eq('id', comic.id);

    if (!error) {
      loadComics();
    }
  };

  if (!supabase) {
    return (
      <div className="h-full flex items-center justify-center bg-ph-beige p-6">
        <div className="text-center">
          <p className="font-mono text-sm text-gray-600">Supabase configuration required</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex bg-ph-beige">
      {/* 左侧：作品集 */}
      <div className="w-2/3 flex flex-col border-r-2 border-ph-black">
        <div className="p-4 border-b-2 border-ph-black bg-white">
          <h2 className="text-xl font-bold font-sans">Comics Gallery</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <p className="text-gray-500 text-center font-mono">Loading...</p>
          ) : comics.length === 0 ? (
            <p className="text-gray-500 text-center font-mono">No comics yet. Upload your first one!</p>
          ) : (
            <div className="space-y-6">
              {comics.map((comic) => (
                <div key={comic.id} className="bg-white border-2 border-ph-black shadow-retro-sm overflow-hidden">
                  {/* 图片区 - 完整显示长图 */}
                  <div className="relative group">
                    <img
                      src={comic.image_url}
                      alt={comic.title}
                      className="w-full h-auto cursor-pointer hover:opacity-95 transition-opacity"
                      onClick={() => setViewingComic(comic)}
                    />
                    {/* 放大图标提示 */}
                    <div className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      <Maximize2 size={18} />
                    </div>
                  </div>

                  {/* 信息区 */}
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold font-sans text-lg">{comic.title}</h3>
                      <button
                        onClick={() => handleDelete(comic)}
                        className="text-red-500 hover:text-red-700 flex items-center gap-1 text-sm"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    {comic.description && (
                      <p className="text-sm text-gray-600 font-mono">{comic.description}</p>
                    )}
                    <p className="text-xs text-gray-400 font-mono mt-2">
                      {new Date(comic.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 右侧：上传区 */}
      <div className="w-1/3 flex flex-col">
        <div className="p-4 border-b-2 border-ph-black bg-white">
          <h2 className="text-xl font-bold font-sans">Upload Comic</h2>
        </div>

        <div className="flex-1 p-6 overflow-y-auto">
          {/* 图片上传 */}
          {imagePreview ? (
            <div className="mb-4 relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-auto border-2 border-ph-black rounded"
              />
              <button
                onClick={clearForm}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <label className="block mb-4 cursor-pointer">
              <div className="border-2 border-dashed border-ph-black rounded-lg p-8 text-center hover:bg-gray-50 transition-colors">
                <Upload size={48} className="mx-auto mb-2 text-gray-400" />
                <p className="font-mono text-sm text-gray-600">Click to upload image</p>
                <p className="font-mono text-xs text-gray-400 mt-1">Max 10MB</p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
            </label>
          )}

          {/* 标题 */}
          <div className="mb-4">
            <label className="block font-mono text-sm font-bold mb-2">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Comic title..."
              className="w-full px-4 py-2 border-2 border-ph-black rounded font-mono text-sm focus:outline-none focus:ring-2 focus:ring-ph-blue"
            />
          </div>

          {/* 描述 */}
          <div className="mb-4">
            <label className="block font-mono text-sm font-bold mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description..."
              className="w-full px-4 py-2 border-2 border-ph-black rounded font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ph-blue"
              rows={3}
            />
          </div>

          {/* 上传按钮 */}
          <button
            onClick={handleUpload}
            disabled={uploading || !selectedImage || !title.trim()}
            className="w-full px-4 py-3 bg-ph-blue text-white border-2 border-ph-black shadow-retro-sm hover:shadow-retro hover:-translate-y-1 transition-all font-bold font-sans disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? 'Uploading...' : 'Upload Comic'}
          </button>
        </div>
      </div>

      {/* 图片查看模态框 */}
      {viewingComic && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-8"
          onClick={() => setViewingComic(null)}
        >
          <div className="relative max-w-5xl max-h-full overflow-auto">
            {/* 关闭按钮 */}
            <button
              onClick={() => setViewingComic(null)}
              className="fixed top-4 right-4 bg-white text-ph-black p-3 rounded-full hover:bg-gray-100 border-2 border-ph-black shadow-lg z-10"
            >
              <X size={24} />
            </button>

            {/* 完整图片 */}
            <img
              src={viewingComic.image_url}
              alt={viewingComic.title}
              className="w-auto h-auto max-w-full border-4 border-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />

            {/* 图片信息 */}
            <div className="mt-4 bg-white border-2 border-ph-black p-4 shadow-retro-sm">
              <h3 className="font-bold font-sans text-xl mb-2">{viewingComic.title}</h3>
              {viewingComic.description && (
                <p className="text-sm text-gray-600 font-mono">{viewingComic.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
