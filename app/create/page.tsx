'use client';

import { useEffect, useState } from 'react';

export default function CreateEventPage() {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [event, setEvent] = useState<any>(null);
  const [genres, setGenres] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  // 🔹 Cargar géneros de Spotify
  useEffect(() => {
    fetch('http://localhost:3000/spotify/genres')
      .then((res) => res.json())
      .then((data) => {
        console.log('🎧 Genres from API:', data);
        // Por seguridad, aseguramos que sea array
        if (Array.isArray(data)) {
          setGenres(data);
        } else if (Array.isArray(data.genres)) {
          setGenres(data.genres);
        } else {
          setGenres([]);
        }
      })
      .catch((err) => {
        console.error('Error cargando géneros:', err);
        setGenres([]);
      });
  }, []);

  // 🔹 Seleccionar / deseleccionar género
  function toggleGenre(genre: string) {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter((g) => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  }

  // 🔹 Crear evento
  async function createEvent() {
    if (!name || selectedGenres.length === 0) return;

    const res = await fetch('http://localhost:3000/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        type,
        genres: selectedGenres,
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
          <div className="space-y-6">
            {/* Nombre */}
            <input
              className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-4 py-3 text-white placeholder-neutral-400 focus:outline-none focus:border-brand-500"
              placeholder="Nombre del evento"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            {/* Tipo */}
            <input
              className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-4 py-3 text-white placeholder-neutral-400 focus:outline-none focus:border-brand-500"
              placeholder="Tipo (boda, sala, verbena...)"
              value={type}
              onChange={(e) => setType(e.target.value)}
            />

            {/* Géneros */}
            <div>
              <h2 className="text-lg font-semibold mb-3">
                Selecciona géneros
              </h2>

              <div className="flex flex-wrap gap-3">
                {genres.slice(0, 40).map((genre) => {
                  const selected = selectedGenres.includes(genre);

                  return (
                    <button
                      key={genre}
                      type="button"
                      onClick={() => toggleGenre(genre)}
                      className={`px-4 py-2 rounded-xl border transition
                        ${
                          selected
                            ? 'bg-brand-500 border-brand-500 text-white'
                            : 'bg-neutral-800 border-neutral-700 text-neutral-300 hover:border-brand-500'
                        }`}
                    >
                      {genre}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Botón crear */}
            <button
              onClick={createEvent}
              disabled={!name || selectedGenres.length === 0}
              className={`w-full rounded-xl px-6 py-4 text-lg font-semibold transition
                ${
                  !name || selectedGenres.length === 0
                    ? 'bg-neutral-700 cursor-not-allowed'
                    : 'bg-brand-500 hover:bg-brand-600'
                }`}
            >
              Crear evento
            </button>
          </div>
        )}

        {/* Evento creado */}
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
