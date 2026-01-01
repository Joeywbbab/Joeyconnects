'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import ReactMarkdown from 'react-markdown';

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

interface NotesGridProps {
  notes: Note[];
}

const categories = [
  { id: 'all', label: 'All' },
  { id: 'thoughts', label: 'Thoughts' },
  { id: 'growth', label: 'Growth' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'inspiration', label: 'Inspiration' },
];

const noteColors = [
  'bg-white',
  'bg-[#fff9e6]',
  'bg-[#f0f9ff]',
  'bg-[#fef2f2]',
  'bg-[#f0fdf4]',
];

const rotations = [
  '-rotate-1',
  'rotate-1',
  'rotate-0',
  '-rotate-0.5',
  'rotate-0.5',
];

export default function NotesGrid({ notes }: NotesGridProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [sliderPosition, setSliderPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [comment, setComment] = useState('');
  const [showCommentInput, setShowCommentInput] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);
  const monthRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const filteredNotes = activeCategory === 'all'
    ? notes
    : notes.filter((n) => n.category === activeCategory);

  const categoryCounts = {
    all: notes.length,
    thoughts: notes.filter((n) => n.category === 'thoughts').length,
    growth: notes.filter((n) => n.category === 'growth').length,
    reviews: notes.filter((n) => n.category === 'reviews').length,
    inspiration: notes.filter((n) => n.category === 'inspiration').length,
  };

  // Group notes by year-month
  const groupedNotes = filteredNotes.reduce((acc, note) => {
    const date = new Date(note.date);
    const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (!acc[yearMonth]) {
      acc[yearMonth] = [];
    }
    acc[yearMonth].push(note);
    return acc;
  }, {} as Record<string, Note[]>);

  const sortedYearMonths = Object.keys(groupedNotes).sort((a, b) => b.localeCompare(a));

  const formatShortMonth = (ym: string) => {
    const [, month] = ym.split('-');
    const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    return monthNames[parseInt(month) - 1];
  };

  const formatYear = (ym: string) => {
    return ym.split('-')[0];
  };

  // Handle slider drag on the vertical timeline
  const handleSliderMove = useCallback((clientY: number) => {
    if (!timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const y = clientY - rect.top;
    const percentage = Math.max(0, Math.min(100, (y / rect.height) * 100));
    setSliderPosition(percentage);

    // Scroll to corresponding month based on position
    const monthIndex = Math.floor((percentage / 100) * sortedYearMonths.length);
    const targetMonth = sortedYearMonths[Math.min(monthIndex, sortedYearMonths.length - 1)];
    if (targetMonth && monthRefs.current[targetMonth]) {
      monthRefs.current[targetMonth]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [sortedYearMonths]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    handleSliderMove(e.clientY);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    handleSliderMove(e.touches[0].clientY);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handleSliderMove(e.clientY);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging) {
        handleSliderMove(e.touches[0].clientY);
      }
    };

    const handleEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, handleSliderMove]);

  // Update slider position based on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (isDragging) return;

      // Find which month is currently in view
      let currentMonthIndex = 0;
      for (let i = 0; i < sortedYearMonths.length; i++) {
        const month = sortedYearMonths[i];
        const el = monthRefs.current[month];
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200) {
            currentMonthIndex = i;
          }
        }
      }
      const newPosition = (currentMonthIndex / Math.max(sortedYearMonths.length - 1, 1)) * 100;
      setSliderPosition(newPosition);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sortedYearMonths, isDragging]);

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedNote(null);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (selectedNote) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedNote]);

  let globalNoteIndex = 0;

  // Group consecutive year-months by year for display
  const yearGroups = sortedYearMonths.reduce((acc, ym) => {
    const year = formatYear(ym);
    if (!acc.length || acc[acc.length - 1].year !== year) {
      acc.push({ year, months: [ym] });
    } else {
      acc[acc.length - 1].months.push(ym);
    }
    return acc;
  }, [] as { year: string; months: string[] }[]);

  const markdownComponents = {
    p: ({ children }: { children?: React.ReactNode }) => (
      <p className="text-sm leading-relaxed mb-3 text-gray-800">{children}</p>
    ),
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 className="text-base font-bold mt-4 mb-2">{children}</h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="text-sm font-bold mt-3 mb-2">{children}</h3>
    ),
    ul: ({ children }: { children?: React.ReactNode }) => (
      <ul className="list-disc list-inside mb-3 text-sm text-gray-800 space-y-1">{children}</ul>
    ),
    ol: ({ children }: { children?: React.ReactNode }) => (
      <ol className="list-decimal list-inside mb-3 text-sm text-gray-800 space-y-1">{children}</ol>
    ),
    li: ({ children }: { children?: React.ReactNode }) => (
      <li className="text-sm">{children}</li>
    ),
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong className="font-bold">{children}</strong>
    ),
    em: ({ children }: { children?: React.ReactNode }) => (
      <em className="italic">{children}</em>
    ),
    blockquote: ({ children }: { children?: React.ReactNode }) => (
      <blockquote className="border-l-2 border-red-600/50 pl-3 my-3 italic text-gray-600">{children}</blockquote>
    ),
    hr: () => (
      <hr className="my-4 border-black/10" />
    ),
    code: ({ children }: { children?: React.ReactNode }) => (
      <code className="bg-black/5 px-1.5 py-0.5 rounded text-xs font-mono">{children}</code>
    ),
  };

  return (
    <>
      {/* Category Filter */}
      <div className="mb-10 flex flex-wrap gap-3">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 font-mono text-xs uppercase tracking-wider transition-all cursor-pointer border-2 ${
              activeCategory === cat.id
                ? 'border-red-600 text-black bg-transparent'
                : 'border-black/20 text-black/60 hover:border-black hover:text-black bg-transparent'
            }`}
          >
            {cat.label}
            <span className="ml-2 opacity-60">({categoryCounts[cat.id as keyof typeof categoryCounts]})</span>
          </button>
        ))}
      </div>

      {/* Timeline with integrated slider */}
      <div className="relative flex">
        {/* Left: Vertical Timeline with Slider */}
        <div
          ref={timelineRef}
          className="sticky top-24 self-start w-24 mr-4 cursor-pointer select-none flex-shrink-0"
          style={{ height: 'calc(100vh - 200px)' }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          {/* Timeline track */}
          <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-black/10">
            {/* Year-month markers */}
            {sortedYearMonths.map((ym, idx) => {
              const position = (idx / Math.max(sortedYearMonths.length - 1, 1)) * 100;
              const isNewYear = idx === 0 || formatYear(sortedYearMonths[idx - 1]) !== formatYear(ym);
              return (
                <div
                  key={ym}
                  className="absolute left-0 -translate-x-1/2 flex items-center"
                  style={{ top: `${position}%` }}
                >
                  {/* Month dot */}
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isNewYear ? 'bg-red-600' : 'bg-black/30'
                    }`}
                  />
                  {/* Month label */}
                  <span className="absolute left-4 font-mono text-[10px] text-black/40 whitespace-nowrap">
                    {isNewYear && <span className="text-black/60 font-medium">{formatYear(ym)} </span>}
                    {formatShortMonth(ym)}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Draggable slider handle */}
          <div
            className={`absolute left-3 -translate-x-1/2 -translate-y-1/2 z-10
              w-4 h-4 rounded-full bg-red-600 border-2 border-white shadow-lg
              cursor-grab transition-transform
              ${isDragging ? 'scale-150 cursor-grabbing' : 'hover:scale-125'}`}
            style={{ top: `${sliderPosition}%` }}
          />
        </div>

        {/* Right: Notes Content */}
        <div className="flex-1">
          {yearGroups.map((yearGroup) => (
            <div key={yearGroup.year} className="mb-8">
              {yearGroup.months.map((yearMonth, monthIdx) => (
                <div
                  key={yearMonth}
                  ref={(el) => { monthRefs.current[yearMonth] = el; }}
                  className="mb-8"
                >
                  {/* Month Divider - subtle horizontal line with date */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex-1 h-px bg-black/5"></div>
                    <span className="font-mono text-[11px] text-black/30 uppercase tracking-wider">
                      {formatShortMonth(yearMonth)} {formatYear(yearMonth)}
                    </span>
                    <div className="flex-1 h-px bg-black/5"></div>
                  </div>

                  {/* Notes Grid - 3 columns with equal height rows */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {groupedNotes[yearMonth].map((note) => {
                      const colorIdx = globalNoteIndex % noteColors.length;
                      const rotationIdx = globalNoteIndex % rotations.length;
                      globalNoteIndex++;

                      return (
                        <div
                          key={note.slug}
                          onClick={() => setSelectedNote(note)}
                          className={`${noteColors[colorIdx]} ${rotations[rotationIdx]}
                            border border-black/10 shadow-lg hover:shadow-xl transition-all p-5 group
                            flex flex-col max-h-72 cursor-pointer hover:scale-[1.02]`}
                        >
                          {/* Header - Date and Tags */}
                          <div className="flex items-center justify-between mb-2 text-[10px] font-mono opacity-50">
                            <span>{new Date(note.date).toLocaleDateString('en-CA').replace(/-/g, '.')}</span>
                            {note.tags && note.tags.length > 0 && (
                              <div className="flex gap-2">
                                {note.tags.slice(0, 2).map((tag) => (
                                  <span key={tag}>#{tag}</span>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Title */}
                          <h3 className="font-serif text-lg mb-3">{note.title}</h3>

                          {/* Image */}
                          {note.image && (
                            <div className="mb-4 -mx-5">
                              <img
                                src={note.image}
                                alt={note.title}
                                className="w-full object-cover max-h-32"
                              />
                            </div>
                          )}

                          {/* Content */}
                          <div className="prose prose-sm max-w-none flex-1 overflow-hidden">
                            <ReactMarkdown components={markdownComponents}>
                              {note.content}
                            </ReactMarkdown>
                          </div>

                          {/* Read more hint */}
                          <div className="mt-auto pt-2 text-xs font-mono text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                            Click to read more →
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ))}

          {filteredNotes.length === 0 && (
            <div className="text-center py-20">
              <p className="font-typewriter text-xl opacity-60">No notes in this category yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal - rendered via portal to escape stacking context */}
      {selectedNote && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 flex items-center justify-center p-4 bg-black/60"
          style={{ zIndex: 99999 }}
          onClick={() => {
            setSelectedNote(null);
            setShowCommentInput(false);
            setComment('');
          }}
        >
          {/* Modal Container */}
          <div
            className="relative bg-[#fffef8] max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-black/10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-[#fffef8] border-b border-black/5 p-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-black/50">
                  {new Date(selectedNote.date).toLocaleDateString('en-CA').replace(/-/g, '.')}
                </span>
                {selectedNote.tags && selectedNote.tags.length > 0 && (
                  <div className="flex gap-2">
                    {selectedNote.tags.map((tag) => (
                      <span key={tag} className="font-mono text-xs text-black/40">#{tag}</span>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={() => {
                  setSelectedNote(null);
                  setShowCommentInput(false);
                  setComment('');
                }}
                className="w-8 h-8 flex items-center justify-center text-black/40 hover:text-black transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <h2 className="font-serif text-2xl mb-6">{selectedNote.title}</h2>

              {/* Image */}
              {selectedNote.image && (
                <div className="mb-6 -mx-6">
                  <img
                    src={selectedNote.image}
                    alt={selectedNote.title}
                    className="w-full object-cover"
                  />
                </div>
              )}

              {/* Video */}
              {selectedNote.video && (
                <div className="mb-6 -mx-6">
                  <video
                    src={selectedNote.video}
                    controls
                    className="w-full"
                  />
                </div>
              )}

              {/* Full Content */}
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown components={markdownComponents}>
                  {selectedNote.content}
                </ReactMarkdown>
              </div>

              {/* Comment Section - below content */}
              <div className="mt-8 pt-6 border-t border-black/5">
                {!showCommentInput ? (
                  <button
                    onClick={() => setShowCommentInput(true)}
                    className="text-sm text-black/40 hover:text-black/60 transition-colors italic"
                  >
                    Leave your thoughts...
                  </button>
                ) : (
                  <div className="flex gap-2 items-end">
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share your thoughts..."
                      autoFocus
                      className="flex-1 p-3 border border-black/10 bg-white resize-none h-20 text-sm focus:outline-none focus:border-red-600/50 transition-colors"
                    />
                    <button
                      onClick={() => {
                        // TODO: Implement comment submission
                        alert('Comment feature coming soon!');
                        setComment('');
                        setShowCommentInput(false);
                      }}
                      disabled={!comment.trim()}
                      className="p-3 text-black/40 hover:text-red-600 disabled:opacity-30 disabled:hover:text-black/40 transition-colors"
                    >
                      {/* Simple arrow/send icon */}
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
