import Link from 'next/link';
import { getAllProjects } from '@/lib/content';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Selected works from the archive. Things I have built to solve problems.',
};

// Project images mapping
const projectImages: Record<string, string> = {
  'flowtree': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
  'geo-tool': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
  'linear-clone': 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=800',
  'store-app': 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=800',
  'default': 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
};

export default async function ProjectsPage() {
  const projects = await getAllProjects();

  return (
    <div className="container-wide animate-slide-up pt-8">
      {/* Minimal Header */}
      <div className="mb-12 flex items-center justify-between">
        <div className="text-[10px] font-mono opacity-40 tracking-[0.2em] uppercase">
          Archive / Selected Works
        </div>
        <div className="text-[10px] font-mono opacity-30 tracking-[0.2em] uppercase">
          {projects.length} Projects
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
        {projects.map((project, idx) => (
          <Link
            key={project.slug}
            href={`/projects/${project.slug}`}
            className={`project-card group ${idx === 1 ? 'md:mt-16' : ''}`}
          >
            <div className="number-bg">0{idx + 1}</div>

            <div className="project-card-image">
              <img
                src={projectImages[project.slug] || projectImages['default']}
                alt={project.title}
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
              />
              <div className="project-card-overlay">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" x2="21" y1="14" y2="3" />
                </svg>
              </div>
            </div>

            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-typewriter text-xl font-bold uppercase tracking-tighter">{project.title}</h3>
                <p className="font-typewriter text-xs opacity-50">
                  {project.status === 'active' ? 'LIVE' : project.status === 'in-progress' ? 'IN PROGRESS' : 'ARCHIVED'}
                </p>
              </div>
              <div className="p-2 border border-black group-hover:bg-black group-hover:text-white transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-20">
          <p className="font-typewriter text-xl opacity-60">No projects yet. Check back soon!</p>
        </div>
      )}
    </div>
  );
}
