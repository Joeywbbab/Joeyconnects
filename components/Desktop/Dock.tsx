import React from 'react';
import { AppConfig, AppId } from '../../types';
import { motion } from 'framer-motion';

interface DockProps {
  apps: AppConfig[];
  openApps: AppId[];
  onOpenApp: (id: AppId) => void;
}

export const Dock: React.FC<DockProps> = ({ apps, openApps, onOpenApp }) => {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-end gap-3 px-4 py-3 bg-white border-2 border-ph-black shadow-retro rounded-xl">
        {apps.map((app) => {
          const isOpen = openApps.includes(app.id);
          
          return (
            <div key={app.id} className="relative group">
              {/* Tooltip */}
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-2 py-1 bg-ph-black text-white text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white">
                {app.title}
              </div>

              <motion.button
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onOpenApp(app.id)}
                className={`
                  w-12 h-12 md:w-14 md:h-14 flex items-center justify-center 
                  border-2 border-ph-black shadow-retro-sm transition-colors
                  ${isOpen ? 'bg-ph-beige' : 'bg-white hover:bg-gray-50'}
                `}
              >
                <div className="text-ph-black">
                    {/* Render icon with custom size */}
                    {React.cloneElement(app.icon as React.ReactElement, { size: 24 })}
                </div>
              </motion.button>
              
              {/* Active Indicator */}
              <div className={`
                absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-ph-black
                ${isOpen ? 'opacity-100' : 'opacity-0'}
              `} />
            </div>
          );
        })}
      </div>
    </div>
  );
};