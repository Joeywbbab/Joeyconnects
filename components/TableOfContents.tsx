'use client';

import { useEffect, useState } from 'react';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

export default function TableOfContents({ content }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  // Parse headings from markdown content
  useEffect(() => {
    const lines = content.split('\n');
    const tocItems: TOCItem[] = [];

    lines.forEach((line) => {
      const h2Match = line.match(/^## (.+)$/);
      const h3Match = line.match(/^### (.+)$/);

      if (h2Match) {
        const text = h2Match[1].trim();
        const id = text
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-');
        tocItems.push({ id, text, level: 2 });
      } else if (h3Match) {
        const text = h3Match[1].trim();
        const id = text
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-');
        tocItems.push({ id, text, level: 3 });
      }
    });

    setHeadings(tocItems);
  }, [content]);

  // Track active heading on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-80px 0px -80% 0px',
        threshold: 0,
      }
    );

    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [headings]);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  if (headings.length === 0) {
    return null;
  }

  return (
    <nav className="max-h-[calc(100vh-8rem)] overflow-y-auto">
      <div className="border-l-2 border-black/10 pl-4">
        <h4 className="font-mono text-xs uppercase tracking-widest text-black/40 mb-4">
          On this page
        </h4>
        <ul className="space-y-2">
          {headings.map((heading) => (
            <li
              key={heading.id}
              className={`${heading.level === 3 ? 'ml-4' : ''}`}
            >
              <button
                onClick={() => handleClick(heading.id)}
                className={`text-left text-sm leading-relaxed transition-colors cursor-pointer hover:text-red-600 ${
                  activeId === heading.id
                    ? 'text-red-600 font-medium'
                    : 'text-black/60'
                }`}
              >
                {heading.text}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
