/**
 * Determina el badge según el número de peticiones
 */
export function getRequestBadge(count: number): {
  text: string;
  className: string;
} | null {
  if (count >= 5) {
    return {
      text: '🔥 Muy demandada',
      className: 'bg-gradient-to-r from-orange-500 to-red-600 text-white',
    };
  }
  
  if (count >= 3) {
    return {
      text: 'Popular',
      className: 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white',
    };
  }
  
  return null;
}
