'use client';

import { useEffect, useState, use } from 'react';

type Song = {
  id: string;
  title: string;
  artist: string;
  image: string | null;
};

export default function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  const [event, setEvent] = useState<any>(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Song[]>([]);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [loading, setLoading] = useState(false);
  const [showFire, setShowFire] = useState(false);

  // Cargar evento
  useEffect(() => {
    fetch(`http://localhost:3000/events/slug/${slug}`)
      .then((res) => res.json())
      .then(setEvent);
  }, [slug]);

  // Buscar canciones (autocomplete)
  useEffect(() => {
    if (!query || !event) {
      setResults([]);
      return;
    }

    setLoading(true);

    fetch(
      `http://localhost:3000/songs/search?q=${encodeURIComponent(
        query,
      )}&eventId=${event.id}`,
    )
      .then((res) => res.json())
      .then((data) => {
        setResults(data);
        setLoading(false);
      });
  }, [query, event]);

  async function requestSong(song: Song) {
    if (!event) return;

    await fetch('http://localhost:3000/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventId: event.id,
        songTitle: song.title,
        artist: song.artist,
      }),
    });

    // 🔥 Activar animación + vibración móvil
    setShowFire(true);
    setQuery('');
    setResults([]);
    setSelectedSong(null);

    // Vibrar en móvil (si está disponible)
    if (navigator.vibrate) {
      navigator.vibrate([50, 30, 50, 30, 100]);
    }

    setTimeout(() => {
      setShowFire(false);
    }, 4000);
  }

  if (!event) {
    return (
      <main className="min-h-screen bg-neutral-900 text-neutral-100 flex items-center justify-center">
        Cargando…
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-900 text-neutral-100 p-6 relative">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
            {event.name}
          </h1>

          <p className="text-neutral-400 text-base">
            🎶 Pide tu canción favorita
          </p>
        </div>

        {/* 🔥 FUEGUITOS MEJORADOS */}
        {showFire && (
          <>
            {/* Flash de fondo */}
            <div 
              className="fixed inset-0 bg-orange-500 pointer-events-none z-40"
              style={{
                animation: 'flash 0.5s ease-out forwards',
              }}
            />
            
            <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Fuegos principales */}
                {[...Array(20)].map((_, i) => {
                  const randomX = Math.random();
                  const emojis = ['🔥', '🔥', '🔥', '💥', '💥', '💥'];
                  const emoji = emojis[Math.floor(Math.random() * emojis.length)];
                  const sizes = ['text-4xl', 'text-5xl', 'text-6xl', 'text-7xl'];
                  const size = sizes[Math.floor(Math.random() * sizes.length)];
                  
                  return (
                    <div
                      key={i}
                      className={`absolute ${size} select-none`}
                      style={{
                        left: `${10 + Math.random() * 80}%`,
                        bottom: '10%',
                        animation: `fireUp ${1.2 + Math.random() * 1.3}s ease-out forwards`,
                        animationDelay: `${i * 0.1}s`,
                        opacity: 0,
                        ['--random' as any]: randomX,
                      }}
                    >
                      {emoji}
                    </div>
                  );
                })}
                
                {/* Toast en esquina inferior izquierda */}
                <div 
                  className="fixed bottom-6 left-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-5 py-3 rounded-xl font-bold shadow-2xl backdrop-blur-sm flex items-center gap-3"
                  style={{
                    animation: 'slideInLeft 0.4s ease-out forwards',
                    animationDelay: '0.3s',
                    opacity: 0,
                  }}
                >
                  <span className="text-xl">✅</span>
                  <div>
                    <div className="text-base">¡Listo!</div>
                    <div className="text-xs font-normal opacity-90">Canción añadida</div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="relative">
          <input
            className="w-full rounded-2xl bg-neutral-800 border-2 border-neutral-700 px-5 py-4 text-white placeholder-neutral-400 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all duration-200 text-lg"
            placeholder="🔍 Buscar canción o artista..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          {/* Dropdown de resultados estilo select */}
          {query && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-neutral-800 border-2 border-neutral-700 rounded-2xl shadow-2xl overflow-hidden z-10">
              {loading && (
                <div className="flex items-center justify-center gap-2 py-6 text-neutral-400">
                  <div className="w-2 h-2 bg-brand-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                  <div className="w-2 h-2 bg-brand-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                  <div className="w-2 h-2 bg-brand-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                  <span className="ml-2">Buscando</span>
                </div>
              )}

              {!loading && results.length === 0 && (
                <div className="text-center text-neutral-500 py-8">
                  <div className="text-4xl mb-2">🎵</div>
                  <p className="text-sm">No se encontraron canciones</p>
                </div>
              )}

              {!loading && results.length > 0 && (
                <div className="max-h-96 overflow-y-auto scroll-smooth">
                  {results.map((song, index) => (
                    <div
                      key={song.id}
                      className={`w-full flex items-center gap-3 p-3 hover:bg-neutral-700 transition-colors ${
                        index !== 0 ? 'border-t border-neutral-700' : ''
                      }`}
                    >
                      {song.image ? (
                        <img
                          src={song.image}
                          alt={song.title}
                          className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-neutral-700 flex items-center justify-center text-2xl flex-shrink-0">
                          🎵
                        </div>
                      )}

                      <div className="flex-1 min-w-0 text-left">
                        <div className="font-semibold truncate">{song.title}</div>
                        <div className="text-sm text-neutral-400 truncate">
                          {song.artist}
                        </div>
                      </div>

                      <button
                        onClick={() => requestSong(song)}
                        className="bg-brand-500 hover:bg-brand-600 active:scale-95 px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex-shrink-0 text-sm"
                      >
                         Pedir
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
