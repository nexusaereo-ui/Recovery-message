import React from 'react';
import { ExternalLink, ChevronRight, Download, QrCode } from 'lucide-react';

export const TechnicalSpecs: React.FC = () => {
  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-10 border-t border-slate-200">
      {/* Accesibilidad */}
      <div>
        <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-2">
          Accesibilidad
        </h3>
        <p className="text-sm text-slate-600">
          El desarrollador aún no ha indicado cuáles funciones de accesibilidad admite esta app.{' '}
          <span className="text-blue-600 hover:underline cursor-pointer font-medium">
            Obtén detalles
          </span>
        </p>
      </div>

      {/* Ficha técnica */}
      <div>
        <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-4">
          Ficha técnica
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-8 text-sm">
          <div>
            <p className="text-xs text-slate-500 font-medium">Vendedor</p>
            <p className="text-slate-900 font-semibold mt-0.5">Vivek Warde</p>
          </div>

          <div>
            <p className="text-xs text-slate-500 font-medium">Tamaño</p>
            <p className="text-slate-900 font-semibold mt-0.5">67.3 MB</p>
          </div>

          <div>
            <p className="text-xs text-slate-500 font-medium">Categoría</p>
            <p className="text-slate-900 font-semibold mt-0.5">Utilidades</p>
          </div>

          <div>
            <p className="text-xs text-slate-500 font-medium">Compatibilidad</p>
            <p className="text-slate-900 font-semibold mt-0.5">
              Requiere iOS 14.0 o posterior ▾
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500 font-medium">Idiomas</p>
            <p className="text-slate-900 font-semibold mt-0.5">
              Español y 11 más ▾
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500 font-medium">Edad</p>
            <p className="text-slate-900 font-semibold mt-0.5">
              4+ ▾
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500 font-medium">Compras dentro de la app</p>
            <p className="text-slate-900 font-semibold mt-0.5">
              Sí ▾
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500 font-medium">Copyright</p>
            <p className="text-slate-900 font-semibold mt-0.5">
              © 2026 Vivek Warde
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-blue-600 font-medium">
          <span className="flex items-center gap-1 hover:underline cursor-pointer">
            Sitio web del desarrollador <ExternalLink className="w-3.5 h-3.5" />
          </span>
          <span className="flex items-center gap-1 hover:underline cursor-pointer">
            Política de privacidad <ExternalLink className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>

      {/* Más de Vivek Warde */}
      <div>
        <div className="flex items-center gap-1 mb-4 cursor-pointer group">
          <h3 className="text-xl font-bold text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">
            Más de Vivek Warde
          </h3>
          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* App 1 */}
          <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md">
                <Download className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Guardador de Estado: Descargar
                </h4>
                <p className="text-xs text-slate-500">
                  Descargar Status Saver...
                </p>
              </div>
            </div>
            <button className="px-4 py-1 rounded-full bg-slate-200 hover:bg-slate-300 text-blue-600 font-bold text-xs uppercase tracking-wider transition-colors">
              Ver
            </button>
          </div>

          {/* App 2 */}
          <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-900 flex items-center justify-center text-white shadow-md">
                <QrCode className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  WT Scan: Escaneo Web, Hub Dual
                </h4>
                <p className="text-xs text-slate-500">
                  Múltiples cuentas: Escán...
                </p>
              </div>
            </div>
            <button className="px-4 py-1 rounded-full bg-slate-200 hover:bg-slate-300 text-blue-600 font-bold text-xs uppercase tracking-wider transition-colors">
              Ver
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
