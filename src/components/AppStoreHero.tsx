import React, { useState } from 'react';
import { Share2, Star, User, Check } from 'lucide-react';
import appIconImg from '../assets/images/wamr_app_icon_1790669983232.jpg';

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
          {/* App Icon */}
          <div className="w-28 h-28 sm:w-36 sm:h-36 shrink-0 rounded-3xl overflow-hidden shadow-2xl border-2 border-white/20 bg-teal-800">
            <img
              src={appIconImg}
              alt="WAMR App Icon"
              className="w-full h-full object-cover"
            />
          </div>

          {/* App Title & Details */}
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white drop-shadow-xs">
              WAMR: Recuperar Mensajes, WMR
            </h1>
            <p className="mt-1 text-base sm:text-lg font-semibold text-teal-100">
              Recuperar Mensajes Borrados
            </p>
            <p className="mt-2 text-xs sm:text-sm text-teal-200/90 max-w-xl">
              Gratis · Compras dentro de la app · Diseñado para iPad. No verificado para macOS.
            </p>

            {/* Action button */}
            <div className="mt-5 flex items-center justify-center sm:justify-start gap-3">
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/15 hover:bg-white/25 border border-white/30 text-white text-xs sm:text-sm font-semibold backdrop-blur-xs transition-all active:scale-95 shadow-xs"
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
                721 Calificaciones
              </p>
              <div className="mt-1 flex items-center justify-center gap-1">
                <span className="text-base sm:text-lg font-bold text-slate-800">4.3</span>
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
              <p className="mt-1 text-base sm:text-lg font-bold text-slate-800">#169</p>
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
              <p className="text-[11px] font-medium text-slate-700 truncate mt-0.5">Vivek Warde</p>
            </div>

            {/* 5. Idioma */}
            <div className="px-2 py-1">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Idioma
              </p>
              <p className="mt-1 text-base sm:text-lg font-bold text-slate-800">ES</p>
              <p className="text-[11px] text-slate-500">y 11 más</p>
            </div>

            {/* 6. Tamaño */}
            <div className="px-2 py-1">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Tamaño
              </p>
              <p className="mt-1 text-base sm:text-lg font-bold text-slate-800">67.3</p>
              <p className="text-[11px] text-slate-500">MB</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
