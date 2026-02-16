'use client';

import { useEffect, useState } from 'react';

type Event = {
  id: string;
  name: string;
  type: string;
  slug: string;
  createdAt: string;
};

export default function DjEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3000/events')
      .then((res) => res.json())
      .then((data) => {
        setEvents(data);
        setLoading(false);
      });
  }, []);

  return (
    <main className="min-h-screen bg-neutral-900 text-neutral-100 p-6">
      <h1 className="text-2xl font-bold mb-6">Mis eventos</h1>

      {loading && (
        <p className="text-neutral-400">Cargando eventos…</p>
      )}

      {!loading && events.length === 0 && (
        <p className="text-neutral-400">
          Aún no has creado ningún evento.
        </p>
      )}

      <div className="space-y-4">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-neutral-800 border border-neutral-700 rounded-xl p-4 flex items-center justify-between"
          >
            <div>
              <h2 className="text-lg font-semibold">
                {event.name}
              </h2>
              <p className="text-neutral-400 text-sm">
                {event.type}
              </p>
            </div>

            <div className="flex gap-2">
              <a
                href={`http://localhost:3000/events/${event.id}/qr.png`}
                download
                className="rounded-lg bg-neutral-700 hover:bg-neutral-600 transition px-4 py-2 text-sm font-semibold"
              >
                QR
              </a>

              <a
                href={`/e/${event.slug}`}
                target="_blank"
                className="rounded-lg bg-brand-500 hover:bg-brand-600 transition px-4 py-2 text-sm font-semibold text-white"
              >
                Abrir
              </a>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
