import React from 'react';

interface FooterEmblemsProps {
  onAdminClick: () => void;
}

export const FooterEmblems: React.FC<FooterEmblemsProps> = ({ onAdminClick }) => {
  return (
    <div className="flex items-center justify-center gap-3 sm:gap-5 flex-wrap">
      {/* 1. Logo Decorativo Izquierdo Extremo: Matriz de Almacenamiento */}
      <div
        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-800 p-0.5 shadow-sm opacity-80 hover:opacity-100 transition-all select-none"
        title="Módulo de Persistencia"
      >
        <div className="w-full h-full rounded-full bg-gradient-to-br from-slate-900 to-indigo-950 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-indigo-500/10 opacity-50" />
          <svg
            viewBox="0 0 100 100"
            className="w-6 h-6 sm:w-7 sm:h-7 text-indigo-400/80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Capas apiladas de almacenamiento */}
            <path
              d="M50 20 L82 34 L50 48 L18 34 Z"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            <path
              d="M18 46 L50 60 L82 46"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            <path
              d="M18 58 L50 72 L82 58"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            <circle cx="50" cy="34" r="3.5" fill="#818CF8" />
          </svg>
        </div>
      </div>

      {/* 2. Logo Decorativo Izquierdo Interior: Prisma de Datos */}
      <div
        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-800 p-0.5 shadow-sm opacity-80 hover:opacity-100 transition-all select-none"
        title="Canal de Sincronización"
      >
        <div className="w-full h-full rounded-full bg-gradient-to-br from-slate-900 to-indigo-950 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-indigo-500/10 opacity-50" />
          <svg
            viewBox="0 0 100 100"
            className="w-6 h-6 sm:w-7 sm:h-7 text-indigo-400/80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Triángulo Geométrico Interconectado */}
            <polygon
              points="50,18 82,76 18,76"
              stroke="currentColor"
              strokeWidth="4.5"
              strokeLinejoin="round"
            />
            <circle cx="50" cy="18" r="4.5" fill="#818CF8" />
            <circle cx="82" cy="76" r="4.5" fill="#818CF8" />
            <circle cx="18" cy="76" r="4.5" fill="#818CF8" />
            <line x1="50" y1="18" x2="50" y2="56" stroke="currentColor" strokeWidth="3" />
            <line x1="18" y1="76" x2="50" y2="56" stroke="currentColor" strokeWidth="3" />
            <line x1="82" y1="76" x2="50" y2="56" stroke="currentColor" strokeWidth="3" />
            <circle cx="50" cy="56" r="5" fill="#6366F1" />
          </svg>
        </div>
      </div>

      {/* 3. LOGO CENTRAL (EL ÚNICO CON ACCESO AL PANEL DE ADMINISTRACIÓN) */}
      <button
        onClick={onAdminClick}
        type="button"
        aria-label="Abrir panel de administración"
        title="Acceso de Administración"
        className="group relative inline-flex items-center justify-center p-1 rounded-full transition-transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 cursor-pointer"
      >
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-800 p-0.5 shadow-md group-hover:shadow-lg group-hover:from-indigo-900 group-hover:to-slate-700 transition-all duration-300">
          <div className="w-full h-full rounded-full bg-gradient-to-br from-slate-900 to-indigo-950 flex items-center justify-center overflow-hidden relative">
            {/* Ambient Glow */}
            <div className="absolute inset-0 bg-indigo-500/20 opacity-60 group-hover:opacity-100 transition-opacity" />

            {/* Original Hexagonal Nexus Shield */}
            <svg
              viewBox="0 0 100 100"
              className="w-8 h-8 sm:w-9 sm:h-9 text-indigo-400 group-hover:text-indigo-300 transition-colors drop-shadow-sm"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <polygon
                points="50,12 84,30 84,70 50,88 16,70 16,30"
                stroke="currentColor"
                strokeWidth="5"
                strokeLinejoin="round"
                strokeLinecap="round"
                className="opacity-70 group-hover:opacity-100 transition-opacity"
              />
              <polygon
                points="50,26 72,38 72,62 50,74 28,62 28,38"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinejoin="round"
                strokeOpacity="0.4"
              />
              <circle
                cx="50"
                cy="50"
                r="7"
                fill="#6366F1"
                className="group-hover:fill-indigo-300 transition-colors"
              />
              <line x1="50" y1="26" x2="50" y2="43" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              <line x1="72" y1="62" x2="56" y2="54" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              <line x1="28" y1="62" x2="44" y2="54" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </button>

      {/* 4. Logo Decorativo Derecho Interior: Órbitas / Red de Nodos */}
      <div
        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-800 p-0.5 shadow-sm opacity-80 hover:opacity-100 transition-all select-none"
        title="Red de Enlaces"
      >
        <div className="w-full h-full rounded-full bg-gradient-to-br from-slate-900 to-indigo-950 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-indigo-500/10 opacity-50" />
          <svg
            viewBox="0 0 100 100"
            className="w-6 h-6 sm:w-7 sm:h-7 text-indigo-400/80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Órbitas concéntricas con nodos */}
            <circle cx="50" cy="50" r="28" stroke="currentColor" strokeWidth="3.5" strokeDasharray="3 3" />
            <circle cx="50" cy="50" r="16" stroke="currentColor" strokeWidth="3.5" />
            <circle cx="50" cy="50" r="5" fill="#818CF8" />
            <circle cx="50" cy="22" r="4" fill="#6366F1" />
            <circle cx="74" cy="64" r="4" fill="#6366F1" />
            <circle cx="26" cy="64" r="4" fill="#6366F1" />
          </svg>
        </div>
      </div>

      {/* 5. Logo Decorativo Derecho Extremo: Escudo Criptográfico */}
      <div
        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-800 p-0.5 shadow-sm opacity-80 hover:opacity-100 transition-all select-none"
        title="Seguridad e Integridad"
      >
        <div className="w-full h-full rounded-full bg-gradient-to-br from-slate-900 to-indigo-950 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-indigo-500/10 opacity-50" />
          <svg
            viewBox="0 0 100 100"
            className="w-6 h-6 sm:w-7 sm:h-7 text-indigo-400/80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Escudo con cerradura central */}
            <path
              d="M50 18 L78 28 C78 58 50 78 50 78 C50 78 22 58 22 28 Z"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            <circle cx="50" cy="44" r="5" fill="#818CF8" />
            <path
              d="M48 48 L46 58 L54 58 L52 48"
              fill="#818CF8"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
