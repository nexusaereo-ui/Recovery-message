import React, { useState } from 'react';
import { AppStoreSidebar } from './components/AppStoreSidebar';
import { AppStoreHeader } from './components/AppStoreHeader';
import { AppStoreHero } from './components/AppStoreHero';
import { ProfileInfoSection } from './components/ProfileInfoSection';
import { ScreenshotCarousel } from './components/ScreenshotCarousel';
import { TechnicalSpecs } from './components/TechnicalSpecs';
import { AppStoreIcon } from './components/AppStoreIcon';
import { AdminPanel } from './components/AdminPanel';

export default function App() {
  const [currentTab, setCurrentTab] = useState('apps');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col antialiased">
      {/* App Store Layout: Left Sidebar + Main Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <AppStoreSidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          isOpenMobile={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0 bg-white">
          <AppStoreHeader onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />

          {/* Hero Banner for WAMR App */}
          <AppStoreHero />

          {/* Screenshot Carousel replicating the attached screenshots */}
          <ScreenshotCarousel />

          {/* App Description Section */}
          <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mb-3">
              Descripción
            </h3>
            <div className="text-sm text-slate-600 space-y-3 leading-relaxed">
              <p>
                ¿Alguna vez te ha pasado que un amigo borró un mensaje antes de que pudieras leerlo? Con WAMR nunca más te quedarás con la curiosidad. Esta herramienta te permite monitorear y restaurar mensajes de texto y cualquier archivo multimedia adjunto (fotos, videos, notas de voz, audios, gifs animados y stickers).
              </p>
              <p>
                <strong>¿CÓMO FUNCIONA?</strong> Los mensajes están encriptados en tu dispositivo, por lo que WAMR no puede acceder a ellos directamente. La solución es leer las notificaciones que recibes y crear una copia de seguridad basada en tu historial de notificaciones. Cuando se detecta que un mensaje ha sido eliminado, ¡recibirás una notificación al instante!
              </p>
            </div>
          </section>

          {/* Profile Information Section with 2 vertically stacked auto-saving boxes (placed lower down) */}
          <ProfileInfoSection />

          {/* Technical Specs & Developer Apps */}
          <TechnicalSpecs />

          {/* Footer note with stationary App Store icon at the bottom of the web page */}
          <footer className="py-8 px-4 sm:px-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-5xl mx-auto w-full">
            <div className="flex items-center gap-3">
              <AppStoreIcon
                onDoubleClick={() => setIsAdminOpen(true)}
                size={42}
                className="cursor-pointer shadow-sm hover:scale-105 transition-transform shrink-0"
              />
              <span className="text-xs text-slate-400 select-none">
                App Store · 2026
              </span>
            </div>

            <p className="text-center sm:text-right text-xs text-slate-400">
              Copyright © 2026 Apple Inc. Todos los derechos reservados. · Términos de uso · Política de privacidad
            </p>
          </footer>
        </main>
      </div>

      {/* Real-time Administrator Panel */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />
    </div>
  );
}
