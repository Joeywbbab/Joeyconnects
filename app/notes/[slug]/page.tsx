import { notFound } from 'next/navigation';
import { getAllNotes, getNoteBySlug } from '@/lib/content';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import type { Metadata } from 'next';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const notes = await getAllNotes();
  return notes.map((note) => ({
    slug: note.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const note = await getNoteBySlug(slug);

  if (!note) {
    return {
      title: 'Note Not Found',
    };
  }

  return {
    title: note.title,
    description: note.content.slice(0, 150),
  };
}

export default async function NotePage({ params }: PageProps) {
  const { slug } = await params;
  const note = await getNoteBySlug(slug);

  if (!note) {
    notFound();
  }

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <header className="mb-8">
        <Link href="/notes" className="retro-link text-sm mb-4 inline-block">
          ← Back to Notes
        </Link>

        <div className="mb-4">
          <time dateTime={note.date} className="text-sm text-gray-600">
            {new Date(note.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          {note.title}
        </h1>

        {note.tags && note.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {note.tags.map((tag: string) => (
              <span
                key={tag}
                className="px-3 py-1 bg-beige border border-black text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </header>

      <div className="prose prose-lg max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkBreaks]}
          components={{
            p: ({ children }) => (
              <p className="text-lg leading-relaxed mb-4 text-gray-800">
                {children}
              </p>
            ),
            ul: ({ children }) => (
              <ul className="list-disc list-inside mb-4 space-y-2 text-lg text-gray-800">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal list-inside mb-4 space-y-2 text-lg text-gray-800">
                {children}
              </ol>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-orange pl-4 italic my-4 text-gray-700">
                {children}
              </blockquote>
            ),
            code: ({ className, children }) => {
              const isInline = !className;
              if (isInline) {
                return (
                  <code className="bg-dark-beige border border-black px-2 py-1 text-sm font-mono">
                    {children}
                  </code>
                );
              }
              return (
                <code className="block bg-dark-beige border-2 border-black p-4 my-4 overflow-x-auto font-mono text-sm">
                  {children}
                </code>
              );
            },
            a: ({ href, children }) => (
              <a href={href} className="retro-link text-blue font-medium">
                {children}
              </a>
            ),
          }}
        >
          {note.content}
        </ReactMarkdown>
      </div>
    </article>
  );
}
