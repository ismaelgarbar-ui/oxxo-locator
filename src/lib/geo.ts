/**
 * Haversine formula — great-circle distance between two lat/lng points.
 * Returns distance in kilometres.
 */
export function haversine(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/** Human-readable distance string: "350 m" or "2.4 km" */
export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}

/**
 * Determine if a store is currently open based on its hours object.
 * Handles both "HH:MM - HH:MM" and "00:00 - 23:59" (24h) formats.
 */
export function isCurrentlyOpen(hours: Record<string, string>, isOpen24h: boolean): boolean {
  if (isOpen24h) return true;

  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const now = new Date();
  const dayKey = days[now.getDay()];
  const todayHours = hours[dayKey];

  if (!todayHours) return false;

  const [openStr, closeStr] = todayHours.split(' - ').map((s) => s.trim());
  if (!openStr || !closeStr) return false;

  const toMinutes = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  };

  const current = now.getHours() * 60 + now.getMinutes();
  const open = toMinutes(openStr);
  let close = toMinutes(closeStr);

  // Handle midnight crossing (e.g., 22:00 - 02:00)
  if (close < open) close += 24 * 60;

  return current >= open && current < close;
}

/** Day label in Spanish */
export const DAY_LABELS: Record<string, string> = {
  monday: 'Lunes',
  tuesday: 'Martes',
  wednesday: 'Miércoles',
  thursday: 'Jueves',
  friday: 'Viernes',
  saturday: 'Sábado',
  sunday: 'Domingo',
};
