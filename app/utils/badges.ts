/**
 * Determina el badge según el número de peticiones
 */
export function getRequestBadge(count: number): {
  text: string;
  className: string;
} | null {
  if (count >= 5) {
    return {
      text: 'Lo está petando',
      className: 'bg-gradient-to-r from-purple-700 to-green-600 text-white',
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
