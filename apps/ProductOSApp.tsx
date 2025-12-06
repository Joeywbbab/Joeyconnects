import React, { useState } from 'react';
import { Briefcase, Package, Zap } from 'lucide-react';

interface Project {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  category: string;
  appUrl?: string;
}

const projects: Project[] = [
  // Work
  {
    id: 'geo',
    icon: <Package size={24} />,
    title: 'GEO Intelligence',
    description: 'AI-powered social listening and geographic analysis for enterprise clients. Real-time monitoring across global markets with sentiment analysis and trend detection.',
    category: 'work'
  },
  {
    id: 'social',
    icon: <Zap size={24} />,
    title: 'Social Listening',
    description: 'Real-time monitoring and sentiment analysis across social media channels. Track brand mentions, competitor activity, and emerging trends.',
    category: 'work'
  },
  {
    id: 'eval',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
    title: 'Eval',
    description: 'Advanced evaluation and testing platform for AI models. Comprehensive benchmarking, performance metrics, and analysis tools for production systems.',
    category: 'work'
  },
  // Solo Products
  {
    id: 'mith',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
      </svg>
    ),
    title: 'mith',
    description: 'Native macOS app for visual project planning. Timeline views, team collaboration, and intelligent task management built for modern product teams.',
    category: 'solo',
    appUrl: 'https://mith.app' // 替换为实际的mith域名
  },
  {
    id: 'notes',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
    title: 'AI Notes',
    description: 'Intelligent note-taking with AI-powered organization, automatic linking, and semantic search. Your second brain, enhanced.',
    category: 'solo'
  },
  {
    id: 'death',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
    title: 'Death & Experience',
    description: 'Conceptual project exploring how we process mortality through design and narrative. A meditation on impermanence.',
    category: 'solo'
  },
  // Side Projects
  {
    id: 'workflow',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    title: 'Workflow Suite',
    description: 'Personal collection of automation scripts and tools for daily efficiency. From email sorting to data processing, automated.',
    category: 'side'
  },
  {
    id: 'agent',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
    title: 'Agent Framework',
    description: 'Experimental framework for building autonomous AI agents. Custom tools, memory systems, and decision-making capabilities.',
    category: 'side'
  },
  {
    id: 'os',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
    title: 'Joeyconnects.os',
    description: 'This website - a personal operating system for structuring ideas and building tools. An ongoing experiment in digital presence.',
    category: 'side'
  }
];

interface ProjectItemProps {
  project: Project;
  isSelected: boolean;
  onClick: () => void;
}

const ProjectItem: React.FC<ProjectItemProps> = ({ project, isSelected, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-3 transition-all cursor-pointer group ${
        isSelected ? 'opacity-100' : 'opacity-60 hover:opacity-100'
      }`}
    >
      <div className={`w-10 h-10 flex items-center justify-center mb-2 transition-colors ${
        isSelected ? 'text-ph-blue' : 'text-ph-black group-hover:text-ph-blue'
      }`}>
        {project.icon}
      </div>
      <span className={`text-xs font-bold font-sans text-center ${
        isSelected ? 'text-ph-black' : 'text-gray-600'
      }`}>
        {project.title}
      </span>
    </button>
  );
};

interface CategorySectionProps {
  title: string;
  icon: React.ReactNode;
  projects: Project[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const CategorySection: React.FC<CategorySectionProps> = ({ title, icon, projects, selectedId, onSelect }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-ph-black">
        {icon}
        <h2 className="font-bold font-sans text-base">{title}</h2>
        <span className="text-xs font-mono text-gray-500">({projects.length})</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {projects.map(project => (
          <ProjectItem
            key={project.id}
            project={project}
            isSelected={selectedId === project.id}
            onClick={() => onSelect(project.id)}
          />
        ))}
      </div>
    </div>
  );
};

export const ProductOSApp: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>('geo');

  const selectedProject = projects.find(p => p.id === selectedId);
  const workProjects = projects.filter(p => p.category === 'work');
  const soloProjects = projects.filter(p => p.category === 'solo');
  const sideProjects = projects.filter(p => p.category === 'side');

  return (
    <div className="h-full flex bg-ph-beige">
      {/* Left Sidebar - Project Icons */}
      <div className="w-96 border-r-4 border-ph-black p-6 overflow-y-auto bg-white">
        <h1 className="text-3xl font-bold font-sans mb-6">
          Product <span className="text-ph-blue">OS</span>
        </h1>

        <CategorySection
          title="Work"
          icon={<Briefcase size={16} />}
          projects={workProjects}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />

        <CategorySection
          title="Solo Product"
          icon={<Package size={16} />}
          projects={soloProjects}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />

        <CategorySection
          title="Side Project"
          icon={<Zap size={16} />}
          projects={sideProjects}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
      </div>

      {/* Right Content - Project Details */}
      <div className="flex-1 p-8 overflow-y-auto">
        {selectedProject && (
          <div className="max-w-2xl">
            <div className="flex items-start gap-6 mb-6">
              <div className="w-14 h-14 bg-ph-blue border-2 border-ph-black flex items-center justify-center flex-shrink-0 text-white">
                {selectedProject.icon}
              </div>
              <div>
                <h2 className="text-3xl font-bold font-sans mb-2">{selectedProject.title}</h2>
                <span className="inline-block px-3 py-1 bg-ph-black text-white text-xs font-mono">
                  {selectedProject.category.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="prose prose-sm">
              <p className="text-base leading-relaxed font-mono text-gray-700">
                {selectedProject.description}
              </p>
            </div>

            <div className="mt-8 pt-6 border-t-2 border-ph-black">
              {selectedProject.appUrl ? (
                <a
                  href={selectedProject.appUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-3 bg-ph-blue text-white border-2 border-ph-black shadow-retro-sm hover:shadow-retro hover:-translate-y-1 transition-all font-bold font-sans"
                >
                  Launch App →
                </a>
              ) : (
                <a
                  href="#"
                  className="inline-block px-6 py-3 bg-ph-blue text-white border-2 border-ph-black shadow-retro-sm hover:shadow-retro hover:-translate-y-1 transition-all font-bold font-sans"
                >
                  Learn More →
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
