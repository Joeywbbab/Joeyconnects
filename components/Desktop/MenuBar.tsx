import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Wifi, Battery } from 'lucide-react';

export const MenuBar: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-8 bg-white border-b-2 border-ph-black flex items-center justify-between px-3 fixed top-0 w-full z-50 select-none shadow-sm">
      <div className="flex items-center gap-4">
        <button className="flex items-center gap-2 font-bold font-sans text-sm hover:bg-ph-orange px-2 py-0.5 border-2 border-transparent hover:border-ph-black transition-colors">
          <img src="/logo.svg" alt="Logo" className="w-5 h-5" />
          <span className="hidden md:inline">Joeyconnects.os</span>
        </button>

        <div className="hidden md:flex gap-4 text-xs font-mono font-bold text-gray-600">
           <span className="hover:text-ph-black cursor-pointer">Product OS</span>
           <span className="hover:text-ph-black cursor-pointer">Docs</span>
           <span className="hover:text-ph-black cursor-pointer">Videos</span>
        </div>
      </div>

      <div className="flex items-center gap-4 font-mono text-xs font-bold">
        <div className="hidden md:flex items-center gap-2">
            <Wifi size={14} />
            <Battery size={14} />
            <span>100%</span>
        </div>
        <div className="bg-ph-black text-white px-2 py-0.5">
          {format(time, 'EEE MMM d HH:mm')}
        </div>
      </div>
    </div>
  );
};
