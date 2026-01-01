import Link from 'next/link';
import { getAllNotes } from '@/lib/content';
import type { Metadata } from 'next';
import ScrapbookContent from '@/components/ScrapbookContent';

export const metadata: Metadata = {
  title: 'Scrapbook',
  description: 'Unrefined ideas, snippets, and findings.',
};

export default async function NotesPage() {
  const notes = await getAllNotes();

  return (
    <div className="container-wide animate-slide-up pt-8">
      {/* Minimal Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="text-[10px] font-mono opacity-40 tracking-[0.2em] uppercase">
          Archive / Digital Scratchpad
        </div>
      </div>

      {/* Scrapbook Content with Tabs */}
      <ScrapbookContent notes={notes} />

      {/* The Epilogue Section */}
      <div className="mt-20 max-w-xl mx-auto">
        <div className="bg-black text-white p-8 md:p-10 transform rotate-1 shadow-heavy relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-15 transition-opacity">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>
          </div>

          <h3 className="font-serif italic text-4xl md:text-5xl mb-4 tracking-tighter text-red-500">The Epilogue.</h3>
          <p className="font-typewriter text-sm opacity-70 leading-relaxed mb-8 max-w-sm">
            A curated experience where logical foresight meets creative execution.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/writing"
              className="flex-1 bg-white text-black p-4 font-mono text-xs uppercase tracking-[0.15em] hover:bg-red-600 hover:text-white transition-all shadow-xl text-center"
            >
              Read Blog
            </Link>
            <Link
              href="/projects"
              className="flex-1 border border-white/20 p-4 font-mono text-xs uppercase tracking-[0.15em] hover:border-red-600 hover:bg-red-600 transition-all text-center"
            >
              View Projects
            </Link>
          </div>
        </div>
      </div>

      {/* Aesthetic Spacer */}
      <div className="mt-24 flex justify-center opacity-10">
        <svg width="200" height="20" viewBox="0 0 200 20">
          <path d="M0,10 Q5,0 10,10 T20,10 T30,10 T40,10 T50,10 T60,10 T70,10 T80,10 T90,10 T100,10 T110,10 T120,10 T130,10 T140,10 T150,10 T160,10 T170,10 T180,10 T190,10 T200,10" fill="none" stroke="black" strokeWidth="2" />
        </svg>
      </div>
    </div>
  );
}
