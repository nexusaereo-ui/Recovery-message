import React from 'react';
import { 
  Search, 
  Sparkles, 
  Gamepad2, 
  LayoutGrid, 
  Flame, 
  Camera, 
  HeartPulse, 
  CheckSquare, 
  Film, 
  Swords, 
  Compass, 
  Brain, 
  Boxes 
} from 'lucide-react';

interface AppStoreSidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const AppStoreSidebar: React.FC<AppStoreSidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
}) => {
  const mainNav = [
    { id: 'buscar', label: 'Buscar', icon: Search },
    { id: 'hoy', label: 'Hoy', icon: Sparkles },
    { id: 'juegos', label: 'Juegos', icon: Gamepad2 },
    { id: 'apps', label: 'Apps', icon: LayoutGrid },
    { id: 'arcade', label: 'Arcade', icon: Flame },
  ];

  const categories = [
    { id: 'categorias', label: 'Categorías', icon: LayoutGrid },
    { id: 'foto', label: 'Fotografía y video', icon: Camera },
    { id: 'salud', label: 'Salud y fitness', icon: HeartPulse },
    { id: 'productividad', label: 'Productividad', icon: CheckSquare },
    { id: 'entretenimiento', label: 'Entretenimiento', icon: Film },
    { id: 'accion', label: 'Acción', icon: Swords },
    { id: 'aventura', label: 'Aventura', icon: Compass },
    { id: 'ingenio', label: 'De ingenio', icon: Brain },
    { id: 'indie', label: 'Indie', icon: Boxes },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full py-6 px-4">
      {/* Title */}
      <div className="flex items-center gap-2 px-3 mb-6">
        <svg viewBox="0 0 120 120" className="w-6 h-6 shrink-0" fill="none">
          <circle cx="60" cy="60" r="58" fill="#0070E0" />
          <g fill="#FFFFFF" fillRule="evenodd">
            <path d="M 33 87 C 31 84, 31 81, 33 78 L 53 37 C 55 33, 59 33, 61 35 L 65 39 C 67 41, 67 44, 65 47 L 42 90 C 40 93, 36 93, 34 91 Z" />
            <path d="M 87 87 C 89 84, 89 81, 87 78 L 67 37 C 65 33, 61 33, 59 35 L 55 39 C 53 41, 53 44, 55 47 L 78 90 C 80 93, 84 93, 86 91 Z" />
            <rect x="28" y="54" width="64" height="11" rx="5.5" fill="#FFFFFF" />
          </g>
        </svg>
        <span className="text-sm font-semibold text-slate-900 tracking-tight">
          App Store <span className="text-slate-400 font-normal">para iPhone ▾</span>
        </span>
      </div>

      {/* Main navigation */}
      <div className="space-y-1 mb-6">
        {mainNav.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onSelectTab(item.id);
                if (onCloseMobile) onCloseMobile();
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-600 font-semibold'
                  : 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-500'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Categorías Section */}
      <div className="mt-2">
        <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Categorías
        </p>
        <div className="space-y-0.5">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = currentTab === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  onSelectTab(cat.id);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 font-semibold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden lg:block w-64 border-r border-slate-200 bg-white shrink-0 h-screen sticky top-0 overflow-y-auto">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={onCloseMobile}
          />
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl z-10 overflow-y-auto">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
