import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, MessageSquare, Image, ShieldCheck, CheckCircle2 } from 'lucide-react';
import chatPreviewImg from '../assets/images/wamr_preview_chat_1790669999074.jpg';
import mediaPreviewImg from '../assets/images/wamr_preview_media_1790670021228.jpg';

export const ScreenshotCarousel: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-end mb-3">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => scroll('left')}
            className="p-1.5 rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 shadow-xs transition-colors"
            aria-label="Anterior captura"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-1.5 rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 shadow-xs transition-colors"
            aria-label="Siguiente captura"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Carousel container */}
      <div
        ref={scrollRef}
        className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-slate-200"
      >
        {/* Card 1: Main Chat Recovery Screenshot */}
        <div className="snap-start shrink-0 w-64 sm:w-72 rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 shadow-lg relative group">
          <div className="aspect-[9/16] relative overflow-hidden bg-slate-950">
            <img
              src={chatPreviewImg}
              alt="WAMR Recuperar Mensajes Chat"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {/* Overlay badge */}
            <div className="absolute top-3 left-3 right-3 bg-teal-900/80 backdrop-blur-md border border-teal-500/30 p-2.5 rounded-xl text-white text-center">
              <p className="text-[11px] font-extrabold uppercase tracking-wide text-teal-300">WAMR</p>
              <p className="text-xs font-semibold">Recuperar Mensajes Borrados</p>
            </div>
          </div>
        </div>

        {/* Card 2: Interactive Mockup Card matching Captura 2382/2383 */}
        <div className="snap-start shrink-0 w-64 sm:w-72 rounded-2xl overflow-hidden border border-slate-200 bg-gradient-to-b from-teal-700 via-teal-800 to-emerald-900 p-4 shadow-lg text-white flex flex-col justify-between aspect-[9/16]">
          <div className="text-center pt-2">
            <span className="text-[11px] uppercase tracking-widest font-extrabold text-teal-300">
              WAMR
            </span>
            <h3 className="text-lg font-black leading-tight mt-1">
              100,000+
            </h3>
            <p className="text-xs text-teal-100 font-medium">
              Usuarias felices
            </p>
            <div className="flex justify-center gap-1 text-amber-300 my-2">
              {'★★★★★'.split('').map((s, i) => (
                <span key={i} className="text-xs">{s}</span>
              ))}
            </div>
            <p className="text-[10px] text-teal-200">Calificaciones de 5 estrellas</p>
          </div>

          {/* Smartphone mockup illustration */}
          <div className="bg-slate-900/90 rounded-2xl p-3 border border-white/20 shadow-xl space-y-2 my-auto">
            <div className="flex items-center gap-2 border-b border-white/10 pb-1.5">
              <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-[9px] font-bold">
                ✓
              </div>
              <span className="text-xs font-medium">Sophie Watson</span>
            </div>

            <div className="space-y-1.5 text-[11px]">
              <div className="bg-white/10 p-2 rounded-lg text-slate-300 flex items-center gap-1.5">
                <span className="text-xs">🚫</span>
                <span className="italic line-through">This message was deleted</span>
              </div>
              <div className="bg-emerald-600/90 p-2 rounded-lg text-white font-medium shadow-xs">
                <p className="text-[9px] text-emerald-200 font-bold">Recuperado por WAMR:</p>
                <p>"Hello! I was waiting for you from last 10 minutes..."</p>
              </div>
            </div>
          </div>

          <div className="text-center pb-2">
            <span className="inline-flex items-center gap-1 text-xs text-teal-200 bg-white/10 px-3 py-1 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Notificación instantánea
            </span>
          </div>
        </div>

        {/* Card 3: Media Recovery Preview Image */}
        <div className="snap-start shrink-0 w-64 sm:w-72 rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 shadow-lg relative group">
          <div className="aspect-[9/16] relative overflow-hidden bg-slate-950">
            <img
              src={mediaPreviewImg}
              alt="WAMR Recuperar Fotos y Videos"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-3 left-3 right-3 bg-teal-900/80 backdrop-blur-md border border-teal-500/30 p-2.5 rounded-xl text-white text-center">
              <p className="text-[11px] font-extrabold uppercase tracking-wide text-teal-300">MULTIMEDIA</p>
              <p className="text-xs font-semibold">Fotos, Videos y Audios</p>
            </div>
          </div>
        </div>

        {/* Card 4: Feature Summary Card */}
        <div className="snap-start shrink-0 w-64 sm:w-72 rounded-2xl overflow-hidden border border-slate-200 bg-gradient-to-b from-slate-900 via-slate-800 to-teal-950 p-5 shadow-lg text-white flex flex-col justify-between aspect-[9/16]">
          <div>
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center mb-3 border border-teal-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white leading-tight">
              Recuperación Automática de Mensajes
            </h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Detecta mensajes eliminados a través del historial de notificaciones y los guarda de forma segura en tu dispositivo.
            </p>
          </div>

          <div className="space-y-2.5 py-4 border-y border-white/10">
            <div className="flex items-center gap-2.5 text-xs text-slate-200">
              <div className="w-6 h-6 rounded-lg bg-teal-500/20 flex items-center justify-center text-teal-300 shrink-0">
                <MessageSquare className="w-3.5 h-3.5" />
              </div>
              <span>Recupera textos eliminados</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-200">
              <div className="w-6 h-6 rounded-lg bg-teal-500/20 flex items-center justify-center text-teal-300 shrink-0">
                <Image className="w-3.5 h-3.5" />
              </div>
              <span>Restaura archivos adjuntos</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-200">
              <div className="w-6 h-6 rounded-lg bg-teal-500/20 flex items-center justify-center text-teal-300 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <span>Sin límite de almacenamiento</span>
            </div>
          </div>

          <div className="text-center">
            <p className="text-[11px] text-teal-400 font-semibold">
              Compatible con iOS 14.0 o superior
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
