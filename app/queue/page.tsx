'use client';

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

type Event = {
  id: string;
  name: string;
  type: string;
  slug: string;
};

type Request = {
  id: string;
  songTitle: string;
  artist: string;
  status: string;
  createdAt: string;
};

type EventWithQueue = Event & {
  queue: Request[];
};

export default function LiveQueuePage() {
  const [events, setEvents] = useState<EventWithQueue[]>([]);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // 1️⃣ Cargar eventos
    fetch('http://localhost:3000/events')
      .then((res) => res.json())
      .then(async (eventsData: Event[]) => {
        // 2️⃣ Cargar cola de cada evento
        const eventsWithQueues = await Promise.all(
          eventsData.map(async (event) => {
            const res = await fetch(
              `http://localhost:3000/requests/${event.id}`
            );
            const queue = await res.json();
            return { ...event, queue };
          })
        );

        setEvents(eventsWithQueues);
        setLoading(false);

        // 3️⃣ Conectar socket y unirse a todas las rooms
        const s = io('http://localhost:3000');
        setSocket(s);

        s.on('connect', () => {
          console.log('🟢 Socket conectado');
          eventsData.forEach((event) => {
            s.emit('join', event.id);
          });
        });

        // 4️⃣ Escuchar actualizaciones
        eventsData.forEach((event) => {
          s.on('queue:update', (newQueue: Request[]) => {
            setEvents((prev) =>
              prev.map((e) =>
                e.id === event.id ? { ...e, queue: newQueue } : e
              )
            );
          });
        });

        return () => {
          s.disconnect();
        };
      });
  }, []);

  async function updateStatus(
    requestId: string,
    status: 'accepted' | 'rejected' | 'played'
  ) {
    await fetch(`http://localhost:3000/requests/${requestId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
  }

  async function deleteEvent(id: string, name: string) {
    if (!confirm(`¿Seguro que quieres borrar el evento "${name}"?`)) {
      return;
    }

    try {
      await fetch(`http://localhost:3000/events/${id}`, {
        method: 'DELETE',
      });
      
      setEvents(events.filter((e) => e.id !== id));
    } catch (error) {
      alert('Error al borrar el evento');
    }
  }

  return (
    <main className="min-h-screen bg-neutral-900 text-neutral-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">
          🎵 Colas en tiempo real
        </h1>
        <p className="text-neutral-400 mb-8">
          Monitoriza todas las peticiones de tus eventos activos
        </p>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="text-neutral-400 text-lg">
              Cargando eventos...
            </div>
          </div>
        )}

        {!loading && events.length === 0 && (
          <div className="text-center py-12">
            <p className="text-neutral-400 text-lg">
              No hay eventos activos
            </p>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-neutral-800 border border-neutral-700 rounded-xl p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-xl font-bold">{event.name}</h2>
                    <div className="bg-brand-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {event.queue.length} en cola
                    </div>
                  </div>
                  <p className="text-sm text-neutral-400">{event.type}</p>
                </div>
                <button
                  onClick={() => deleteEvent(event.id, event.name)}
                  className="rounded-lg bg-red-600 hover:bg-red-700 transition px-3 py-1.5 text-xs font-semibold text-white"
                  title="Borrar evento"
                >
                  🗑️
                </button>
              </div>

              {event.queue.length === 0 ? (
                <p className="text-center text-neutral-500 py-8 text-sm">
                  No hay peticiones
                </p>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {event.queue.map((req) => (
                    <div
                      key={req.id}
                      className="bg-neutral-900 border border-neutral-700 rounded-lg p-3"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <div className="font-semibold text-sm">
                            {req.songTitle}
                          </div>
                          <div className="text-xs text-neutral-400">
                            {req.artist}
                          </div>
                        </div>
                        <div className="flex gap-1">
                          {req.status === 'pending' && (
                            <>
                              <button
                                onClick={() =>
                                  updateStatus(req.id, 'accepted')
                                }
                                className="px-2 py-1 bg-green-600 hover:bg-green-700 transition rounded text-xs font-semibold"
                                title="Aceptar"
                              >
                                ✓
                              </button>
                              <button
                                onClick={() =>
                                  updateStatus(req.id, 'rejected')
                                }
                                className="px-2 py-1 bg-red-600 hover:bg-red-700 transition rounded text-xs font-semibold"
                                title="Rechazar"
                              >
                                ✕
                              </button>
                            </>
                          )}
                          {req.status === 'accepted' && (
                            <button
                              onClick={() => updateStatus(req.id, 'played')}
                              className="px-2 py-1 bg-blue-600 hover:bg-blue-700 transition rounded text-xs font-semibold"
                              title="Marcar como reproducida"
                            >
                              ▶
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            req.status === 'pending'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : req.status === 'accepted'
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-neutral-700 text-neutral-400'
                          }`}
                        >
                          {req.status === 'pending'
                            ? '⏳ Pendiente'
                            : req.status === 'accepted'
                            ? '✓ Aceptada'
                            : '✕ Rechazada'}
                        </span>
                        <span className="text-xs text-neutral-500">
                          {new Date(req.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-neutral-700">
                <a
                  href={`/events/${event.id}`}
                  className="text-sm text-brand-500 hover:text-brand-400 transition"
                >
                  Ver detalles del evento →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
