'use client';

import { useState } from 'react';
import NotesGrid from './NotesGrid';
import PhotoGallery from './PhotoGallery';

interface Note {
  slug: string;
  title: string;
  date: string;
  category: string;
  content: string;
  tags?: string[];
  image?: string;
  video?: string;
  lang?: string;
}

interface ScrapbookContentProps {
  notes: Note[];
}

export default function ScrapbookContent({ notes }: ScrapbookContentProps) {
  const [activeTab, setActiveTab] = useState<'notes' | 'gallery'>('notes');

  return (
    <>
      {/* Tab Navigation */}
      <div className="mb-10 flex items-center gap-8 border-b border-black/10">
        <button
          onClick={() => setActiveTab('notes')}
          className={`pb-3 font-mono text-sm uppercase tracking-wider transition-all relative ${
            activeTab === 'notes'
              ? 'text-black'
              : 'text-black/40 hover:text-black/60'
          }`}
        >
          Notes
          {activeTab === 'notes' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('gallery')}
          className={`pb-3 font-mono text-sm uppercase tracking-wider transition-all relative ${
            activeTab === 'gallery'
              ? 'text-black'
              : 'text-black/40 hover:text-black/60'
          }`}
        >
          Gallery
          {activeTab === 'gallery' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600" />
          )}
        </button>

        {/* Count indicator */}
        <div className="ml-auto text-[10px] font-mono opacity-30 tracking-[0.2em] uppercase">
          {activeTab === 'notes' ? `${notes.length} Notes` : 'Photos'}
        </div>
      </div>

      {/* Content */}
      {activeTab === 'notes' ? (
        <NotesGrid notes={notes} />
      ) : (
        <PhotoGallery />
      )}
    </>
  );
}
