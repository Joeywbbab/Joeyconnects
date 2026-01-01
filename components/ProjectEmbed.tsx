'use client';

import { useState } from 'react';

interface EmbedVersion {
  version: string;
  label: string;
  url: string;
  description?: string;
}

interface ProjectEmbedProps {
  title: string;
  embedUrl?: string;
  embedHeight?: string;
  embedVersions?: EmbedVersion[];
}

export default function ProjectEmbed({
  title,
  embedUrl,
  embedHeight = '500px',
  embedVersions = [],
}: ProjectEmbedProps) {
  const hasVersions = embedVersions.length > 0;
  const [activeVersion, setActiveVersion] = useState(
    hasVersions ? embedVersions.length - 1 : 0
  );

  const currentUrl = hasVersions
    ? embedVersions[activeVersion].url
    : embedUrl;

  if (!currentUrl) return null;

  return (
    <div className="mb-12 -mx-4 sm:-mx-6 lg:-mx-12">
      <div className="retro-card overflow-hidden mx-4 sm:mx-6 lg:mx-0">
        {/* Embed Header */}
        <div className="bg-black text-white px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <span className="font-mono text-xs ml-2 opacity-70">
              {title} - Live Preview
            </span>
          </div>
          <a
            href={currentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs opacity-70 hover:opacity-100 transition-opacity"
          >
            Open Fullscreen ↗
          </a>
        </div>

        {/* Version Switcher */}
        {hasVersions && (
          <div className="bg-gray-100 border-b border-black/10 px-4 py-3 flex items-center gap-4">
            <span className="font-mono text-xs text-gray-500 uppercase tracking-wider">
              Version:
            </span>
            <div className="flex gap-2">
              {embedVersions.map((v, idx) => (
                <button
                  key={v.version}
                  onClick={() => setActiveVersion(idx)}
                  className={`px-3 py-1.5 font-mono text-xs transition-all ${
                    activeVersion === idx
                      ? 'bg-black text-white'
                      : 'bg-white border border-black/20 text-black/70 hover:border-black hover:text-black'
                  }`}
                >
                  {v.version}
                  <span className="ml-1.5 opacity-60">({v.label})</span>
                </button>
              ))}
            </div>
            {embedVersions[activeVersion].description && (
              <span className="hidden md:block text-xs text-gray-500 ml-auto">
                {embedVersions[activeVersion].description}
              </span>
            )}
          </div>
        )}

        {/* Iframe */}
        <iframe
          key={currentUrl}
          src={currentUrl}
          className="w-full border-0"
          style={{ height: `calc(${embedHeight} * 1.1)` }}
          title={`${title} Demo`}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />
      </div>
    </div>
  );
}
