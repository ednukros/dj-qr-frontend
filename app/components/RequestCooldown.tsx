'use client';

import { useEffect, useState } from 'react';

interface RequestCooldownProps {
  nextAvailableAt: number;
  onComplete: () => void;
}

export default function RequestCooldown({ nextAvailableAt, onComplete }: RequestCooldownProps) {
  const [remainingMinutes, setRemainingMinutes] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  useEffect(() => {
    const updateCountdown = () => {
      const now = Date.now();
      const diff = nextAvailableAt - now;

      if (diff <= 0) {
        setRemainingMinutes(0);
        setRemainingSeconds(0);
        onComplete();
        return;
      }

      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);

      setRemainingMinutes(minutes);
      setRemainingSeconds(seconds);
    };

    // Actualizar inmediatamente
    updateCountdown();

    // Actualizar cada segundo
    const interval = setInterval(updateCountdown, 1000);

    // Limpiar intervalo al desmontar
    return () => clearInterval(interval);
  }, [nextAvailableAt, onComplete]);

  return (
    <div className="bg-yellow-500/10 border-2 border-yellow-500/50 rounded-2xl p-4 text-center">
      <div className="text-yellow-400 mb-2 text-sm font-semibold">
        ⏱️ Espera un momento
      </div>
      <div className="text-white text-2xl font-bold mb-1">
        {String(remainingMinutes).padStart(2, '0')}:{String(remainingSeconds).padStart(2, '0')}
      </div>
      <div className="text-neutral-400 text-xs">
        Podrás hacer otra petición cuando el tiempo llegue a 0
      </div>
    </div>
  );
}
