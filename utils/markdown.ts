export interface Post {
  id: string;
  title: string;
  date: string;
  tags: string[];
  excerpt: string;
  content: string;
  filename: string;
}

export function parseFrontmatter(markdown: string, filename: string): Post {
  const frontmatterRegex = /^---\n([\s\S]+?)\n---\n([\s\S]*)$/;
  const match = markdown.match(frontmatterRegex);

  if (!match) {
    return {
      id: filename,
      title: filename,
      date: '',
      tags: [],
      excerpt: '',
      content: markdown,
      filename
    };
  }

  const [, yamlContent, content] = match;
  const frontmatter: Record<string, any> = {};

  yamlContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length) {
      let value = valueParts.join(':').trim();

      // 解析数组
      if (value.startsWith('[') && value.endsWith(']')) {
        value = value.slice(1, -1).split(',').map(s => s.trim().replace(/^["']|["']$/g, ''));
      }

      frontmatter[key.trim()] = value;
    }
  });

  return {
    id: filename,
    title: frontmatter.title || filename,
    date: frontmatter.date || '',
    tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
    excerpt: frontmatter.excerpt || content.trim().slice(0, 150) + '...',
    content: content.trim(),
    filename
  };
}
