'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Project } from '@/lib/content';

interface ProjectsGridProps {
  projects: Project[];
}

// Project images mapping
const projectImages: Record<string, string> = {
  'flowtree': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
  'geo-tool': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
  'reddit-listening': 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=800',
  'eval-platform': 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&q=80&w=800',
  'mith': 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&q=80&w=800',
  'store-app': 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=800',
  'default': 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
};

const categories = [
  { id: 'all', label: 'All' },
  { id: 'work', label: 'Work Products' },
  { id: 'tools', label: 'Tools & Workflows' },
  { id: 'experiments', label: 'Experiments' },
];

const categoryColors: Record<string, string> = {
  work: 'bg-blue-600',
  tools: 'bg-orange-500',
  experiments: 'bg-purple-600',
};

function getProjectImage(project: Project): string {
  return projectImages[project.slug] || projectImages['default'];
}

export default function ProjectsGrid({ projects }: ProjectsGridProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredProjects = activeCategory === 'all'
    ? projects
    : projects.filter((p) => p.category === activeCategory);

  // Count projects per category
  const categoryCounts = {
    all: projects.length,
    work: projects.filter((p) => p.category === 'work').length,
    tools: projects.filter((p) => p.category === 'tools').length,
    experiments: projects.filter((p) => p.category === 'experiments').length,
  };

  return (
    <>
      {/* Category Filter */}
      <div className="mb-10 flex flex-wrap gap-3">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 font-mono text-xs uppercase tracking-wider transition-all cursor-pointer border-2 ${
              activeCategory === cat.id
                ? 'border-red-600 text-black bg-transparent'
                : 'border-black/20 text-black/60 hover:border-black hover:text-black bg-transparent'
            }`}
          >
            {cat.label}
            <span className="ml-2 opacity-60">({categoryCounts[cat.id as keyof typeof categoryCounts]})</span>
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
        {filteredProjects.map((project, idx) => (
          <Link
            key={project.slug}
            href={`/projects/${project.slug}`}
            className={`project-card group ${idx % 3 === 1 ? 'md:mt-16' : ''}`}
          >
            <div className="number-bg">0{idx + 1}</div>

            <div className="project-card-image relative">
              <img
                src={getProjectImage(project)}
                alt={project.title}
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
              />
              {/* Category Badge */}
              <div className={`absolute top-3 left-3 px-2 py-1 text-[10px] uppercase font-bold text-white ${categoryColors[project.category]}`}>
                {project.category === 'work' ? 'Work' : project.category === 'tools' ? 'Tool' : 'Exp'}
              </div>
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

      {filteredProjects.length === 0 && (
        <div className="text-center py-20">
          <p className="font-typewriter text-xl opacity-60">No projects in this category yet.</p>
        </div>
      )}
    </>
  );
}
