import { getAllProjects } from '@/lib/content';
import type { Metadata } from 'next';
import ProjectsGrid from '@/components/ProjectsGrid';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Selected works from the archive. Things I have built to solve problems.',
};

export default async function ProjectsPage() {
  const projects = await getAllProjects();

  return (
    <div className="container-wide animate-slide-up pt-8">
      {/* Minimal Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="text-[10px] font-mono opacity-40 tracking-[0.2em] uppercase">
          Archive / Selected Works
        </div>
        <div className="text-[10px] font-mono opacity-30 tracking-[0.2em] uppercase">
          {projects.length} Projects
        </div>
      </div>

      {/* Projects Grid with Filter */}
      <ProjectsGrid projects={projects} />
    </div>
  );
}
