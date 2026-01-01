import { notFound } from 'next/navigation';
import { getAllProjects, getProjectBySlug, getWritingBySlug } from '@/lib/content';
import { generateSoftwareApplicationSchema, renderSchema } from '@/lib/schema';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Metadata } from 'next';
import Link from 'next/link';
import ProjectEmbed from '@/components/ProjectEmbed';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: 'Project Not Found',
    };
  }

  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description: project.description,
    },
  };
}

const categoryLabels = {
  work: 'Work Product',
  tools: 'Tool',
  experiments: 'Experiment',
};

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  // Fetch related posts
  const relatedPosts = await Promise.all(
    (project.relatedPosts || []).map(async (postSlug) => {
      const post = await getWritingBySlug(postSlug);
      return post;
    })
  );
  const validRelatedPosts = relatedPosts.filter((post) => post !== null);

  const schema = generateSoftwareApplicationSchema({
    name: project.title,
    description: project.description,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={renderSchema(schema)}
      />

      <article className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Project Header - Always first */}
        <header className="mb-12">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            {/* Category Badge */}
            <span
              className="px-3 py-1 text-xs uppercase font-bold border-2 border-red-600 text-black"
            >
              {categoryLabels[project.category]}
            </span>
            {/* Status Badge */}
            <span
              className="px-3 py-1 border-2 border-black text-xs uppercase font-bold text-black"
            >
              {project.status}
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            {project.title}
          </h1>

          <p className="text-xl text-gray-700 leading-relaxed mb-6">
            {project.description}
          </p>

          {/* Dates */}
          {(project.createdAt || project.updatedAt) && (
            <div className="flex gap-6 text-sm text-gray-500 mb-6">
              {project.createdAt && (
                <span>Created: {new Date(project.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
              )}
              {project.updatedAt && (
                <span>Updated: {new Date(project.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
              )}
            </div>
          )}

        </header>

        {/* Embedded App Section - After header */}
        {project.embedType && project.embedType !== 'none' && (project.embedUrl || (project.embedVersions && project.embedVersions.length > 0)) && (
          <ProjectEmbed
            title={project.title}
            embedUrl={project.embedUrl}
            embedHeight={project.embedHeight}
            embedVersions={project.embedVersions}
          />
        )}

        {/* Two Column Layout: Left (Problem/Solution/Features) | Right (Timeline) */}
        <div className="mb-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Problem / Solution / Features */}
          <div className="space-y-8">
            {project.problem && (
              <div>
                <h2 className="text-xl font-bold mb-2">The Problem</h2>
                <p className="text-gray-800 leading-relaxed">{project.problem}</p>
              </div>
            )}
            {project.solution && (
              <div>
                <h2 className="text-xl font-bold mb-2">The Solution</h2>
                <p className="text-gray-800 leading-relaxed">{project.solution}</p>
              </div>
            )}
            {project.features && project.features.length > 0 && (
              <div>
                <h2 className="text-xl font-bold mb-2">Key Features</h2>
                <ul className="space-y-1.5">
                  {project.features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-gray-800">
                      <span className="text-red-600 mt-0.5">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right Column - Build Timeline */}
          {project.timeline && project.timeline.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                Build Timeline
              </h2>
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-black/20"></div>

                {/* Timeline Items */}
                <div className="space-y-4">
                  {[...project.timeline]
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                    .map((item, index, arr) => (
                      <div key={index} className="relative pl-10">
                        {/* Timeline Dot */}
                        <div className={`absolute left-1 top-1 w-4 h-4 rounded-full border-2 border-black flex items-center justify-center ${
                          index === arr.length - 1 ? 'bg-red-600' : 'bg-white'
                        }`}>
                          {index === arr.length - 1 && (
                            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="bg-dark-beige border border-black p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-[11px] text-gray-500">
                              {new Date(item.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                            {index === arr.length - 1 && (
                              <span className="px-1.5 py-0.5 bg-red-600 text-white text-[9px] uppercase font-bold">
                                Latest
                              </span>
                            )}
                          </div>
                          <h4 className="font-bold text-sm mb-0.5">{item.title}</h4>
                          {item.description && (
                            <p className="text-gray-600 text-xs">{item.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Full Width Content (Prototypes, How It Works, Current Status) */}
        {project.content && (
          <div className="mb-12 prose prose-sm max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h2: ({ children }) => (
                  <h2 className="text-xl font-bold mt-8 mb-3">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-lg font-bold mt-4 mb-2">{children}</h3>
                ),
                p: ({ children }) => (
                  <p className="text-gray-800 leading-relaxed mb-4">
                    {children}
                  </p>
                ),
                a: ({ href, children }) => {
                  const text = String(children);
                  if (text.toLowerCase().includes('launch') || text.toLowerCase().includes('try') || text.toLowerCase().includes('demo')) {
                    return (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white font-bold hover:bg-gray-800 transition-colors no-underline text-sm"
                      >
                        {children}
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M7 17L17 7M17 7H7M17 7v10" />
                        </svg>
                      </a>
                    );
                  }
                  return (
                    <a href={href} target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-700 underline underline-offset-2 font-medium transition-colors">
                      {children}
                    </a>
                  );
                },
                strong: ({ children }) => (
                  <strong className="font-bold">{children}</strong>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside space-y-2 mb-4">{children}</ol>
                ),
                ul: ({ children }) => (
                  <ul className="space-y-1.5 mb-4">{children}</ul>
                ),
                li: ({ children }) => (
                  <li className="text-gray-800">{children}</li>
                ),
                hr: () => (
                  <hr className="my-8 border-t border-black/10" />
                ),
                table: ({ children }) => (
                  <div className="overflow-x-auto my-6">
                    <table className="w-full text-sm border-collapse border border-black/20">
                      {children}
                    </table>
                  </div>
                ),
                thead: ({ children }) => (
                  <thead className="bg-black/5">{children}</thead>
                ),
                th: ({ children }) => (
                  <th className="border border-black/20 px-4 py-2 text-left font-bold">{children}</th>
                ),
                td: ({ children }) => (
                  <td className="border border-black/20 px-4 py-2">{children}</td>
                ),
              }}
            >
              {project.content}
            </ReactMarkdown>
          </div>
        )}

        {/* Related Posts */}
        {validRelatedPosts.length > 0 && (
          <div className="mt-12 pt-8 border-t border-black/10">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
              Related Writing
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {validRelatedPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/writing/${post.slug}`}
                  className="group block p-4 border border-black/10 hover:border-black/30 transition-colors"
                >
                  <h3 className="font-bold text-sm group-hover:text-red-600 transition-colors mb-1">
                    {post.title}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <span className="inline-flex items-center gap-1 mt-2 text-xs font-mono text-red-600">
                    Read more
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

      </article>
    </>
  );
}
