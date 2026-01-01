import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'content');

export interface WritingPost {
  slug: string;
  title: string;
  date: string;
  category: string;
  description: string;
  excerpt: string;
  tags?: string[];
  content: string;
}

export interface Note {
  slug: string;
  title: string;
  date: string;
  category: 'thoughts' | 'growth' | 'reviews' | 'inspiration';
  content: string;
  tags?: string[];
  image?: string;
  video?: string;
  lang?: 'en' | 'zh';
}

export interface ProjectTimeline {
  date: string;
  title: string;
  description?: string;
}

export interface EmbedVersion {
  version: string;
  label: string;
  url: string;
  description?: string;
}

export interface Project {
  slug: string;
  title: string;
  description: string;
  problem: string;
  solution: string;
  features?: string[];
  tech?: string[];
  demoUrl?: string;
  githubUrl?: string;
  status: 'active' | 'in-progress' | 'archived';
  // New fields
  category: 'work' | 'tools' | 'experiments';
  coverImage?: string;
  embedType?: 'local' | 'external' | 'none';
  embedUrl?: string;
  embedHeight?: string;
  embedVersions?: EmbedVersion[];
  timeline?: ProjectTimeline[];
  createdAt?: string;
  updatedAt?: string;
  relatedPosts?: string[];
  content: string;
}

// Writing functions
export async function getAllWriting(): Promise<WritingPost[]> {
  const writingDir = path.join(contentDirectory, 'writing');

  if (!fs.existsSync(writingDir)) {
    return [];
  }

  const fileNames = fs.readdirSync(writingDir);

  const posts = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(writingDir, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      return {
        slug,
        title: data.title || '',
        date: data.date || '',
        category: data.category || 'blog',
        description: data.description || '',
        excerpt: data.excerpt || content.slice(0, 150) + '...',
        tags: data.tags || [],
        content,
      };
    })
    .sort((a, b) => (new Date(b.date).getTime() - new Date(a.date).getTime()));

  return posts;
}

export async function getWritingBySlug(slug: string): Promise<WritingPost | null> {
  const fullPath = path.join(contentDirectory, 'writing', `${slug}.md`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug,
    title: data.title || '',
    date: data.date || '',
    category: data.category || 'blog',
    description: data.description || '',
    excerpt: data.excerpt || content.slice(0, 150) + '...',
    tags: data.tags || [],
    content,
  };
}

// Notes functions
export async function getAllNotes(): Promise<Note[]> {
  const notesDir = path.join(contentDirectory, 'notes');

  if (!fs.existsSync(notesDir)) {
    return [];
  }

  const fileNames = fs.readdirSync(notesDir);

  const notes = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(notesDir, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      return {
        slug,
        title: data.title || '',
        date: data.date || '',
        category: data.category || 'inspiration',
        content,
        tags: data.tags || [],
        image: data.image,
        video: data.video,
        lang: data.lang || 'en',
      };
    })
    .sort((a, b) => (new Date(b.date).getTime() - new Date(a.date).getTime()));

  return notes;
}

export async function getNoteBySlug(slug: string): Promise<Note | null> {
  const fullPath = path.join(contentDirectory, 'notes', `${slug}.md`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug,
    title: data.title || '',
    date: data.date || '',
    category: data.category || 'inspiration',
    content,
    tags: data.tags || [],
    image: data.image,
    video: data.video,
    lang: data.lang || 'en',
  };
}

// Projects functions
export async function getAllProjects(): Promise<Project[]> {
  const projectsDir = path.join(contentDirectory, 'projects');

  if (!fs.existsSync(projectsDir)) {
    return [];
  }

  const fileNames = fs.readdirSync(projectsDir);

  const projects = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(projectsDir, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      return {
        slug,
        title: data.title || '',
        description: data.description || '',
        problem: data.problem || '',
        solution: data.solution || '',
        features: data.features || [],
        tech: data.tech || [],
        demoUrl: data.demoUrl,
        githubUrl: data.githubUrl,
        status: data.status || 'active',
        category: data.category || 'tools',
        coverImage: data.coverImage,
        embedType: data.embedType || 'none',
        embedUrl: data.embedUrl,
        embedHeight: data.embedHeight || '500px',
        embedVersions: data.embedVersions || [],
        timeline: data.timeline || [],
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        relatedPosts: data.relatedPosts || [],
        content,
      };
    });

  return projects;
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const fullPath = path.join(contentDirectory, 'projects', `${slug}.md`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug,
    title: data.title || '',
    description: data.description || '',
    problem: data.problem || '',
    solution: data.solution || '',
    features: data.features || [],
    tech: data.tech || [],
    demoUrl: data.demoUrl,
    githubUrl: data.githubUrl,
    status: data.status || 'active',
    category: data.category || 'tools',
    coverImage: data.coverImage,
    embedType: data.embedType || 'none',
    embedUrl: data.embedUrl,
    embedHeight: data.embedHeight || '500px',
    embedVersions: data.embedVersions || [],
    timeline: data.timeline || [],
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    relatedPosts: data.relatedPosts || [],
    content,
  };
}
