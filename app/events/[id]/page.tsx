'use client';

import { useEffect, useState, use } from 'react';
import { io, Socket } from 'socket.io-client';
import { getRequestBadge } from '../../utils/badges';

type Request = {
  id: string;
  trackId: string;
  songTitle: string;
  artist: string;
  cover: string;
  requestCount: number;
  status: string;
  createdAt: string;
};

export default function DjQueuePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [queue, setQueue] = useState<Request[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!id) return; // 🔴 CLAVE ABSOLUTA

    // 1️⃣ Cargar cola inicial
    fetch(`http://localhost:3000/requests/${id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log('🟢 Cola inicial cargada', data);
        setQueue(data);
      });

    // 2️⃣ Crear socket
    const s = io('http://localhost:3000');
    setSocket(s);

    s.on('connect', () => {
      console.log('🟢 Socket conectado', s.id);
    });

    // 3️⃣ Unirse a la room correcta
    console.log('🟡 Emit join con eventId:', id);
    s.emit('join', id);

    // 4️⃣ Escuchar actualizaciones en tiempo real
    s.on('queue:update', (data: Request[]) => {
      console.log('🟢 queue:update recibido', data);
      setQueue(data);
    });

    return () => {
      s.disconnect();
    };
  }, [id]);

  async function updateStatus(
    requestId: string,
    status: 'accepted' | 'rejected' | 'played',
  ) {
    await fetch(`http://localhost:3000/requests/${requestId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
  }

  return (
    <main className="min-h-screen bg-neutral-900 text-neutral-100 p-6">
      <h1 className="text-2xl font-bold mb-6">
        Cola de peticiones
      </h1>

      {queue.length === 0 && (
        <p className="text-neutral-400">
          No hay peticiones aún
        </p>
      )}

      <div className="space-y-3">
        {queue.map((req) => {
          const badge = getRequestBadge(req.requestCount);
          return (
          <div
            key={req.id}
            className="bg-neutral-800 border border-neutral-700 rounded-xl p-4 flex justify-between"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <div className="font-semibold">
                  {req.songTitle}
                </div>
                {req.requestCount > 1 && (
                  <span className="bg-brand-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                    ×{req.requestCount}
                  </span>
                )}
              </div>
              {badge && (
                <div className="mb-2">
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold ${badge.className}`}>
                    {badge.text}
                  </span>
                </div>
              )}
              <div className="text-sm text-neutral-400">
                {req.artist}
              </div>
            </div>

            <div className="flex gap-2">
              {req.status === 'pending' && (
                <>
                  <button
                    onClick={() =>
                      updateStatus(req.id, 'accepted')
                    }
                    className="bg-brand-500 hover:bg-brand-600 px-3 py-2 rounded-lg"
                  >
                    ✓
                  </button>
                  <button
                    onClick={() =>
                      updateStatus(req.id, 'rejected')
                    }
                    className="bg-neutral-700 hover:bg-neutral-600 px-3 py-2 rounded-lg"
                  >
                    ✕
                  </button>
                </>
              )}

              {req.status === 'accepted' && (
                <button
                  onClick={() =>
                    updateStatus(req.id, 'played')
                  }
                  className="bg-brand-500 hover:bg-brand-600 px-3 py-2 rounded-lg"
                >
                  ▶
                </button>
              )}
            </div>
          </div>
        );
        })}
      </div>
    </main>
  );
}
