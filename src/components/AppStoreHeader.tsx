import React from 'react';
import { Search, Menu } from 'lucide-react';

interface AppStoreHeaderProps {
  onOpenMobileMenu: () => void;
}

export const AppStoreHeader: React.FC<AppStoreHeaderProps> = ({ onOpenMobileMenu }) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 py-2.5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
          aria-label="Abrir menú"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search Input bar mimicking App Store */}
        <div className="relative w-48 sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar apps, juegos y más"
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-100/80 text-xs text-slate-800 placeholder:text-slate-400 border-none focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* User avatar mockup */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 text-white flex items-center justify-center text-xs font-semibold shadow-xs">
          A
        </div>
      </div>
    </header>
  );
};
