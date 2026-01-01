'use client';

import { useEffect } from 'react';

export default function Newsletter() {
  useEffect(() => {
    // Load Substack embed script
    const script = document.createElement('script');
    script.src = 'https://substackapi.com/widget.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup
      const existingScript = document.querySelector('script[src="https://substackapi.com/widget.js"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  return (
    <div className="border-t border-dashed border-black/10 mt-16 pt-12">
      <div className="max-w-xl mx-auto text-center">
        {/* Title */}
        <h3 className="font-serif italic text-2xl mb-2">Stay Updated</h3>
        <p className="font-typewriter text-sm opacity-60 mb-6">
          Get notified when I publish new posts about GEO, AI, and product building.
        </p>

        {/* Substack Embed Form */}
        <div id="custom-substack-embed" className="flex justify-center"></div>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.CustomSubstackWidget = {
                substackUrl: "duoyu4thinking.substack.com",
                placeholder: "your@email.com",
                buttonText: "Subscribe",
                theme: "custom",
                colors: {
                  primary: "#000000",
                  input: "#FFFFFF",
                  email: "#000000",
                  text: "#FFFFFF",
                }
              };
            `,
          }}
        />

        {/* Privacy note */}
        <p className="font-mono text-[10px] opacity-40 mt-4 uppercase tracking-wider">
          No spam. Unsubscribe anytime.
        </p>
      </div>
    </div>
  );
}
