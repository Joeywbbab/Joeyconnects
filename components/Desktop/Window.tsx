import React from 'react';
import { motion, PanInfo } from 'framer-motion';
import { X, Minus, Maximize2, Minimize2 } from 'lucide-react';
import { AppConfig, WindowState } from '../../types';

interface WindowProps {
  config: AppConfig;
  state: WindowState;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;
  onDragEnd: (point: { x: number; y: number }) => void;
}

export const Window: React.FC<WindowProps> = ({ 
  config, 
  state, 
  onClose, 
  onMinimize, 
  onMaximize, 
  onFocus,
  onDragEnd
}) => {
  const isMobile = window.innerWidth < 768;

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      onDragEnd({ x: info.point.x, y: info.point.y });
  };

  if (state.isMinimized) return null;

  return (
    <motion.div
      drag={!state.isMaximized && !isMobile}
      dragMomentum={false}
      initial={{ 
        scale: 0.9, 
        opacity: 0, 
        x: isMobile ? 0 : (config.defaultX || 100), 
        y: isMobile ? 0 : (config.defaultY || 50) 
      }}
      animate={{ 
        scale: 1, 
        opacity: 1,
        x: state.isMaximized || isMobile ? 0 : undefined,
        y: state.isMaximized || isMobile ? 0 : undefined,
        width: state.isMaximized || isMobile ? '100%' : config.defaultWidth || 600,
        height: state.isMaximized || isMobile ? '100%' : config.defaultHeight || 500,
        top: state.isMaximized || isMobile ? 0 : undefined,
        left: state.isMaximized || isMobile ? 0 : undefined,
      }}
      exit={{ scale: 0.9, opacity: 0 }}
      onDragStart={onFocus}
      onDragEnd={handleDragEnd}
      onClick={onFocus} // Bring to front on click
      style={{ 
        position: state.isMaximized || isMobile ? 'fixed' : 'absolute',
        zIndex: state.zIndex,
      }}
      className={`
        flex flex-col bg-white border-4 border-ph-black shadow-retro-lg pointer-events-auto
        ${state.isMaximized || isMobile ? 'rounded-none border-0 md:border-4' : ''}
      `}
    >
      {/* Title Bar */}
      <div 
        className="h-10 bg-ph-black flex items-center justify-between px-2 cursor-grab active:cursor-grabbing shrink-0"
        onPointerDown={onFocus}
      >
        <div className="flex items-center gap-2 text-white font-mono font-bold text-sm uppercase select-none">
          <span className="text-ph-orange">{config.icon}</span>
          <span>{config.title}</span>
        </div>
        
        <div className="flex items-center gap-1">
          <button onClick={(e) => { e.stopPropagation(); onMinimize(); }} className="p-1 hover:bg-gray-700 text-white">
            <Minus size={14} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); onMaximize(); }} className="p-1 hover:bg-gray-700 text-white hidden md:block">
            {state.isMaximized ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
          <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="p-1 hover:bg-ph-red text-white">
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden relative bg-white">
        {config.component}
        {/* Overlay to prevent iframe capturing mouse events during drag if we had iframes, keeping for safety */}
        <div className="absolute inset-0 pointer-events-none" />
      </div>
    </motion.div>
  );
};
