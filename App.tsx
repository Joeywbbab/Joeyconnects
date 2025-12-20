import React, { useState, useMemo, useRef } from 'react';
import { AppId, AppConfig, WindowState } from './types';
import { Terminal, PenTool, StickyNote, Box, Video, BookOpen, Plane, GraduationCap, Layout, LogIn } from 'lucide-react';
import { MenuBar } from './components/Desktop/MenuBar';
import { DesktopIcons } from './components/Desktop/DesktopIcons';
import { Window } from './components/Desktop/Window';
import { WelcomeApp } from './apps/WelcomeApp';
import { TerminalApp } from './apps/TerminalApp';
import { ProductOSApp } from './apps/ProductOSApp';
import { MemoApp } from './apps/MemoApp';
import { WriteApp } from './apps/WriteApp';
import { VideosApp } from './apps/VideosApp';
import { ComicsApp } from './apps/ComicsApp';
import { LoginApp } from './apps/LoginApp';
import { AuthProvider } from './contexts/AuthContext';
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
      defaultWidth: window.innerWidth - 220,  // 减去左右 icons 宽度
      defaultHeight: window.innerHeight - 90, // 减去顶部 navbar 和底部空间
      defaultX: 110,
      defaultY: 40
    },
    {
      id: AppId.PRODUCT_OS,
      title: 'Product OS',
      icon: <Box />,
      component: <ProductOSApp />,
      defaultWidth: window.innerWidth - 250,
      defaultHeight: window.innerHeight - 110,
      defaultX: 110,
      defaultY: 40
    },
    {
      id: AppId.TERMINAL,
      title: 'Terminal',
      icon: <Terminal />,
      component: <TerminalApp />,
      defaultWidth: Math.min(700, window.innerWidth * 0.55),
      defaultHeight: Math.min(450, window.innerHeight * 0.45),
      defaultX: 200,
      defaultY: 200
    },
    {
      id: AppId.WRITE,
      title: 'Write',
      icon: <PenTool />,
      component: <WriteApp />,
      defaultWidth: window.innerWidth - 220,
      defaultHeight: window.innerHeight - 90,
      defaultX: 110,
      defaultY: 40
    },

    // Right Side
    {
      id: AppId.MEMO,
      title: 'Memo',
      icon: <StickyNote />,
      component: <MemoApp />,
      defaultWidth: window.innerWidth - 220,
      defaultHeight: window.innerHeight - 90,
      defaultX: 110,
      defaultY: 40
    },
    {
      id: AppId.VIDEOS,
      title: 'Videos',
      icon: <Video />,
      component: <VideosApp />,
      defaultWidth: window.innerWidth - 250,
      defaultHeight: window.innerHeight - 110,
      defaultX: 110,
      defaultY: 40
    },
    {
      id: AppId.COMICS,
      title: 'Comics',
      icon: <BookOpen />,
      component: <ComicsApp />,
      defaultWidth: window.innerWidth - 220,
      defaultHeight: window.innerHeight - 90,
      defaultX: 110,
      defaultY: 40
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
      defaultWidth: Math.min(400, window.innerWidth * 0.35),
      defaultHeight: Math.min(550, window.innerHeight * 0.55),
      defaultX: 100,
      defaultY: 250
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
      defaultWidth: window.innerWidth - 220,
      defaultHeight: window.innerHeight - 90,
      defaultX: 110,
      defaultY: 40
    },
    {
      id: AppId.LOGIN,
      title: 'Login',
      icon: <LogIn />,
      component: <LoginApp />,
      defaultWidth: Math.min(500, window.innerWidth * 0.4),
      defaultHeight: Math.min(600, window.innerHeight * 0.6),
      defaultX: window.innerWidth / 2 - 250,
      defaultY: window.innerHeight / 2 - 300
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

  const resizeWindow = (id: string, size: { width: number; height: number }) => {
    setWindows((prev: Record<string, WindowState>) => ({
      ...prev,
      [id]: { ...prev[id], size }
    }));
  };

  return (
    <AuthProvider>
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
                  onResize={(size) => resizeWindow(winState.id, size)}
                />
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </AuthProvider>
  );
}
