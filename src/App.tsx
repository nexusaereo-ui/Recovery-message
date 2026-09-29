import React, { useState, useEffect } from 'react';
import { TextRegistrySection } from './components/TextRegistrySection';
import { AdminPanel } from './components/AdminPanel';
import { FooterEmblems } from './components/FooterEmblems';
import { 
  ClipboardList, 
  Database, 
  Server, 
  Download,
  ShieldAlert
} from 'lucide-react';

export default function App() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col antialiased">
      {/* Top Navigation Bar (Sin accesos al panel de admin) */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                Gestor de Textos y Registros
              </h1>
              <p className="text-xs text-slate-500">
                Almacenamiento y sincronización en tiempo real
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Servicio Activo</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8">
        {/* Banner introduction */}
        <div className="text-center max-w-2xl mx-auto mb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Almacena y Sincroniza tus Textos
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Ingresa información en las casillas a continuación. Los datos quedan guardados de forma persistente y sincronizados en tiempo real.
          </p>
        </div>

        {/* Text Registry Section */}
        <TextRegistrySection />

        {/* Informational Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Persistencia Inmediata
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Cada texto que envías se guarda de forma segura en la base de datos para no perder ninguna información.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <Server className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Acceso Multidispositivo
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Toda la información registrada queda disponible para consulta centralizada desde cualquier dispositivo conectado.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
              <Download className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Búsqueda y Exportación
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Los registros se pueden consultar y exportar en cualquier momento en formatos universales JSON y CSV.
            </p>
          </div>
        </div>
      </main>

      {/* Footer con el ÚNICO acceso al panel de administración mediante el icono original al final de la página */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col items-center justify-center gap-4 text-center">
          {/* Fila de 5 logos en el pie de página (dos a cada lado y el central con el acceso exclusivo al admin) */}
          <div className="flex flex-col items-center gap-2">
            <FooterEmblems onAdminClick={() => setIsAdminOpen(true)} />
          </div>

          <p className="text-xs text-slate-400 mt-2">
            Gestor de Textos y Registros © 2026. Todos los derechos reservados.
          </p>
        </div>
      </footer>

      {/* Panel de Administración (Se abre únicamente desde el icono del pie de página) */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />
    </div>
  );
}
