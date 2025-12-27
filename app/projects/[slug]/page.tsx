import { notFound } from 'next/navigation';
import { getAllProjects, getProjectBySlug } from '@/lib/content';
import { generateSoftwareApplicationSchema, renderSchema } from '@/lib/schema';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Metadata } from 'next';

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

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

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

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Project Header */}
        <header className="mb-12">
          <div className="mb-4">
            <span
              className={`px-4 py-2 border-2 border-black text-sm uppercase font-bold shadow-retro ${
                project.status === 'active'
                  ? 'bg-cyan text-white'
                  : project.status === 'in-progress'
                  ? 'bg-orange text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
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

          {/* Tech Stack */}
          {project.tech && project.tech.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {project.tech.map((tech: string) => (
                <span
                  key={tech}
                  className="px-3 py-1 bg-dark-beige border border-black text-sm font-mono"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Problem/Solution Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="retro-card p-6 bg-red bg-opacity-10">
            <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
              <span className="text-red">❌</span> The Problem
            </h2>
            <p className="text-gray-800 leading-relaxed">
              {project.problem}
            </p>
          </div>

          <div className="retro-card p-6 bg-cyan bg-opacity-10">
            <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
              <span className="text-cyan">✅</span> The Solution
            </h2>
            <p className="text-gray-800 leading-relaxed">
              {project.solution}
            </p>
          </div>
        </div>

        {/* Features */}
        {project.features && project.features.length > 0 && (
          <div className="retro-card p-8 mb-12">
            <h2 className="text-3xl font-bold mb-6">Key Features</h2>
            <ul className="space-y-3">
              {project.features.map((feature: string, index: number) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-orange font-bold mt-1">→</span>
                  <span className="text-lg text-gray-800">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Main Content */}
        <div className="prose prose-lg max-w-none mb-12">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => (
                <h1 className="text-4xl font-bold mt-12 mb-6">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-3xl font-bold mt-10 mb-4">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-2xl font-bold mt-8 mb-3">
                  {children}
                </h3>
              ),
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
            }}
          >
            {project.content}
          </ReactMarkdown>
        </div>

        {/* CTAs */}
        <div className="retro-card p-8 bg-orange bg-opacity-10">
          <h3 className="text-2xl font-bold mb-4">Try It Out</h3>
          <div className="flex flex-wrap gap-4">
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="retro-button"
              >
                Try Demo ↗
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="retro-button bg-white text-black hover:bg-dark-beige"
              >
                View Code ↗
              </a>
            )}
            {!project.demoUrl && !project.githubUrl && (
              <p className="text-gray-700">
                Coming soon! Follow me on <a href="https://twitter.com/joey" className="retro-link">Twitter</a> for updates.
              </p>
            )}
          </div>
        </div>
      </article>
    </>
  );
}
