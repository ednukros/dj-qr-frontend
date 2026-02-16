'use client';

import { useEffect, useState, use } from 'react';
import { io, Socket } from 'socket.io-client';

type Request = {
  id: string;
  songTitle: string;
  artist: string;
  status: string;
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
        {queue.map((req) => (
          <div
            key={req.id}
            className="bg-neutral-800 border border-neutral-700 rounded-xl p-4 flex justify-between"
          >
            <div>
              <div className="font-semibold">
                {req.songTitle}
              </div>
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
        ))}
      </div>
    </main>
  );
}
