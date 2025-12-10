import React, { useRef, useState } from 'react';
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
  onResize: (size: { width: number; height: number }) => void;
}

export const Window: React.FC<WindowProps> = ({
  config,
  state,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onDragEnd,
  onResize
}) => {
  const isMobile = window.innerWidth < 768;
  const windowRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const resizeStartRef = useRef<{ width: number; height: number; mouseX: number; mouseY: number } | null>(null);

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      onDragEnd({ x: info.point.x, y: info.point.y });
  };

  const handleResizeStart = (e: React.MouseEvent, direction: string) => {
    e.preventDefault();
    e.stopPropagation();
    onFocus();
    setIsResizing(true);

    const currentWidth = state.size?.width || config.defaultWidth || 600;
    const currentHeight = state.size?.height || config.defaultHeight || 500;

    resizeStartRef.current = {
      width: currentWidth,
      height: currentHeight,
      mouseX: e.clientX,
      mouseY: e.clientY
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!resizeStartRef.current) return;

      const deltaX = moveEvent.clientX - resizeStartRef.current.mouseX;
      const deltaY = moveEvent.clientY - resizeStartRef.current.mouseY;

      let newWidth = resizeStartRef.current.width;
      let newHeight = resizeStartRef.current.height;

      if (direction.includes('e')) {
        newWidth = Math.max(300, resizeStartRef.current.width + deltaX);
      }
      if (direction.includes('w')) {
        newWidth = Math.max(300, resizeStartRef.current.width - deltaX);
      }
      if (direction.includes('s')) {
        newHeight = Math.max(200, resizeStartRef.current.height + deltaY);
      }
      if (direction.includes('n')) {
        newHeight = Math.max(200, resizeStartRef.current.height - deltaY);
      }

      onResize({ width: newWidth, height: newHeight });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      resizeStartRef.current = null;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  if (state.isMinimized) return null;

  const currentWidth = state.size?.width || config.defaultWidth || 600;
  const currentHeight = state.size?.height || config.defaultHeight || 500;

  return (
    <motion.div
      ref={windowRef}
      drag={!state.isMaximized && !isMobile && !isResizing}
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
        width: state.isMaximized || isMobile ? '100%' : currentWidth,
        height: state.isMaximized || isMobile ? 'calc(100% - 32px)' : currentHeight,
        top: state.isMaximized || isMobile ? '32px' : undefined,
        left: state.isMaximized || isMobile ? 0 : undefined,
      }}
      exit={{ scale: 0.9, opacity: 0 }}
      onDragStart={onFocus}
      onDragEnd={handleDragEnd}
      onClick={onFocus}
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

      {/* Resize Handles - Only show when not maximized and not on mobile */}
      {!state.isMaximized && !isMobile && (
        <>
          {/* Corner handles */}
          <div
            onMouseDown={(e) => handleResizeStart(e, 'se')}
            className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-10"
            style={{ background: 'transparent' }}
          />
          <div
            onMouseDown={(e) => handleResizeStart(e, 'sw')}
            className="absolute bottom-0 left-0 w-4 h-4 cursor-sw-resize z-10"
            style={{ background: 'transparent' }}
          />
          <div
            onMouseDown={(e) => handleResizeStart(e, 'ne')}
            className="absolute top-0 right-0 w-4 h-4 cursor-ne-resize z-10"
            style={{ background: 'transparent' }}
          />
          <div
            onMouseDown={(e) => handleResizeStart(e, 'nw')}
            className="absolute top-0 left-0 w-4 h-4 cursor-nw-resize z-10"
            style={{ background: 'transparent' }}
          />

          {/* Edge handles */}
          <div
            onMouseDown={(e) => handleResizeStart(e, 'e')}
            className="absolute top-0 right-0 bottom-0 w-2 cursor-ew-resize z-10"
            style={{ background: 'transparent' }}
          />
          <div
            onMouseDown={(e) => handleResizeStart(e, 'w')}
            className="absolute top-0 left-0 bottom-0 w-2 cursor-ew-resize z-10"
            style={{ background: 'transparent' }}
          />
          <div
            onMouseDown={(e) => handleResizeStart(e, 's')}
            className="absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize z-10"
            style={{ background: 'transparent' }}
          />
          <div
            onMouseDown={(e) => handleResizeStart(e, 'n')}
            className="absolute top-0 left-0 right-0 h-2 cursor-ns-resize z-10"
            style={{ background: 'transparent' }}
          />
        </>
      )}
    </motion.div>
  );
};
