import Link from 'next/link';
import { getAllNotes } from '@/lib/content';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Scrapbook',
  description: 'Unrefined ideas, snippets, and findings.',
};

const noteColors = [
  'bg-white',
  'bg-[#fff9e6]',
  'bg-[#f0f9ff]',
  'bg-[#fef2f2]',
  'bg-[#f0fdf4]',
];

const rotations = [
  '-rotate-1',
  'rotate-2',
  '-rotate-2',
  'rotate-1',
  '-rotate-1',
];

export default async function NotesPage() {
  const notes = await getAllNotes();

  return (
    <div className="container-medium py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="section-title">Digital Scratchpad.</h1>
        <p className="section-subtitle">Unrefined ideas, snippets, and findings.</p>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {notes.map((note, idx) => (
          <Link
            key={note.slug}
            href={`/notes/${note.slug}`}
            className={`card-note ${noteColors[idx % noteColors.length]} ${rotations[idx % rotations.length]} hover:rotate-0`}
          >
            {/* Number Badge */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-4 ${
              idx % 3 === 0 ? 'bg-orange-400/20' :
              idx % 3 === 1 ? 'bg-red-400/20' :
              'bg-blue-400/20'
            }`}>
              <span className="font-typewriter text-xs font-bold">0{idx + 1}</span>
            </div>

            {/* Content */}
            <h2 className="font-typewriter text-base leading-relaxed mb-4">
              {note.title}
            </h2>

            {/* Footer */}
            <div className="border-t border-black/5 pt-2 flex justify-between">
              <span className="text-[10px] font-mono opacity-30">
                {note.tags?.[0] ? `#${note.tags[0]}` : '#note'}
              </span>
              <span className="text-[10px] font-mono opacity-30">
                {new Date(note.date).toLocaleDateString('en-CA').replace(/-/g, '.')}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {notes.length === 0 && (
        <div className="text-center py-20">
          <p className="font-typewriter text-xl opacity-60">No notes yet. Check back soon!</p>
        </div>
      )}

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
