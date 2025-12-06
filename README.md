# Joeyconnects.os

Joey's personal operating system - a macOS-style desktop interface built with React, TypeScript, and Framer Motion. A digital lab for structuring ideas, building tools, and exploring creative projects.

## Features

- 🖥️ Interactive desktop interface with draggable windows
- 📝 Multiple built-in apps (Terminal, Write, Memo, etc.)
- 🎨 Retro-inspired design with smooth animations
- 📱 Responsive design (mobile-friendly)
- 🔒 Security-hardened (XSS protection, Error Boundaries)
- ⚡ Built with TypeScript strict mode for type safety

## Run Locally

**Prerequisites:** Node.js 18+

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

4. Preview production build:
   ```bash
   npm run preview
   ```

## Tech Stack

- React 19
- TypeScript (strict mode)
- Vite
- Framer Motion
- Tailwind CSS
- Lucide Icons

## Security Features

- ✅ XSS protection with HTML escaping in Terminal
- ✅ Error Boundary for graceful error handling
- ✅ TypeScript strict mode enabled
- ✅ Input validation and sanitization
- ✅ No API keys exposed in client code

## License

MIT
