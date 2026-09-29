import React, { useState, useEffect } from 'react';
import { TextRegistrySection } from './components/TextRegistrySection';
import { AdminPanel } from './components/AdminPanel';
import { 
  ClipboardList, 
  ShieldCheck, 
  Database, 
  CheckCircle, 
  Server, 
  Search, 
  ArrowRight,
  Download
} from 'lucide-react';

export default function App() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [recordCount, setRecordCount] = useState<number>(0);

  // Fetch record count for header badge
  const updateCount = async () => {
    try {
      const res = await fetch('/api/records');
      const data = await res.json();
      if (data && typeof data.count === 'number') {
        setRecordCount(data.count);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    updateCount();
    const interval = setInterval(updateCount, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col antialiased">
      {/* Top Navigation Bar */}
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

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Servidor Activo</span>
            </div>

            <button
              onClick={() => setIsAdminOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-medium shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Panel Admin</span>
              {recordCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full bg-indigo-500 text-white text-[10px] font-bold">
                  {recordCount}
                </span>
              )}
            </button>
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
            Ingresa información en las casillas a continuación. Los datos quedan guardados de forma persistente y pueden ser consultados o exportados desde cualquier dispositivo a través del Panel de Administración.
          </p>
        </div>

        {/* Text Registry Section */}
        <TextRegistrySection
          onOpenAdmin={() => setIsAdminOpen(true)}
          onSyncActivity={() => updateCount()}
        />

        {/* Informational Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Persistencia en Servidor
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
              Accede al Panel de Administración desde cualquier computadora o teléfono móvil para ver los registros actualizados.
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
              Filtra por palabras clave en tiempo real y descarga tus registros completos en formato JSON o CSV.
            </p>
          </div>
        </div>

        {/* Quick Admin Callout */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-base font-bold text-indigo-950">
              ¿Deseas revisar o exportar todos los textos guardados?
            </h4>
            <p className="text-xs text-indigo-800 mt-1">
              Abre el Panel de Administración para consultar el historial completo y detalles de cada registro.
            </p>
          </div>
          <button
            onClick={() => setIsAdminOpen(true)}
            className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs sm:text-sm shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <span>Abrir Panel de Administración</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Gestor de Textos y Registros © 2026</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsAdminOpen(true)}
              className="text-indigo-600 hover:text-indigo-800 font-medium cursor-pointer"
            >
              Acceso Administrador
            </button>
          </div>
        </div>
      </footer>

      {/* Real-time Administrator Panel */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />
    </div>
  );
}
