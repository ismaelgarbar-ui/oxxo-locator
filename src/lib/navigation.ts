/**
 * Deep-link helpers to launch external navigation apps.
 * Each function opens the preferred maps app with turn-by-turn directions
 * to the given coordinates.
 */

export function openGoogleMaps(lat: number, lng: number, name: string): void {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_name=${encodeURIComponent(name)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

export function openWaze(lat: number, lng: number): void {
  const url = `https://waze.com/ul?ll=${lat},${lng}&navigate=yes&zoom=17`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

export function openAppleMaps(lat: number, lng: number, name: string): void {
  const url = `https://maps.apple.com/?daddr=${lat},${lng}&q=${encodeURIComponent(name)}&dirflg=d`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

/** Detect iOS — Apple Maps is the natural default there */
export function isIOS(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}
