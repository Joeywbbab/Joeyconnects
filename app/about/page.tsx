import { generateProfilePageSchema, renderSchema } from '@/lib/schema';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About',
  description: 'Problem-solving architect who builds products and writes about ideas.',
};

export default function AboutPage() {
  const schema = generateProfilePageSchema();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={renderSchema(schema)}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        {/* Book Style Layout */}
        <div className="relative">
          {/* Book spine shadow effect */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-8 -translate-x-1/2 bg-gradient-to-r from-black/5 via-black/10 to-black/5 z-10 pointer-events-none"></div>

          {/* Book pages container */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 bg-white/50 border border-black/10 shadow-2xl">

            {/* LEFT PAGE */}
            <div className="p-8 md:p-12 md:pr-16 border-b md:border-b-0 md:border-r border-black/5 relative">
              {/* Page fold effect */}
              <div className="hidden md:block absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-black/5 to-transparent"></div>

              {/* Photo */}
              <div className="relative w-36 h-44 mb-8">
                <div className="absolute -bottom-2 -right-2 w-full h-full bg-red-600/80 -z-10"></div>
                <div className="bg-white p-2 shadow-xl border border-black/10 h-full">
                  <div className="relative overflow-hidden border border-black/5 h-full">
                    <img
                      src="/images/person-listening.jpg"
                      alt="Joey"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="absolute -top-2 left-3 w-14 h-4 bg-yellow-200/80 -rotate-12 shadow-sm flex items-center justify-center">
                  <span className="font-mono text-[5px] text-black/70 tracking-[0.1em] font-bold">OBSERVER</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="font-serif italic text-4xl md:text-5xl mb-4">About Joey</h1>
              <p className="font-typewriter text-sm opacity-60 mb-8">
                Problem-solving architect who builds products and writes about ideas.
              </p>

              {/* Who I Am */}
              <div className="space-y-4 text-sm md:text-base text-gray-800 leading-relaxed">
                <p>
                  I'm Joey, a product architect. I build products, write about ideas,
                  and focus on AEO/GEO services helping brands get discovered by AI search engines.
                </p>
                <p>
                  My philosophy is simple: <strong>I find problems. I build solutions.</strong> No matter
                  how big a problem seems, I believe there's always a solution if you're willing to look
                  for it.
                </p>
              </div>

              {/* Page number */}
              <div className="absolute bottom-6 left-8 md:left-12 font-mono text-xs opacity-30">
                01
              </div>
            </div>

            {/* RIGHT PAGE */}
            <div className="p-8 md:p-12 md:pl-16 relative">
              {/* Page fold effect */}
              <div className="hidden md:block absolute top-0 left-0 w-8 h-8 bg-gradient-to-br from-black/5 to-transparent"></div>

              {/* Background */}
              <div className="mb-10">
                <h2 className="font-serif italic text-2xl mb-4 border-b border-black/10 pb-2">Background</h2>
                <div className="space-y-3 text-sm md:text-base text-gray-800 leading-relaxed">
                  <p>
                    My journey has taken me through data analysis, operations, consulting, and AI animation.
                    Each experience taught me to see problems from different angles and build solutions that work.
                  </p>
                  <p>
                    Currently, I'm focused on helping brands navigate the shift from traditional SEO to
                    GEO (Generative Engine Optimization) as AI search engines become the new way people
                    discover information.
                  </p>
                </div>
              </div>

              {/* Connect */}
              <div>
                <h2 className="font-serif italic text-2xl mb-4 border-b border-black/10 pb-2">Connect</h2>
                <p className="text-sm text-gray-600 mb-6">
                  I'm always interested in connecting with people working on interesting problems.
                </p>

                <div className="grid grid-cols-4 gap-3">
                  {/* X (Twitter) */}
                  <a
                    href="https://twitter.com/joeyconnects"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-2 p-3 border border-black/10 hover:border-red-600/50 hover:bg-red-50/30 transition-all group"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="opacity-50 group-hover:opacity-100 transition-opacity">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    <span className="font-mono text-[9px] opacity-50 group-hover:opacity-100">X</span>
                  </a>

                  {/* LinkedIn */}
                  <a
                    href="https://linkedin.com/in/joeyconnects"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-2 p-3 border border-black/10 hover:border-red-600/50 hover:bg-red-50/30 transition-all group"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50 group-hover:opacity-100 transition-opacity">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                      <rect width="4" height="12" x="2" y="9"/>
                      <circle cx="4" cy="4" r="2"/>
                    </svg>
                    <span className="font-mono text-[9px] opacity-50 group-hover:opacity-100">LinkedIn</span>
                  </a>

                  {/* GitHub */}
                  <a
                    href="https://github.com/joeyconnects"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-2 p-3 border border-black/10 hover:border-red-600/50 hover:bg-red-50/30 transition-all group"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50 group-hover:opacity-100 transition-opacity">
                      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
                      <path d="M9 18c-4.51 2-5-2-7-2"/>
                    </svg>
                    <span className="font-mono text-[9px] opacity-50 group-hover:opacity-100">GitHub</span>
                  </a>

                  {/* Email */}
                  <a
                    href="mailto:hello@joeyconnects.world"
                    className="flex flex-col items-center gap-2 p-3 border border-black/10 hover:border-red-600/50 hover:bg-red-50/30 transition-all group"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50 group-hover:opacity-100 transition-opacity">
                      <rect width="20" height="16" x="2" y="4" rx="2"/>
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                    </svg>
                    <span className="font-mono text-[9px] opacity-50 group-hover:opacity-100">Email</span>
                  </a>
                </div>

                <div className="mt-8 pt-6 border-t border-dashed border-black/10">
                  <Link href="/writing" className="inline-flex items-center gap-2 font-typewriter text-sm hover:text-red-600 transition-colors group">
                    <span>Read my writing</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform">
                      <path d="M5 12h14"/>
                      <path d="m12 5 7 7-7 7"/>
                    </svg>
                  </Link>
                </div>
              </div>

              {/* Page number */}
              <div className="absolute bottom-6 right-8 md:right-12 font-mono text-xs opacity-30">
                02
              </div>
            </div>
          </div>

          {/* Book edge shadow */}
          <div className="absolute -bottom-2 left-4 right-4 h-4 bg-gradient-to-b from-black/5 to-transparent rounded-b-lg"></div>
        </div>
      </div>
    </>
  );
}
