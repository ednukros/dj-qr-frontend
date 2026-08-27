'use client';

import { useEffect, useState, use } from 'react';
import { io, Socket } from 'socket.io-client';
import { getRequestBadge } from '../../utils/badges';
import Link from 'next/link';

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
    action: 'approve' | 'reject' | 'played',
  ) {
    try {
      const response = await fetch(
        `http://localhost:3000/admin/request/${requestId}/${action}`,
        {
          method: 'PATCH',
          headers: {
            'x-admin-token': process.env.NEXT_PUBLIC_ADMIN_TOKEN || 'dev-admin-token',
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        alert(error.message || 'Error al actualizar el estado');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error al actualizar el estado');
    }
  }

  return (
    <main className="min-h-screen bg-neutral-900 text-neutral-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">
          Cola de peticiones
        </h1>
        <Link
          href={`/stats/${id}`}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-4 py-2 rounded-lg transition font-semibold text-sm"
        >
          📊 Ver Estadísticas
        </Link>
      </div>

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
                  <span className="flex items-center gap-1 text-orange-500 text-sm font-bold">
                    🔥
                    {req.requestCount}
                  </span>
                )}
              </div>
             
              <div className="text-sm text-neutral-400">
                {req.artist}
              </div>
               {badge && (
                <div className="mb-2">
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold ${badge.className}`}>
                    {badge.text}
                  </span>
                </div>
              )}
            </div>

            <div className="">
              {req.status === 'pending' && (
                <div className='flex flex-col gap-2'>
                  <button
                    onClick={() =>
                      updateStatus(req.id, 'approve')
                    }
                    className="bg-green-600 hover:bg-green-700 px-3 py-2 rounded-lg transition"
                    title="Aprobar"
                  >
                    ✓
                  </button>
                  <button
                    onClick={() =>
                      updateStatus(req.id, 'reject')
                    }
                    className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg transition"
                    title="Rechazar"
                  >
                    ✕
                  </button>
                </div>
              )}

              {req.status === 'accepted' && (
                <button
                  onClick={() =>
                    updateStatus(req.id, 'played')
                  }
                  className="bg-purple-600 hover:bg-purple-700 px-3 py-2 rounded-lg transition"
                  title="Marcar como reproducida"
                >
                  ▶
                </button>
              )}

              {req.status === 'played' && (
                <span className="text-purple-400 text-sm">
                  ✓ Reproducida
                </span>
              )}

              {req.status === 'rejected' && (
                <span className="text-red-400 text-sm">
                  ✕ Rechazada
                </span>
              )}
            </div>
          </div>
        );
        })}
      </div>
    </main>
  );
}
