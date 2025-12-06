import React from 'react';
import { Button } from '../components/ui/Button';
import { BookOpen, ArrowRight } from 'lucide-react';

export const WelcomeApp: React.FC = () => {
  return (
    <div className="p-6 md:p-8 flex flex-col gap-6 h-full overflow-y-auto bg-ph-beige text-ph-black">
      <div className="border-b-4 border-ph-black pb-4">
        <h1 className="text-4xl md:text-6xl font-sans font-bold uppercase tracking-tight mb-2">
          Joey<span className="text-ph-orange">connects</span>.os
        </h1>
        <p className="text-lg font-mono">v2.0.4 // PERSONAL_BUILD</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Column - About Me */}
        <div className="space-y-4">
          <div className="bg-white border-2 border-ph-black p-6 shadow-retro">
            <h2 className="text-2xl font-bold font-sans mb-4">About Me</h2>
            <div className="font-mono text-sm leading-relaxed space-y-4">
              <p>
                Joey is building products while trying to understand the world in parallel.
              </p>
              <p>
                Right now that means a project-management Mac app, an upcoming AI Notes app, and a conceptual project about death and how we experience it. He works in AI, currently focused on GEO and social listening, and spends a slightly unhealthy amount of time designing workflows and efficiency systems.
              </p>
              <p>
                Films, books, music, and travel are his main inputs; as for outputs, he's exploring how to eventually create both a comic and a memoir around turning thirty—a small milestone, a long contemplation. His long-term curiosities include sociology, psychology, history, philosophy, and art history.
              </p>
              <p>
                This website functions as Joey's ongoing lab: a place to structure ideas, turn structures into tools, and let those tools shape how life is lived.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column - Current Work & Social Links */}
        <div className="space-y-4">
          <div className="bg-ph-blue text-white border-2 border-ph-black p-6 shadow-retro">
            <h2 className="text-xl font-bold font-sans mb-4">Current Doing</h2>
            <ul className="space-y-3 font-mono text-sm">
              <li className="flex items-start gap-2">
                <span className="text-ph-orange mt-1">▸</span>
                <div>
                  <a href="#" className="font-bold hover:underline">Project Management Mac App</a>
                  <p className="text-xs opacity-90 mt-1">Coming soon...</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-ph-orange mt-1">▸</span>
                <div>
                  <a href="#" className="font-bold hover:underline">AI Notes App</a>
                  <p className="text-xs opacity-90 mt-1">In development...</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-ph-orange mt-1">▸</span>
                <div>
                  <a href="#" className="font-bold hover:underline">Conceptual Project on Death</a>
                  <p className="text-xs opacity-90 mt-1">Exploring...</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-ph-black text-ph-beige p-6 border-2 border-transparent shadow-retro">
            <h3 className="text-2xl font-bold font-sans mb-4">Connect</h3>
            <p className="font-mono text-sm mb-6">
              Find me on these platforms, or explore the desktop to discover more.
            </p>
            <div className="space-y-2">
              <Button
                variant="secondary"
                onClick={() => window.open('#', '_blank')}
                className="w-full flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
                    <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
                  </svg>
                  Twitter / X
                </span>
                <ArrowRight size={16} />
              </Button>
              <Button
                variant="secondary"
                onClick={() => window.open('#', '_blank')}
                className="w-full flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
                    <path d="m10 15 5-3-5-3z" />
                  </svg>
                  YouTube
                </span>
                <ArrowRight size={16} />
              </Button>
              <Button
                variant="secondary"
                onClick={() => window.open('#', '_blank')}
                className="w-full flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <BookOpen size={16} />
                  Substack
                </span>
                <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-auto pt-8 text-center font-mono text-xs opacity-60">
        System Status: ONLINE | Build: React 19 | Location: Thinking
      </div>
    </div>
  );
};
