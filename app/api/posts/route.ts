import { NextResponse } from 'next/server';
import { getAllWriting } from '@/lib/content';

export async function GET() {
  const posts = await getAllWriting();

  // Return only the fields needed for the listing
  const simplifiedPosts = posts.map(post => ({
    slug: post.slug,
    title: post.title,
    date: post.date,
    tags: post.tags,
    category: post.category,
  }));

  return NextResponse.json(simplifiedPosts);
}
