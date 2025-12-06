import React, { useState, useMemo, useRef } from 'react';
import { AppId, AppConfig, WindowState } from './types';
import { Terminal, PenTool, StickyNote, Box, Video, BookOpen, Plane, GraduationCap, Layout } from 'lucide-react';
import { MenuBar } from './components/Desktop/MenuBar';
import { DesktopIcons } from './components/Desktop/DesktopIcons';
import { Window } from './components/Desktop/Window';
import { WelcomeApp } from './apps/WelcomeApp';
import { TerminalApp } from './apps/TerminalApp';
import { ProductOSApp } from './apps/ProductOSApp';
import { MemoApp } from './apps/MemoApp';
import { WriteApp } from './apps/WriteApp';
import { AnimatePresence } from 'framer-motion';

const MAX_Z_INDEX = 9999;
const MIN_Z_INDEX = 10;

export default function App() {
  const [windows, setWindows] = useState<Record<string, WindowState>>({
    [AppId.WELCOME]: {
      id: AppId.WELCOME,
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      zIndex: MIN_Z_INDEX,
      position: { x: 100, y: 80 }
    }
  });

  const [activeWindowId, setActiveWindowId] = useState<string>(AppId.WELCOME);
  const zIndexCounterRef = useRef(MIN_Z_INDEX + 1);

  const getNextZIndex = (): number => {
    const current = zIndexCounterRef.current;
    zIndexCounterRef.current = current >= MAX_Z_INDEX ? MIN_Z_INDEX : current + 1;
    return current;
  };

  // --- Configuration ---
  const APPS: AppConfig[] = useMemo(() => [
    // Left Side
    {
      id: AppId.WELCOME,
      title: 'About',
      icon: <Layout />,
      component: <WelcomeApp />,
      defaultWidth: 800,
      defaultHeight: 600,
      defaultX: 100,
      defaultY: 80
    },
    {
      id: AppId.PRODUCT_OS,
      title: 'Product OS',
      icon: <Box />,
      component: <ProductOSApp />,
      defaultWidth: 1200,
      defaultHeight: 700,
      defaultX: 50,
      defaultY: 50
    },
    {
      id: AppId.TERMINAL,
      title: 'Terminal',
      icon: <Terminal />,
      component: <TerminalApp />,
      defaultWidth: 600,
      defaultHeight: 400,
      defaultX: 200,
      defaultY: 250
    },
    {
      id: AppId.WRITE,
      title: 'Write',
      icon: <PenTool />,
      component: <WriteApp />,
      defaultWidth: 1400,
      defaultHeight: 850,
      defaultX: 150,
      defaultY: 50
    },

    // Right Side
    {
      id: AppId.MEMO,
      title: 'Memo',
      icon: <StickyNote />,
      component: <MemoApp />,
      defaultWidth: 600,
      defaultHeight: 600,
      defaultX: 800,
      defaultY: 100
    },
    {
      id: AppId.VIDEOS,
      title: 'Videos',
      icon: <Video />,
      component: (
        <div className="h-full bg-ph-black text-ph-beige p-4 overflow-y-auto">
          <div className="grid grid-cols-1 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="aspect-video bg-gray-800 border-2 border-gray-700 flex items-center justify-center relative group cursor-pointer">
                <div className="w-16 h-16 rounded-full border-2 border-white flex items-center justify-center group-hover:bg-ph-orange group-hover:border-ph-orange group-hover:text-black transition-colors">
                  <Video size={32} />
                </div>
                <span className="absolute bottom-2 left-2 text-xs font-mono">demo_clip_0{i}.mp4</span>
              </div>
            ))}
          </div>
        </div>
      ),
      defaultWidth: 600,
      defaultHeight: 450,
      defaultX: 400,
      defaultY: 200
    },
    {
      id: AppId.COMICS,
      title: 'Comics',
      icon: <BookOpen />,
      component: (
        <div className="h-full bg-white p-4 overflow-y-auto flex flex-col items-center">
          <div className="w-full max-w-sm border-4 border-ph-black p-2 shadow-retro mb-4">
            <div className="aspect-square bg-gray-100 flex items-center justify-center text-center p-4 font-bold font-sans">
              "Why did the developer go broke? Because he used up all his cache."
            </div>
          </div>
          <div className="w-full max-w-sm border-4 border-ph-black p-2 shadow-retro">
            <div className="aspect-square bg-ph-blue text-white flex items-center justify-center text-center p-4 font-bold font-sans">
              *Debugging Face*
            </div>
          </div>
        </div>
      ),
      defaultWidth: 400,
      defaultHeight: 600,
      defaultX: 500,
      defaultY: 100
    },
    {
      id: AppId.TRAVEL,
      title: 'Travel',
      icon: <Plane />,
      component: (
        <div className="h-full bg-blue-50 p-4">
          <h2 className="font-bold font-sans text-xl mb-4 text-ph-blue">Destinations</h2>
          <div className="space-y-3 font-mono text-sm">
            <div className="flex justify-between items-center bg-white p-3 border-2 border-ph-black shadow-retro-sm">
              <span>Tokyo, JP</span>
              <span className="bg-green-100 px-2 py-0.5 text-xs border border-green-300">Visited</span>
            </div>
            <div className="flex justify-between items-center bg-white p-3 border-2 border-ph-black shadow-retro-sm">
              <span>Berlin, DE</span>
              <span className="bg-ph-orange px-2 py-0.5 text-xs border border-orange-300">Planned</span>
            </div>
            <div className="flex justify-between items-center bg-white p-3 border-2 border-ph-black shadow-retro-sm">
              <span>Reykjavik, IS</span>
              <span className="bg-gray-100 px-2 py-0.5 text-xs border border-gray-300">Wishlist</span>
            </div>
          </div>
        </div>
      ),
      defaultWidth: 350,
      defaultHeight: 500,
      defaultX: 100,
      defaultY: 300
    },
    {
      id: AppId.LEARN,
      title: 'Learn',
      icon: <GraduationCap />,
      component: (
        <div className="h-full bg-white p-6 font-sans">
          <h1 className="text-3xl font-bold mb-6">Knowledge Base</h1>
          <div className="space-y-4">
            <div className="border-l-4 border-ph-blue pl-4 py-1">
              <h3 className="font-bold text-lg">React Patterns</h3>
              <p className="text-sm text-gray-600">Advanced composition and hooks.</p>
            </div>
            <div className="border-l-4 border-ph-orange pl-4 py-1">
              <h3 className="font-bold text-lg">System Design</h3>
              <p className="text-sm text-gray-600">Scalability, availability, and reliability.</p>
            </div>
            <div className="border-l-4 border-ph-red pl-4 py-1">
              <h3 className="font-bold text-lg">AI Engineering</h3>
              <p className="text-sm text-gray-600">Prompt engineering and RAG pipelines.</p>
            </div>
          </div>
        </div>
      ),
      defaultWidth: 500,
      defaultHeight: 500,
      defaultX: 600,
      defaultY: 150
    }
  ], []);

  // --- Window Actions ---
  const openApp = (id: AppId) => {
    const nextZIndex = getNextZIndex();

    setWindows((prev: Record<string, WindowState>) => {
      const existing = prev[id];
      if (existing) {
        if (existing.isMinimized) {
          return {
            ...prev,
            [id]: { ...existing, isMinimized: false, zIndex: nextZIndex }
          };
        }
        return {
          ...prev,
          [id]: { ...existing, zIndex: nextZIndex }
        };
      }

      const config = APPS.find(a => a.id === id);
      return {
        ...prev,
        [id]: {
          id,
          isOpen: true,
          isMinimized: false,
          isMaximized: false,
          zIndex: nextZIndex,
          position: { x: config?.defaultX || 100, y: config?.defaultY || 100 },
          size: { width: config?.defaultWidth || 600, height: config?.defaultHeight || 500 }
        }
      };
    });
    setActiveWindowId(id);
  };

  const closeWindow = (id: string) => {
    setWindows((prev: Record<string, WindowState>) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const minimizeWindow = (id: string) => {
    setWindows((prev: Record<string, WindowState>) => ({
      ...prev,
      [id]: { ...prev[id], isMinimized: true }
    }));
  };

  const maximizeWindow = (id: string) => {
    setWindows((prev: Record<string, WindowState>) => ({
      ...prev,
      [id]: { ...prev[id], isMaximized: !prev[id].isMaximized }
    }));
    focusWindow(id);
  };

  const focusWindow = (id: string) => {
    if (activeWindowId === id) return;
    const nextZIndex = getNextZIndex();
    setWindows((prev: Record<string, WindowState>) => ({
      ...prev,
      [id]: { ...prev[id], zIndex: nextZIndex }
    }));
    setActiveWindowId(id);
  };

  return (
    <div className="h-screen w-screen overflow-hidden relative font-sans selection:bg-ph-orange selection:text-ph-black bg-ph-beige">
      <MenuBar />

      <DesktopIcons apps={APPS} onOpenApp={openApp} />

      <div className="absolute inset-0 top-8 bottom-0 z-10 pointer-events-none">
        <AnimatePresence>
          {Object.values(windows).map((winState: WindowState) => {
            const config = APPS.find(a => a.id === winState.id);
            if (!config) return null;
            return (
              <Window
                key={winState.id}
                config={config}
                state={winState}
                onClose={() => closeWindow(winState.id)}
                onMinimize={() => minimizeWindow(winState.id)}
                onMaximize={() => maximizeWindow(winState.id)}
                onFocus={() => focusWindow(winState.id)}
                onDragEnd={() => focusWindow(winState.id)}
              />
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
