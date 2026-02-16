'use client';

import Link from 'next/link';

export default function DjHomePage() {
  return (
    <main className="min-h-screen bg-neutral-900 text-neutral-100 flex justify-center">
      <div className="w-full max-w-md p-6">
        <h1 className="text-3xl font-bold mb-2">
          Panel del DJ
        </h1>

        <p className="text-neutral-400 mb-8">
          Gestiona tus eventos y la interacción del público
        </p>

        <div className="space-y-4">
          <Link href="/dj/create">
            <button className="w-full rounded-xl bg-brand-500 hover:bg-brand-600 transition px-6 py-4 text-lg font-semibold text-white">
              🎉 Crear evento
            </button>
          </Link>

          <Link href="/dj/events">
            <button className="w-full rounded-xl bg-neutral-800 hover:bg-neutral-700 transition px-6 py-4 text-lg font-semibold">
              📋 Ver eventos
            </button>
          </Link>

          <Link href="/dj/stats">
            <button className="w-full rounded-xl bg-neutral-800 hover:bg-neutral-700 transition px-6 py-4 text-lg font-semibold">
              📊 Estadísticas
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
