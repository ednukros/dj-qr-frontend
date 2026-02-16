'use client';

import { useState } from 'react';

export default function CreateEventPage() {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [event, setEvent] = useState<any>(null);

  async function createEvent() {
    const res = await fetch('http://localhost:3000/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        type,
        genres: [],
      }),
    });

    const data = await res.json();
    setEvent(data);
  }

  return (
    <main className="min-h-screen bg-neutral-900 text-neutral-100 flex justify-center">
      <div className="w-full max-w-md p-6">
        <h1 className="text-2xl font-bold mb-6">
          Crear evento
        </h1>

        {!event && (
          <div className="space-y-4">
            <input
              className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-4 py-3 text-white placeholder-neutral-400 focus:outline-none focus:border-brand-500"
              placeholder="Nombre del evento"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-4 py-3 text-white placeholder-neutral-400 focus:outline-none focus:border-brand-500"
              placeholder="Tipo (boda, sala, verbena...)"
              value={type}
              onChange={(e) => setType(e.target.value)}
            />

            <button
              onClick={createEvent}
              className="w-full rounded-xl bg-brand-500 hover:bg-brand-600 transition px-6 py-4 text-lg font-semibold text-white"
            >
              Crear evento
            </button>
          </div>
        )}

        {event && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">
              {event.name}
            </h2>

            <div className="bg-neutral-100 p-4 rounded-xl">
              <img
                src={`http://localhost:3000/events/${event.id}/qr.png`}
                alt="QR del evento"
                className="mx-auto w-64"
              />
            </div>

            <a
              href={`http://localhost:3000/events/${event.id}/qr.png`}
              download
              className="block text-center rounded-xl bg-neutral-800 hover:bg-neutral-700 transition px-6 py-3 font-semibold"
            >
              Descargar QR
            </a>

            <button
              onClick={() => window.print()}
              className="w-full rounded-xl bg-neutral-800 hover:bg-neutral-700 transition px-6 py-3 font-semibold"
            >
              Imprimir
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
