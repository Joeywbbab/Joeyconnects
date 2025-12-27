import type { Metadata } from 'next';
import InteractiveCollage from '@/components/InteractiveCollage';

export const metadata: Metadata = {
  title: 'Joey — Observer',
  description: "Just finding fun on the road of life. Product architect who builds products, writes about ideas, and believes every problem has a solution.",
};

export default async function HomePage() {
  return (
    <div className="container-wide relative h-[calc(100vh-6rem)] md:h-[calc(100vh-7rem)] overflow-hidden flex flex-col">

      {/* HERO SECTION - Full width interactive layout */}
      <div className="relative z-30 flex-1 flex items-center">
        <InteractiveCollage />
      </div>

      {/* DIVIDER LINE + FOOTER */}
      <div className="border-t border-dashed border-black/10 pt-4 pb-6 flex flex-col items-center gap-2">
        {/* Globe/World Icon */}
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-red-600 animate-spin-slow"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          <path d="M2 12h20" />
        </svg>

        {/* Tagline */}
        <p className="font-mono text-[9px] opacity-40 uppercase tracking-[0.3em]">
          Joey Connect The Worlds
        </p>

        {/* Dots - Home is active (first dot) */}
        <div className="flex gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
          <div className="w-1.5 h-1.5 rounded-full bg-black/20" />
          <div className="w-1.5 h-1.5 rounded-full bg-black/20" />
          <div className="w-1.5 h-1.5 rounded-full bg-black/20" />
        </div>
      </div>
    </div>
  );
}
