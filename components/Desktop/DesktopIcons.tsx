import React from 'react';
import { AppConfig, AppId } from '../../types';

interface DesktopIconsProps {
  apps: AppConfig[];
  onOpenApp: (id: AppId) => void;
}

interface IconProps {
  app: AppConfig;
  onOpenApp: (id: AppId) => void;
}

const Icon: React.FC<IconProps> = ({ app, onOpenApp }) => (
  <button
    onClick={() => onOpenApp(app.id)}
    className={`
      group flex flex-col items-center gap-1.5 w-20 p-1 rounded-lg
      hover:bg-black/5 focus:outline-none focus:bg-black/10 transition-colors
      cursor-pointer text-center select-none
    `}
  >
    <div className="relative">
      <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-white border-2 border-ph-black shadow-retro-sm group-hover:-translate-y-0.5 group-hover:shadow-retro transition-all text-ph-black rounded-sm">
        {React.cloneElement(app.icon as React.ReactElement<{ size?: number }>, { size: 18 })}
      </div>
    </div>

    <span className="font-mono text-[10px] md:text-xs font-bold text-ph-black bg-ph-beige/80 px-1.5 py-0.5 border border-transparent group-hover:border-ph-black/10 rounded shadow-sm backdrop-blur-sm leading-tight break-words w-full">
      {app.title}
    </span>
  </button>
);

export const DesktopIcons: React.FC<DesktopIconsProps> = ({ apps, onOpenApp }) => {
  // Split apps evenly between left and right columns
  const midPoint = Math.ceil(apps.length / 2);
  const leftSideApps = apps.slice(0, midPoint);
  const rightSideApps = apps.slice(midPoint);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden top-8">
      {/* Left Column */}
      <div className="absolute top-4 left-2 md:left-4 flex flex-col gap-3 pointer-events-auto items-start">
         {leftSideApps.map(app => <Icon key={app.id} app={app} onOpenApp={onOpenApp} />)}
      </div>

      {/* Right Column */}
      <div className="absolute top-4 right-2 md:right-4 flex flex-col gap-3 pointer-events-auto items-end">
         {rightSideApps.map(app => <Icon key={app.id} app={app} onOpenApp={onOpenApp} />)}
      </div>

      {/* Bottom Quote */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center select-none">
        <p className="text-ph-black/70 text-lg md:text-xl leading-relaxed" style={{ fontFamily: "'Caveat', cursive" }}>
          Joey follows her curiosities.<br />
          Across decades, almost anything can bloom.
        </p>
      </div>
    </div>
  );
};