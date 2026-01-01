'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navigation = [
  { id: 'HOME', label: '01. Home', href: '/' },
  { id: 'PROJECTS', label: '02. Projects', href: '/projects' },
  { id: 'BLOG', label: '03. Blog', href: '/writing' },
  { id: 'NOTES', label: '04. Scrapbook', href: '/notes' },
  { id: 'ABOUT', label: '05. About', href: '/about' },
];

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-4 md:px-12 md:py-6 pointer-events-none bg-paper/90 backdrop-blur-sm">
        {/* Logo / Brand */}
        <Link
          href="/"
          className="font-serif italic text-3xl md:text-4xl font-black cursor-pointer hover:text-red-600 transition-colors pointer-events-auto"
        >
          _JOEY.
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-12 pointer-events-auto">
          {navigation.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="font-typewriter text-sm relative group overflow-hidden px-2"
            >
              <span
                className={
                  isActive(item.href)
                    ? 'font-black border-b-2 border-red-600'
                    : 'opacity-40 group-hover:opacity-100 transition-opacity'
                }
              >
                {item.label}
              </span>
              {isActive(item.href) && (
                <div className="absolute top-0 right-0 w-1 h-1 bg-red-600 rounded-full animate-ping"></div>
              )}
            </Link>
          ))}
        </nav>

        {/* Social Links (Desktop) */}
        <div className="hidden md:flex items-center space-x-2 pointer-events-auto">
          <a
            href="https://github.com/Joeywbbab"
            target="_blank"
            rel="noopener noreferrer"
            className="social-btn"
            aria-label="GitHub"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
              <path d="M9 18c-4.51 2-5-2-7-2" />
            </svg>
          </a>
          <a
            href="https://x.com/JoeyWan83658250"
            target="_blank"
            rel="noopener noreferrer"
            className="social-btn-dark"
            aria-label="X"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
          <a
            href="mailto:hello@joeyconnects.world"
            className="social-btn"
            aria-label="Email"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-3 bg-black text-white z-[60] pointer-events-auto shadow-xl"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          )}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-paper z-50 flex flex-col justify-center items-center space-y-8 animate-fade-in">
          <div className="absolute top-0 right-0 p-10 font-serif text-8xl opacity-5 select-none">
            MENU
          </div>
          {navigation.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => setIsMenuOpen(false)}
              className="font-serif italic text-5xl font-bold hover:text-red-600 hover:scale-110 transition-all flex items-center gap-4"
            >
              <span className="text-xs font-typewriter opacity-30">{item.id}</span>
              {item.label.split('. ')[1]}
            </Link>
          ))}
          <div className="flex space-x-6 pt-12 border-t border-black/10 w-48 justify-center">
            <a href="https://github.com/Joeywbbab" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
            </a>
            <a href="https://x.com/JoeyWan83658250" target="_blank" rel="noopener noreferrer" aria-label="X">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a href="mailto:hello@joeyconnects.world" aria-label="Email">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </a>
          </div>
        </div>
      )}
    </>
  );
}
