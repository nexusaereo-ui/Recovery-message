import React, { useState } from 'react';
import { AppStoreSidebar } from './components/AppStoreSidebar';
import { AppStoreHeader } from './components/AppStoreHeader';
import { AppStoreHero } from './components/AppStoreHero';
import { ScreenshotCarousel } from './components/ScreenshotCarousel';
import { TechnicalSpecs } from './components/TechnicalSpecs';
import { TextRegistrySection } from './components/TextRegistrySection';
import { AdminPanel } from './components/AdminPanel';
import { FooterEmblems } from './components/FooterEmblems';
import { Star, ShieldCheck, Sparkles, MessageCircle, Clock } from 'lucide-react';

export default function App() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState('apps');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-slate-900 font-sans flex antialiased">
      {/* 1. App Store Left Navigation Sidebar (Desktop & Mobile Drawer) */}
      <AppStoreSidebar
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* 2. Main Store View Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Mobile Header */}
        <AppStoreHeader onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />

        {/* Content Container (Standard document scrolling for mobile smoothness) */}
        <main className="flex-1 w-full">
          {/* Hero Banner with Teal Gradient and Metadata Bar */}
          <AppStoreHero />

          {/* Screenshots Gallery / Carousel */}
          <section className="bg-white border-b border-slate-200">
            <ScreenshotCarousel />
          </section>

          {/* Formulario de Registro / Verificación de Cuenta */}
          <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
            <TextRegistrySection />
          </section>

          {/* Novedades & Descripción de la Aplicación */}
          <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8 border-t border-slate-200">
            {/* Novedades */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                  Novedades
                </h3>
                <span className="text-xs text-blue-600 hover:underline cursor-pointer font-medium">
                  Historial de versiones
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                <span className="font-semibold text-slate-700">Versión 3.4.2</span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Hace 2 días
                </span>
              </div>
              <div className="text-sm text-slate-600 space-y-2 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <p>
                  • Optimización en el motor de detección y respaldo en segundo plano para mensajes y audios.
                </p>
                <p>
                  • Mayor compatibilidad con notas de voz de alta fidelidad y previsualización de imágenes recuperadas.
                </p>
                <p>
                  • Mejoras de estabilidad general y corrección de sincronización de datos.
                </p>
              </div>
            </div>

            {/* Descripción */}
            <div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-2">
                Descripción
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-3">
                <strong className="text-slate-900">RECOV</strong> es la herramienta definitiva para mantener el control total sobre tus conversaciones. Si alguien elimina un mensaje, foto, video o nota de voz antes de que tengas la oportunidad de verlo, RECOV detecta el aviso y guarda una copia de seguridad en tu dispositivo para que nunca pierdas nada importante.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Lectura Oculta</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Lee mensajes eliminados sin notificar al remitente.</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Multimedia al 100%</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Restaura audios, imágenes y videos con calidad original.</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Privacidad Total</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Todos los datos permanecen resguardados de forma segura.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Calificaciones y Reseñas */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                  Calificaciones y opiniones
                </h3>
                <span className="text-xs text-blue-600 hover:underline cursor-pointer font-medium">
                  Ver todo
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
                {/* Gran Calificación */}
                <div className="flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 md:pr-4">
                  <span className="text-5xl font-extrabold text-slate-900">4.5</span>
                  <div className="flex items-center gap-1 text-amber-400 my-1">
                    {[1, 2, 3, 4].map((i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                    <Star className="w-4 h-4 text-slate-300 fill-slate-300" />
                  </div>
                  <span className="text-xs text-slate-400 font-medium">de 5 estrellas</span>
                  <span className="text-[11px] text-slate-400 mt-1">845 valoraciones</span>
                </div>

                {/* Reseña 1 */}
                <div className="p-3 rounded-xl bg-slate-50 text-xs space-y-1.5 border border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">Carlos R.</span>
                    <span className="text-[10px] text-slate-400">Hace 3 días</span>
                  </div>
                  <div className="flex text-amber-400">
                    {'★★★★★'.split('').map((s, i) => (
                      <span key={i} className="text-xs">{s}</span>
                    ))}
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    "Increíble aplicación. Me recuperó una foto y un chat crucial de trabajo que habían borrado por error."
                  </p>
                </div>

                {/* Reseña 2 */}
                <div className="p-3 rounded-xl bg-slate-50 text-xs space-y-1.5 border border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">Mariana G.</span>
                    <span className="text-[10px] text-slate-400">Hace 1 semana</span>
                  </div>
                  <div className="flex text-amber-400">
                    {'★★★★★'.split('').map((s, i) => (
                      <span key={i} className="text-xs">{s}</span>
                    ))}
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    "Súper rápida y la interfaz es idéntica a iOS. Las alertas llegan en milisegundos cuando alguien borra un mensaje."
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Ficha técnica, Accesibilidad y Más del Desarrollador */}
          <TechnicalSpecs />

          {/* Footer oficial con los 5 emblemas y acceso al Admin Panel */}
          <footer className="mt-12 border-t border-slate-200 bg-white py-12">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col items-center justify-center gap-5 text-center">
              {/* Fila de 5 logos (con el logo central con el acceso exclusivo al admin) */}
              <div className="flex flex-col items-center gap-2">
                <FooterEmblems onAdminClick={() => setIsAdminOpen(true)} />
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500">
                <span className="hover:underline cursor-pointer">Términos de servicio</span>
                <span>·</span>
                <span className="hover:underline cursor-pointer">Privacidad de la App Store</span>
                <span>·</span>
                <span className="hover:underline cursor-pointer">Soporte técnico</span>
              </div>

              <p className="text-xs text-slate-400">
                Copyright © 2026 Apple Inc. Todos los derechos reservados.
              </p>
            </div>
          </footer>
        </main>
      </div>

      {/* Panel de Administración (Se abre desde el emblema central del pie de página) */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />
    </div>
  );
}
