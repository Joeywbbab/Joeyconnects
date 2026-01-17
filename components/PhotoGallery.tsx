'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface MediaItem {
  src: string;
  type: 'image' | 'video' | 'youtube';
  caption?: string;
  videoId?: string;
  title?: string;
  description?: string;
}

interface GalleryData {
  [year: string]: MediaItem[];
}

// YouTube thumbnail component
function YouTubeThumbnail({ videoId, title }: { videoId: string; title?: string }) {
  return (
    <div className="relative w-full aspect-video bg-black">
      <img
        src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
        alt={title || 'YouTube video'}
        className="w-full h-full object-cover"
      />
      {/* YouTube play button overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center shadow-lg">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white" className="ml-1">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
      {title && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
          <p className="text-white text-xs line-clamp-2">{title}</p>
        </div>
      )}
    </div>
  );
}

// YouTube embed player
function YouTubePlayer({ videoId }: { videoId: string }) {
  return (
    <iframe
      src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
      title="YouTube video player"
      allowFullScreen
      className="w-full aspect-video border-0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    />
  );
}

export default function PhotoGallery() {
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [galleryData, setGalleryData] = useState<GalleryData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch gallery data from API
  useEffect(() => {
    fetch('/api/gallery')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load gallery');
        return res.json();
      })
      .then(data => {
        setGalleryData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to load gallery');
        setLoading(false);
      });
  }, []);

  const years = Object.keys(galleryData).sort((a, b) => parseInt(b) - parseInt(a));
  const totalPhotos = Object.values(galleryData).reduce((sum, items) => sum + items.length, 0);

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="w-8 h-8 border-2 border-black/20 border-t-red-600 rounded-full animate-spin mx-auto"></div>
        <p className="font-mono text-sm text-black/40 mt-4">Loading gallery...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-50 flex items-center justify-center">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-red-500">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
        </div>
        <p className="font-typewriter text-xl opacity-60">Failed to load gallery</p>
        <p className="font-mono text-sm text-black/30 mt-2">{error}</p>
      </div>
    );
  }

  if (selectedYear) {
    const items = galleryData[selectedYear] || [];
    const videos = items.filter(item => item.type === 'youtube' || item.type === 'video');
    const images = items.filter(item => item.type === 'image');

    return (
      <div>
        {/* Back button and year title */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSelectedYear(null)}
              className="text-black/40 hover:text-black transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="font-serif text-3xl">{selectedYear}</h2>
          </div>
          <span className="font-mono text-xs text-black/40">
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        {items.length > 0 ? (
          <>
            {/* Videos Section - Left video, right description */}
            {videos.length > 0 && (
              <div className="mb-12 space-y-8">
                {videos.map((video, idx) => (
                  <div key={idx} className="grid grid-cols-1 lg:grid-cols-2 gap-8 border border-black/10 p-8">
                    {/* Left: Video */}
                    <div
                      className="cursor-pointer group"
                      onClick={() => setSelectedMedia(video)}
                    >
                      {video.type === 'youtube' ? (
                        <YouTubeThumbnail videoId={video.videoId || ''} title={video.title} />
                      ) : (
                        <div className="relative aspect-video">
                          <video
                            src={video.src}
                            className="w-full h-full object-cover"
                            muted
                            playsInline
                            preload="metadata"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                            <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-black ml-1">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right: Description */}
                    <div className="flex flex-col justify-center">
                      {video.title && (
                        <h3 className="font-serif text-xl mb-4">{video.title}</h3>
                      )}
                      {video.description && (
                        <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line max-h-64 overflow-y-auto">
                          {video.description}
                        </div>
                      )}
                      <button
                        onClick={() => setSelectedMedia(video)}
                        className="mt-4 inline-flex items-center gap-2 text-sm font-mono text-red-600 hover:text-red-700 transition-colors self-start"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                        Watch video
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Images Section - Masonry grid */}
            {images.length > 0 && (
              <>
                {videos.length > 0 && (
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex-1 h-px bg-black/10"></div>
                    <span className="font-mono text-xs text-black/40">Photos</span>
                    <div className="flex-1 h-px bg-black/10"></div>
                  </div>
                )}
                <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                  {images.map((item, idx) => (
                    <div
                      key={idx}
                      className="break-inside-avoid cursor-pointer group"
                      onClick={() => setSelectedMedia(item)}
                    >
                      <div className="relative overflow-hidden bg-black/5">
                        <img
                          src={item.src}
                          alt={item.caption || `Photo ${idx + 1}`}
                          className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                        {item.caption && (
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <p className="text-white text-xs">{item.caption}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <p className="font-typewriter text-xl opacity-40">No photos for {selectedYear} yet.</p>
            <p className="font-mono text-sm text-black/30 mt-2">
              Add photos to /public/images/gallery/{selectedYear}/
            </p>
          </div>
        )}

        {/* Media lightbox - using portal */}
        {selectedMedia && typeof document !== 'undefined' && createPortal(
          <div
            className="fixed inset-0 bg-black/90 flex items-center justify-center p-4"
            style={{ zIndex: 99999 }}
            onClick={() => setSelectedMedia(null)}
          >
            <button
              className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors z-10"
              onClick={() => setSelectedMedia(null)}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
            <div className="w-full max-w-4xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
              {selectedMedia.type === 'youtube' ? (
                <div className="w-full">
                  <YouTubePlayer videoId={selectedMedia.videoId || ''} />
                  {selectedMedia.title && (
                    <p className="text-white/70 text-center mt-4 font-mono text-sm">{selectedMedia.title}</p>
                  )}
                </div>
              ) : selectedMedia.type === 'video' ? (
                <video
                  src={selectedMedia.src}
                  controls
                  autoPlay
                  className="max-w-full max-h-[85vh]"
                />
              ) : (
                <img
                  src={selectedMedia.src}
                  alt={selectedMedia.caption || 'Photo'}
                  className="max-w-full max-h-[85vh] object-contain"
                />
              )}
              {selectedMedia.caption && selectedMedia.type !== 'youtube' && (
                <p className="text-white/70 text-center mt-4 font-mono text-sm">{selectedMedia.caption}</p>
              )}
            </div>
          </div>,
          document.body
        )}
      </div>
    );
  }

  // Year selection view
  return (
    <div>
      {totalPhotos === 0 ? (
        // Empty state
        <div className="text-center py-20">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-black/5 flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-black/30">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
          </div>
          <p className="font-typewriter text-xl opacity-40">Gallery is empty</p>
          <p className="font-mono text-sm text-black/30 mt-2">
            Add photos to /public/images/gallery/[year]/
          </p>
        </div>
      ) : (
        // Year cards
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {years.map((year) => {
            const items = galleryData[year] || [];
            const previewItems = items.slice(0, 4);

            return (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className="group text-left bg-white border border-black/10 p-6 hover:shadow-lg hover:border-red-600/30 transition-all"
              >
                {/* Year title */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif text-4xl group-hover:text-red-600 transition-colors">{year}</h3>
                  <span className="font-mono text-xs text-black/40">
                    {items.length} {items.length === 1 ? 'item' : 'items'}
                  </span>
                </div>

                {/* Preview grid */}
                {items.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2 aspect-square">
                    {previewItems.map((item, idx) => (
                      <div key={idx} className="bg-black/5 overflow-hidden relative">
                        {item.type === 'youtube' ? (
                          <div className="w-full h-full bg-black relative">
                            <img
                              src={`https://img.youtube.com/vi/${item.videoId}/mqdefault.jpg`}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center">
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="white" className="ml-0.5">
                                  <path d="M8 5v14l11-7z" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        ) : item.type === 'video' ? (
                          <>
                            <video
                              src={item.src}
                              className="w-full h-full object-cover"
                              muted
                              playsInline
                              preload="metadata"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-6 h-6 rounded-full bg-white/80 flex items-center justify-center">
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="text-black ml-0.5">
                                  <path d="M8 5v14l11-7z" />
                                </svg>
                              </div>
                            </div>
                          </>
                        ) : (
                          <img
                            src={item.src}
                            alt=""
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        )}
                      </div>
                    ))}
                    {/* Fill empty slots with placeholders */}
                    {[...Array(4 - previewItems.length)].map((_, idx) => (
                      <div key={`empty-${idx}`} className="bg-black/5" />
                    ))}
                  </div>
                ) : (
                  <div className="aspect-square bg-black/5 flex items-center justify-center">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-black/20">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <path d="M21 15l-5-5L5 21" />
                    </svg>
                  </div>
                )}

                {/* View prompt */}
                <div className="mt-4 flex items-center gap-2 text-xs font-mono text-black/40 group-hover:text-red-600 transition-colors">
                  <span>View collection</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
