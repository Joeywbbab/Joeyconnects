import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const GALLERY_PATH = path.join(process.cwd(), 'public/images/gallery');

// Supported file extensions
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
const VIDEO_EXTENSIONS = ['.mp4', '.mov', '.webm'];

interface MediaItem {
  src: string;
  type: 'image' | 'video' | 'youtube';
  order?: number;
  videoId?: string;
  title?: string;
  description?: string;
}

interface ExternalVideo {
  order: number;
  type: 'youtube';
  videoId: string;
  title?: string;
  description?: string;
}

export async function GET() {
  try {
    const galleryData: Record<string, MediaItem[]> = {};

    // Check if gallery directory exists
    if (!fs.existsSync(GALLERY_PATH)) {
      return NextResponse.json({});
    }

    // Read year folders
    const years = fs.readdirSync(GALLERY_PATH, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)
      .sort((a, b) => parseInt(b) - parseInt(a));

    for (const year of years) {
      const yearPath = path.join(GALLERY_PATH, year);
      const files = fs.readdirSync(yearPath);

      const mediaItems: MediaItem[] = [];

      // Read local files
      for (const file of files) {
        if (file === 'videos.json') continue; // Skip config file

        const ext = path.extname(file).toLowerCase();
        const src = `/images/gallery/${year}/${encodeURIComponent(file)}`;

        if (IMAGE_EXTENSIONS.includes(ext)) {
          const match = file.match(/^(\d+)/);
          mediaItems.push({
            src,
            type: 'image',
            order: match ? parseInt(match[1], 10) : Infinity
          });
        } else if (VIDEO_EXTENSIONS.includes(ext)) {
          const match = file.match(/^(\d+)/);
          mediaItems.push({
            src,
            type: 'video',
            order: match ? parseInt(match[1], 10) : Infinity
          });
        }
      }

      // Read external videos config if exists
      const videosConfigPath = path.join(yearPath, 'videos.json');
      if (fs.existsSync(videosConfigPath)) {
        try {
          const videosConfig = JSON.parse(fs.readFileSync(videosConfigPath, 'utf-8')) as ExternalVideo[];
          for (const video of videosConfig) {
            if (video.type === 'youtube') {
              mediaItems.push({
                src: video.videoId,
                type: 'youtube',
                order: video.order,
                videoId: video.videoId,
                title: video.title,
                description: video.description
              });
            }
          }
        } catch (e) {
          console.error('Error reading videos.json:', e);
        }
      }

      // Sort by order
      mediaItems.sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity));

      if (mediaItems.length > 0) {
        galleryData[year] = mediaItems;
      }
    }

    return NextResponse.json(galleryData);
  } catch (error) {
    console.error('Error reading gallery:', error);
    return NextResponse.json({});
  }
}
