'use client';

import { useEffect, useState } from 'react';

type Stats = {
  eventId: string;
  eventName: string;
  totalRequests: number;
  totalSongs: number;
  topSong: {
    title: string;
    artist: string;
    requestCount: number;
  } | null;
  top5Songs: Array<{
    id: string;
    title: string;
    artist: string;
    requestCount: number;
    status: string;
  }>;
  statusBreakdown: {
    approved: number;
    rejected: number;
    pending: number;
    played: number;
  };
  approvalRate: string;
};

interface AdminStatsProps {
  eventId: string;
}

export default function AdminStats({ eventId }: AdminStatsProps) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, [eventId]);

  async function loadStats() {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/admin/stats/${eventId}`, {
        headers: {
          'x-admin-token': process.env.NEXT_PUBLIC_ADMIN_TOKEN || 'dev-admin-token',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to load stats');
      }

      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError('Error al cargar estadísticas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-neutral-400">Cargando estadísticas...</div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="bg-red-500/10 border border-red-500 rounded-xl p-4 text-red-400">
        {error || 'No se pudieron cargar las estadísticas'}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-500 to-pink-600 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">{stats.eventName}</h2>
        <p className="text-sm opacity-90">Estadísticas del evento</p>
      </div>

      {/* Resumen general */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-4">
          <div className="text-3xl font-bold text-brand-500">{stats.totalRequests}</div>
          <div className="text-sm text-neutral-400 mt-1">Total Peticiones</div>
        </div>
        <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-4">
          <div className="text-3xl font-bold text-blue-500">{stats.totalSongs}</div>
          <div className="text-sm text-neutral-400 mt-1">Canciones Únicas</div>
        </div>
        <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-4">
          <div className="text-3xl font-bold text-green-500">{stats.approvalRate}</div>
          <div className="text-sm text-neutral-400 mt-1">Tasa Aprobación</div>
        </div>
        <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-4">
          <div className="text-3xl font-bold text-purple-500">{stats.statusBreakdown.played}</div>
          <div className="text-sm text-neutral-400 mt-1">Reproducidas</div>
        </div>
      </div>

      {/* Canción más solicitada */}
      {stats.topSong && (
        <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            🏆 Canción más solicitada
          </h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-orange-500 text-2xl font-bold">
              🔥 {stats.topSong.requestCount}
            </div>
            <div>
              <div className="font-semibold text-lg">{stats.topSong.title}</div>
              <div className="text-sm text-neutral-400">{stats.topSong.artist}</div>
            </div>
          </div>
        </div>
      )}

      {/* Top 5 */}
      <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6">
        <h3 className="text-lg font-bold mb-4">📊 Top 5 Canciones</h3>
        <div className="space-y-3">
          {stats.top5Songs.map((song, index) => (
            <div
              key={song.id}
              className="flex items-center justify-between p-3 bg-neutral-900 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="text-2xl font-bold text-neutral-600 w-8">
                  #{index + 1}
                </div>
                <div>
                  <div className="font-semibold">{song.title}</div>
                  <div className="text-sm text-neutral-400">{song.artist}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-orange-500 font-bold">
                  🔥 {song.requestCount}
                </span>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    song.status === 'accepted'
                      ? 'bg-green-500/20 text-green-400'
                      : song.status === 'rejected'
                      ? 'bg-red-500/20 text-red-400'
                      : song.status === 'played'
                      ? 'bg-purple-500/20 text-purple-400'
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}
                >
                  {song.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desglose por estado */}
      <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6">
        <h3 className="text-lg font-bold mb-4">📈 Desglose por Estado</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-3 bg-yellow-500/10 rounded-lg">
            <span className="text-yellow-400">⏳ Pendientes</span>
            <span className="font-bold text-yellow-400">{stats.statusBreakdown.pending}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg">
            <span className="text-green-400">✓ Aprobadas</span>
            <span className="font-bold text-green-400">{stats.statusBreakdown.approved}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-red-500/10 rounded-lg">
            <span className="text-red-400">✕ Rechazadas</span>
            <span className="font-bold text-red-400">{stats.statusBreakdown.rejected}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-purple-500/10 rounded-lg">
            <span className="text-purple-400">▶ Reproducidas</span>
            <span className="font-bold text-purple-400">{stats.statusBreakdown.played}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
