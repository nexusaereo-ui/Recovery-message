import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorMessage: '',
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error?.message || 'Error inesperado' };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F5F5F7] flex flex-col items-center justify-center p-6 text-center text-slate-800">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md max-w-md w-full">
            <h2 className="text-lg font-bold text-slate-900 mb-2">Cargando aplicación...</h2>
            <p className="text-xs text-slate-500 mb-4">
              Se ha detectado un ajuste en la sesión móvil. Presiona para continuar.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, errorMessage: '' });
                window.location.reload();
              }}
              className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-medium text-xs shadow-sm transition-all"
            >
              Reintentar Carga
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
