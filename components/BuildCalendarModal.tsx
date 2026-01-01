'use client';

import { useState } from 'react';
import { ProjectTimeline } from '@/lib/content';

interface BuildCalendarModalProps {
  timeline: ProjectTimeline[];
  projectName: string;
}

export default function BuildCalendarModal({ timeline, projectName }: BuildCalendarModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Sort timeline by date
  const sortedTimeline = [...timeline].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="px-3 py-1 bg-dark-beige border border-black text-xs uppercase font-bold hover:bg-black hover:text-white transition-colors cursor-pointer flex items-center gap-1"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        Build Timeline
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative w-full max-w-2xl max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Card */}
            <div className="retro-card bg-paper">
              {/* Header */}
              <div className="bg-black text-white px-6 py-4 flex items-center justify-between">
                <div>
                  <h2 className="font-mono text-sm uppercase tracking-wider opacity-70">Build Timeline</h2>
                  <h3 className="font-bold text-lg">{projectName}</h3>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-white/20 rounded transition-colors cursor-pointer"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Timeline Content */}
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <div className="relative">
                  {/* Timeline Line */}
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-black/20"></div>

                  {/* Timeline Items */}
                  <div className="space-y-6">
                    {sortedTimeline.map((item, index) => (
                      <div key={index} className="relative pl-12">
                        {/* Timeline Dot */}
                        <div className={`absolute left-2 top-1 w-5 h-5 rounded-full border-2 border-black flex items-center justify-center ${
                          index === sortedTimeline.length - 1 ? 'bg-orange' : 'bg-white'
                        }`}>
                          {index === sortedTimeline.length - 1 && (
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="bg-dark-beige border border-black p-4">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-mono text-xs text-gray-500">
                              {new Date(item.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                            {index === sortedTimeline.length - 1 && (
                              <span className="px-2 py-0.5 bg-orange text-white text-[10px] uppercase font-bold">
                                Latest
                              </span>
                            )}
                          </div>
                          <h4 className="font-bold text-lg mb-1">{item.title}</h4>
                          {item.description && (
                            <p className="text-gray-600 text-sm">{item.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Summary */}
                <div className="mt-8 pt-6 border-t border-black/20">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{sortedTimeline.length} updates</span>
                    <span>
                      {sortedTimeline.length > 0 && (
                        <>
                          {new Date(sortedTimeline[0].date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                          {' → '}
                          {new Date(sortedTimeline[sortedTimeline.length - 1].date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
