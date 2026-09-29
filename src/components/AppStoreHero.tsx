import React, { useState } from 'react';
import { Share2, Star, User, Check, RefreshCw } from 'lucide-react';

export const AppStoreHero: React.FC = () => {
  const [copiedShare, setCopiedShare] = useState(false);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  return (
    <div>
      {/* Turquoise Gradient Banner */}
      <div className="relative bg-gradient-to-r from-[#0d9488] via-[#0f766e] to-[#047857] text-white px-6 sm:px-10 py-10 sm:py-12 overflow-hidden shadow-inner">
        {/* Subtle background glow/watermark circles */}
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-white/5 blur-2xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 w-64 h-64 rounded-full bg-teal-300/10 blur-xl pointer-events-none" />

        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 relative z-10">
          {/* App Icon (Vector App Store Style Icon with custom brand) */}
          <div className="w-28 h-28 sm:w-36 sm:h-36 shrink-0 rounded-3xl overflow-hidden shadow-2xl border-2 border-white/20 bg-gradient-to-br from-emerald-500 to-teal-700 p-0.5 flex items-center justify-center">
            <div className="w-full h-full rounded-[22px] bg-gradient-to-br from-emerald-600 via-teal-700 to-cyan-800 flex items-center justify-center p-3 relative overflow-hidden shadow-inner">
              <div className="absolute inset-0 bg-radial from-white/20 via-transparent to-transparent opacity-60" />
              <svg
                viewBox="0 0 100 100"
                className="w-16 h-16 sm:w-20 sm:h-20 text-white drop-shadow-md"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Chat bubble outline */}
                <path
                  d="M20 50 C20 32, 34 20, 50 20 C66 20, 80 32, 80 50 C80 66, 68 78, 52 79 L42 85 C39 87, 36 85, 36 82 L37 76 C27 71, 20 61, 20 50 Z"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="6"
                  strokeLinejoin="round"
                />
                {/* Trash/Restore arrow in center */}
                <path
                  d="M42 38 L58 38 M44 38 L46 34 L54 34 L56 38"
                  stroke="#FFFFFF"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <path
                  d="M44 42 L46 62 C46 64, 48 66, 50 66 C52 66, 54 64, 54 62 L56 42"
                  stroke="#FFFFFF"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                {/* Circular recovery arrow badge */}
                <circle cx="68" cy="35" r="14" fill="#10B981" stroke="#FFFFFF" strokeWidth="3" />
                <path
                  d="M63 35 A5 5 0 1 1 73 37 M73 33 L73 37 L69 37"
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {/* App Title & Details with new brand */}
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white drop-shadow-xs">
              RECOV: Restaurar Mensajes, RCV
            </h1>
            <p className="mt-1 text-base sm:text-lg font-semibold text-teal-100">
              Restaurar Mensajes Borrados al Instante
            </p>
            <p className="mt-2 text-xs sm:text-sm text-teal-200/90 max-w-xl">
              Gratis · Compras dentro de la app · Diseñado para iPhone. Compatible con iPad y Mac.
            </p>

            {/* Action button */}
            <div className="mt-5 flex items-center justify-center sm:justify-start gap-3">
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/15 hover:bg-white/25 border border-white/30 text-white text-xs sm:text-sm font-semibold backdrop-blur-xs transition-all active:scale-95 shadow-xs cursor-pointer"
              >
                {copiedShare ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>Enlace Copiado</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4" />
                    <span>Compartir</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Ratings & Metadata Bar (Apple App Store style strip) */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-3 sm:py-4">
          <div className="grid grid-cols-3 sm:grid-cols-6 divide-x divide-slate-200 text-center">
            {/* 1. Calificaciones */}
            <div className="px-2 py-1">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                845 Calificaciones
              </p>
              <div className="mt-1 flex items-center justify-center gap-1">
                <span className="text-base sm:text-lg font-bold text-slate-800">4.5</span>
              </div>
              <div className="flex items-center justify-center gap-0.5 text-amber-400 mt-0.5">
                {[1, 2, 3, 4].map((i) => (
                  <Star key={i} className="w-3 h-3 fill-current" />
                ))}
                <Star className="w-3 h-3 text-slate-300 fill-slate-300" />
              </div>
            </div>

            {/* 2. Edad */}
            <div className="px-2 py-1">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Clasificación
              </p>
              <p className="mt-1 text-base sm:text-lg font-bold text-slate-800">4+</p>
              <p className="text-[11px] text-slate-500">Años</p>
            </div>

            {/* 3. Lugar */}
            <div className="px-2 py-1">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Lugar
              </p>
              <p className="mt-1 text-base sm:text-lg font-bold text-slate-800">#124</p>
              <p className="text-[11px] text-slate-500">Utilidades</p>
            </div>

            {/* 4. Desarrollador */}
            <div className="px-2 py-1">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Desarrollador
              </p>
              <div className="mt-1 flex justify-center">
                <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                  <User className="w-3.5 h-3.5" />
                </div>
              </div>
              <p className="text-[11px] font-medium text-slate-700 truncate mt-0.5">Kryon Softworks</p>
            </div>

            {/* 5. Idioma */}
            <div className="px-2 py-1">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Idioma
              </p>
              <p className="mt-1 text-base sm:text-lg font-bold text-slate-800">ES</p>
              <p className="text-[11px] text-slate-500">y 12 más</p>
            </div>

            {/* 6. Tamaño */}
            <div className="px-2 py-1">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Tamaño
              </p>
              <p className="mt-1 text-base sm:text-lg font-bold text-slate-800">64.2</p>
              <p className="text-[11px] text-slate-500">MB</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
