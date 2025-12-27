'use client';

import { usePathname } from 'next/navigation';

const pages = [
  { path: '/', index: 0 },
  { path: '/projects', index: 1 },
  { path: '/writing', index: 2 },
  { path: '/notes', index: 3 },
  { path: '/about', index: 4 },
];

export default function Footer() {
  const pathname = usePathname();

  // Hide footer on homepage (it's integrated into the page)
  if (pathname === '/') {
    return null;
  }

  // Find current page index
  const currentIndex = pages.find(p =>
    p.path === '/' ? pathname === '/' : pathname.startsWith(p.path)
  )?.index ?? 0;

  return (
    <footer className="relative z-10 px-6 pt-6 pb-10 border-t border-black/5 flex flex-col items-center gap-3">
      {/* Globe/World Icon */}
      <svg
        width="24"
        height="24"
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
      <p className="font-mono text-[10px] opacity-40 uppercase tracking-[0.3em]">
        Joey Connect The Worlds
      </p>

      {/* Dots - changes based on current page */}
      <div className="flex gap-2">
        {pages.map((page, idx) => (
          <div
            key={page.path}
            className={`w-1.5 h-1.5 rounded-full transition-colors ${
              idx === currentIndex ? 'bg-red-600' : 'bg-black/20'
            }`}
          />
        ))}
      </div>
    </footer>
  );
}
