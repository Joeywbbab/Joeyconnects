import React, { useState, useEffect, useMemo } from 'react';
import { List, Video as VideoIcon } from 'lucide-react';
import { supabase, Video, VideoCategory, YouTubeVideoInfo } from '../services/supabase';

type CategoryFilter = VideoCategory | 'all';

// YouTube API 函数
async function fetchYouTubeVideoInfo(youtubeId: string): Promise<YouTubeVideoInfo | null> {
  const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
  if (!apiKey) {
    console.warn('YouTube API key not configured');
    return null;
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?id=${youtubeId}&key=${apiKey}&part=snippet`
    );
    
    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }

    const data = await response.json();
    if (data.items && data.items.length > 0) {
      const item = data.items[0].snippet;
      return {
        title: item.title,
        description: item.description,
        thumbnailUrl: item.thumbnails?.high?.url || item.thumbnails?.default?.url || ''
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching YouTube video info:', error);
    return null;
  }
}

interface VideoWithInfo extends Video {
  displayTitle: string;
  displayDescription: string;
  displayThumbnail: string;
}

interface VideoListViewProps {
  videos: VideoWithInfo[];
  selectedCategory: CategoryFilter;
  onCategoryChange: (category: CategoryFilter) => void;
  onSelect: (video: VideoWithInfo) => void;
  loading: boolean;
}

const VideoListView: React.FC<VideoListViewProps> = ({
  videos,
  selectedCategory,
  onCategoryChange,
  onSelect,
  loading
}) => {
  const filteredVideos = useMemo(() => {
    if (selectedCategory === 'all') return videos;
    return videos.filter(v => v.category === selectedCategory);
  }, [videos, selectedCategory]);

  const categories: Array<{ key: CategoryFilter; label: string }> = [
    { key: 'all', label: 'All' },
    { key: 'ytb tutorials', label: 'YTB Tutorials' },
    { key: 'cartoon', label: 'Cartoon' },
    { key: 'life', label: 'Life' }
  ];

  const truncateDescription = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
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
              onChange={(e) => onCategoryChange(e.target.value as CategoryFilter)}
              className="px-3 py-1 text-sm font-mono bg-white border-2 border-ph-black focus:outline-none focus:ring-2 focus:ring-ph-blue cursor-pointer"
            >
              {categories.map(({ key, label }) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500 font-mono">Loading videos...</p>
          </div>
        ) : filteredVideos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 font-mono mb-2">No videos found</p>
            {selectedCategory !== 'all' && (
              <p className="text-sm text-gray-400 font-mono">
                Try adjusting your filters
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVideos.map((video) => (
              <button
                key={video.id}
                onClick={() => onSelect(video)}
                className="w-full text-left bg-white border-2 border-ph-black shadow-retro-sm hover:shadow-retro hover:-translate-y-1 transition-all group"
              >
                {/* Thumbnail */}
                <div className="aspect-video bg-gray-800 relative overflow-hidden">
                  {video.displayThumbnail ? (
                    <img
                      src={video.displayThumbnail}
                      alt={video.displayTitle}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <VideoIcon size={48} className="text-gray-400" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full border-2 border-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center bg-ph-blue">
                      <VideoIcon size={24} className="text-white" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-base font-bold font-sans mb-2 group-hover:text-ph-blue transition-colors line-clamp-2">
                    {video.displayTitle}
                  </h3>
                  {video.displayDescription && (
                    <p className="text-sm text-gray-600 mb-3 font-mono line-clamp-2">
                      {truncateDescription(video.displayDescription)}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-mono rounded border border-gray-300">
                      {video.category}
                    </span>
                    <div className="text-ph-blue font-mono text-xs">→</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

interface VideoDetailViewProps {
  video: VideoWithInfo;
  allVideos: VideoWithInfo[];
  onSelectVideo: (video: VideoWithInfo) => void;
  onBack: () => void;
}

const VideoDetailView: React.FC<VideoDetailViewProps> = ({
  video,
  allVideos,
  onSelectVideo,
  onBack
}) => {
  return (
    <div className="h-full flex gap-4">
      {/* Left sidebar - Video list */}
      <div className="w-56 flex-shrink-0 border-r-2 border-ph-black pr-3 overflow-y-auto">
        <button
          onClick={onBack}
          className="mb-3 px-2 py-1 text-xs bg-white border-2 border-ph-black shadow-retro-sm hover:shadow-retro hover:-translate-y-1 transition-all font-bold font-sans flex items-center gap-1.5"
        >
          <List size={12} />
          All Videos
        </button>

        <div className="space-y-0.5">
          {allVideos.map((v) => (
            <button
              key={v.id}
              onClick={() => onSelectVideo(v)}
              className={`w-full text-left px-2 py-1.5 text-xs font-mono transition-all ${
                v.id === video.id
                  ? 'bg-ph-blue text-white border-2 border-ph-black'
                  : 'text-gray-600 hover:text-ph-black hover:bg-gray-100'
              }`}
            >
              {v.displayTitle}
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto pr-4">
        <h1 className="text-3xl font-bold font-sans mb-4">{video.displayTitle}</h1>

        {/* Video player */}
        <div className="mb-6 border-2 border-ph-black bg-black">
          <div className="aspect-video">
            <iframe
              src={`https://www.youtube.com/embed/${video.youtube_id}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>

        {/* Category */}
        <div className="mb-6 pb-3 border-b-2 border-ph-black">
          <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-mono rounded border border-gray-300">
            {video.category}
          </span>
        </div>

        {/* Description */}
        {video.displayDescription && (
          <div className="prose prose-base max-w-none">
            <div className="text-gray-700 leading-relaxed font-mono whitespace-pre-wrap">
              {video.displayDescription}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const VideosApp: React.FC = () => {
  const [videos, setVideos] = useState<VideoWithInfo[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<VideoWithInfo | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!supabase) {
        throw new Error('Supabase not configured');
      }

      // Load videos from database
      const { data, error: dbError } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false });

      if (dbError) {
        throw new Error(`Database error: ${dbError.message}`);
      }

      if (!data || data.length === 0) {
        setVideos([]);
        setLoading(false);
        return;
      }

      // Fetch YouTube info for videos that need it
      const videosWithInfo: VideoWithInfo[] = await Promise.all(
        data.map(async (video) => {
          // Use database values if available, otherwise fetch from YouTube
          let displayTitle = video.title || '';
          let displayDescription = video.description || '';
          let displayThumbnail = video.thumbnail_url || '';

          // If missing info, fetch from YouTube API
          if (!displayTitle || !displayThumbnail) {
            const youtubeInfo = await fetchYouTubeVideoInfo(video.youtube_id);
            if (youtubeInfo) {
              displayTitle = displayTitle || youtubeInfo.title;
              displayDescription = displayDescription || youtubeInfo.description;
              displayThumbnail = displayThumbnail || youtubeInfo.thumbnailUrl;
            }
          }

          // Fallback title if still empty
          if (!displayTitle) {
            displayTitle = `Video ${video.youtube_id}`;
          }

          return {
            ...video,
            displayTitle,
            displayDescription,
            displayThumbnail
          };
        })
      );

      setVideos(videosWithInfo);
    } catch (err) {
      console.error('Failed to load videos:', err);
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
            onClick={loadVideos}
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
      {selectedVideo ? (
        <VideoDetailView
          video={selectedVideo}
          allVideos={videos}
          onSelectVideo={setSelectedVideo}
          onBack={() => setSelectedVideo(null)}
        />
      ) : (
        <VideoListView
          videos={videos}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          onSelect={setSelectedVideo}
          loading={loading}
        />
      )}
    </div>
  );
};

