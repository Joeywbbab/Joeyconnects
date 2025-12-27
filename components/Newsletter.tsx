'use client';

import { useState } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');

    // TODO: Replace with actual newsletter API integration (e.g., Buttondown, ConvertKit, Mailchimp)
    // For now, simulate a successful submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    setStatus('success');
    setEmail('');

    // Reset after 3 seconds
    setTimeout(() => setStatus('idle'), 3000);
  };

  return (
    <div className="border-t border-dashed border-black/10 mt-16 pt-12">
      <div className="max-w-xl mx-auto text-center">
        {/* Title */}
        <h3 className="font-serif italic text-2xl mb-2">Stay Updated</h3>
        <p className="font-typewriter text-sm opacity-60 mb-6">
          Get notified when I publish new posts about GEO, AI, and product building.
        </p>

        {/* Form */}
        {status === 'success' ? (
          <div className="bg-green-50 border border-green-200 px-6 py-4 inline-block">
            <p className="font-typewriter text-sm text-green-700">
              Thanks for subscribing!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 justify-center">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="px-4 py-3 border border-black/10 font-mono text-sm bg-white/50 focus:outline-none focus:border-red-600 transition-colors w-full sm:w-64"
              required
              disabled={status === 'loading'}
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="bg-black text-white px-6 py-3 font-mono text-xs uppercase tracking-widest hover:bg-red-600 transition-colors disabled:opacity-50"
            >
              {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
        )}

        {/* Privacy note */}
        <p className="font-mono text-[10px] opacity-40 mt-4 uppercase tracking-wider">
          No spam. Unsubscribe anytime.
        </p>
      </div>
    </div>
  );
}
