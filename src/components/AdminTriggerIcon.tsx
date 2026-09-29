import React from 'react';

interface AdminTriggerIconProps {
  onClick: () => void;
}

export const AdminTriggerIcon: React.FC<AdminTriggerIconProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      type="button"
      aria-label="Abrir panel de administración"
      title="Acceso de Administración"
      className="group relative inline-flex items-center justify-center p-1 rounded-full transition-transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 cursor-pointer"
    >
      {/* Original Geometric Badge SVG */}
      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-800 p-0.5 shadow-md group-hover:shadow-lg group-hover:from-indigo-900 group-hover:to-slate-700 transition-all duration-300">
        <div className="w-full h-full rounded-full bg-gradient-to-br from-slate-900 to-indigo-950 flex items-center justify-center overflow-hidden relative">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute inset-0 bg-radial from-indigo-500/20 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />

          {/* Original Bespoke Vector Graphic: Stylized Hexagonal Nexus with Data Hub */}
          <svg
            viewBox="0 0 100 100"
            className="w-8 h-8 sm:w-9 sm:h-9 text-indigo-400 group-hover:text-indigo-300 transition-colors drop-shadow-sm"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Outer Hex Shield */}
            <polygon
              points="50,12 84,30 84,70 50,88 16,70 16,30"
              stroke="currentColor"
              strokeWidth="5"
              strokeLinejoin="round"
              strokeLinecap="round"
              className="opacity-70 group-hover:opacity-100 transition-opacity"
            />
            {/* Inner Geometric Circuit Matrix */}
            <polygon
              points="50,26 72,38 72,62 50,74 28,62 28,38"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeLinejoin="round"
              strokeOpacity="0.4"
            />
            {/* Central Data Core Node */}
            <circle
              cx="50"
              cy="50"
              r="7"
              fill="#6366F1"
              className="group-hover:fill-indigo-300 transition-colors"
            />
            {/* Radial Connection Vectors */}
            <line x1="50" y1="26" x2="50" y2="43" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            <line x1="72" y1="62" x2="56" y2="54" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            <line x1="28" y1="62" x2="44" y2="54" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </button>
  );
};
