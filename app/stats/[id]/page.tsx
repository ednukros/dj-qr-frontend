'use client';

import { use } from 'react';
import AdminStats from '../../components/AdminStats';
import Link from 'next/link';

export default function EventStatsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <main className="min-h-screen bg-neutral-900 text-neutral-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">📊 Estadísticas del Evento</h1>
          <Link
            href={`/events/${id}`}
            className="bg-neutral-800 hover:bg-neutral-700 px-4 py-2 rounded-lg transition"
          >
            ← Volver a la cola
          </Link>
        </div>

        <AdminStats eventId={id} />
      </div>
    </main>
  );
}
