import { notFound } from 'next/navigation';
import { getAllWriting, getWritingBySlug } from '@/lib/content';
import { generateArticleSchema, renderSchema } from '@/lib/schema';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import type { Metadata } from 'next';
import TableOfContents from '@/components/TableOfContents';

// Helper function to generate heading ID
function generateHeadingId(text: React.ReactNode): string {
  const str = String(text);
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getAllWriting();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getWritingBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.title,
    description: post.description || post.excerpt,
    keywords: post.tags,
    openGraph: {
      title: post.title,
      description: post.description || post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: ['Joey'],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description || post.excerpt,
    },
  };
}

export default async function WritingPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getWritingBySlug(slug);

  if (!post) {
    notFound();
  }

  const schema = generateArticleSchema({
    title: post.title,
    description: post.description || post.excerpt,
    date: post.date,
    slug: post.slug,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={renderSchema(schema)}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex gap-12 items-start">
          {/* Left Sidebar - Table of Contents */}
          <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-28 h-fit">
            <TableOfContents content={post.content} />
          </aside>

          {/* Main Article */}
          <article className="flex-1 max-w-3xl">
            {/* Article Header */}
            <header className="mb-12">
              <div className="mb-4 flex items-center gap-3 text-sm text-gray-600">
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
                <span className="px-3 py-1 bg-dark-beige border border-black text-xs uppercase font-bold">
                  {post.category}
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                {post.title}
              </h1>

              {post.description && (
                <p className="text-xl text-gray-700 leading-relaxed">
                  {post.description}
                </p>
              )}

              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-6">
                  {post.tags.map((tag: string) => (
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

            {/* Article Content */}
            <div className="prose prose-lg max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkBreaks]}
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-4xl font-bold mt-12 mb-6 border-b-2 border-black pb-4">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => {
                    const id = generateHeadingId(children);
                    return (
                      <h2 id={id} className="text-3xl font-bold mt-10 mb-4 scroll-mt-28">
                        {children}
                      </h2>
                    );
                  },
                  h3: ({ children }) => {
                    const id = generateHeadingId(children);
                    return (
                      <h3 id={id} className="text-2xl font-bold mt-8 mb-3 scroll-mt-28">
                        {children}
                      </h3>
                    );
                  },
                  p: ({ children }) => (
                    <p className="text-lg leading-relaxed mb-6 text-gray-800">
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside mb-6 space-y-2 text-lg text-gray-800">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside mb-6 space-y-2 text-lg text-gray-800">
                      {children}
                    </ol>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-orange pl-6 italic my-6 text-gray-700">
                      {children}
                    </blockquote>
                  ),
                  code: ({ className, children }) => {
                    const isInline = !className;
                    if (isInline) {
                      return (
                        <code className="bg-dark-beige border border-black px-2 py-1 rounded text-sm font-mono">
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
                  table: ({ children }) => (
                    <div className="overflow-x-auto my-6">
                      <table className="min-w-full border-2 border-black">
                        {children}
                      </table>
                    </div>
                  ),
                  th: ({ children }) => (
                    <th className="border border-black bg-dark-beige px-4 py-2 text-left font-bold">
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className="border border-black px-4 py-2">
                      {children}
                    </td>
                  ),
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>

            {/* Article Footer */}
            <footer className="mt-16 pt-8 border-t-2 border-black">
              <div className="retro-card p-8">
                <h3 className="text-2xl font-bold mb-4">About the Author</h3>
                <p className="text-gray-700 mb-6">
                  Joey is a problem-solving architect who builds products and writes about ideas.
                  Currently working on GEO/AEO services at Manus.
                </p>
                <a href="/about" className="retro-button">
                  Learn More About Joey
                </a>
              </div>
            </footer>
          </article>
        </div>
      </div>
    </>
  );
}
