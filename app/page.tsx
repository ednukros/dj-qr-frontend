'use client';

import Link from 'next/link';

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-800 text-neutral-100 flex items-center justify-center p-3 md:p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-3 md:mb-4">
          <p className="text-neutral-400 text-sm md:text-base">
            Gestiona tus eventos y la interacción del público en tiempo real
          </p>
        </div>

        {/* Grid de Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {/* Crear Evento - Card destacada */}
          <Link href="/create" className="group md:col-span-2">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-500 to-pink-600 p-4 md:p-6 shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-brand-500/50">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150"></div>
              <div className="relative flex items-center justify-between">
                <div>
                  <div className="text-3xl md:text-4xl mb-2">🎉</div>
                  <h2 className="text-xl md:text-2xl font-bold text-white mb-1">
                    Crear evento
                  </h2>
                  <p className="text-white/80">
                    Inicia un nuevo evento y genera su código QR
                  </p>
                </div>
                <div className="text-white/30 group-hover:text-white/50 transition-colors">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>

          {/* Ver Eventos */}
          <Link href="/events" className="group">
            <div className="relative overflow-hidden rounded-2xl bg-neutral-800 border border-neutral-700 p-4 md:p-5 shadow-xl transition-all duration-300 hover:scale-[1.02] hover:border-brand-500 hover:shadow-xl hover:shadow-brand-500/20">
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-500/5 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-150"></div>
              <div className="relative">
                <div className="text-3xl md:text-4xl mb-2 md:mb-3">📋</div>
                <h2 className="text-lg md:text-xl font-bold mb-1 md:mb-2">Ver eventos</h2>
                <p className="text-neutral-400 text-sm">
                  Lista de todos tus eventos activos e históricos
                </p>
              </div>
            </div>
          </Link>

          {/* Colas en tiempo real */}
          <Link href="/queue" className="group">
            <div className="relative overflow-hidden rounded-2xl bg-neutral-800 border border-neutral-700 p-4 md:p-5 shadow-xl transition-all duration-300 hover:scale-[1.02] hover:border-green-500 hover:shadow-xl hover:shadow-green-500/20">
              <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-150"></div>
              <div className="relative">
                <div className="flex items-center gap-2 mb-2 md:mb-3">
                  <div className="text-3xl md:text-4xl">🎵</div>
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
                </div>
                <h2 className="text-lg md:text-xl font-bold mb-1 md:mb-2">Colas en tiempo real</h2>
                <p className="text-neutral-400 text-sm">
                  Monitoriza todas las peticiones activas
                </p>
              </div>
            </div>
          </Link>

          {/* Estadísticas */}
          <Link href="/stats" className="group md:col-span-2">
            <div className="relative overflow-hidden rounded-2xl bg-neutral-800 border border-neutral-700 p-4 md:p-5 shadow-xl transition-all duration-300 hover:scale-[1.02] hover:border-purple-500 hover:shadow-xl hover:shadow-purple-500/20">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150"></div>
              <div className="relative flex items-center justify-between">
                <div>
                  <div className="text-3xl md:text-4xl mb-2">📊</div>
                  <h2 className="text-lg md:text-xl font-bold mb-1 md:mb-2">Estadísticas</h2>
                  <p className="text-neutral-400 text-sm">
                    Análisis y métricas de tus eventos
                  </p>
                </div>
                <div className="text-neutral-700 group-hover:text-purple-500/50 transition-colors">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Footer info */}
        <div className="mt-3 md:mt-4 text-center">
          <p className="text-neutral-500 text-xs md:text-sm">
            Versión 1.0 • DJ QR System
          </p>
        </div>
      </div>
    </main>
  );
}
