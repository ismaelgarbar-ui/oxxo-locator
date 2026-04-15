'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { MapPin, Loader2, CheckCircle2 } from 'lucide-react';

interface PickedLocation {
  lat: number;
  lng: number;
  address: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  formatted: string;
}

interface MapPickerProps {
  onPick: (loc: PickedLocation) => void;
  initialLat?: number;
  initialLng?: number;
}

const CDMX = { lat: 19.4326, lng: -99.1332 };

let loaderSingleton: Loader | null = null;
function getLoader(apiKey: string) {
  if (!loaderSingleton) loaderSingleton = new Loader({ apiKey, version: 'weekly' });
  return loaderSingleton;
}

export default function MapPicker({ onPick, initialLat, initialLng }: MapPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef       = useRef<google.maps.Map | null>(null);
  const markerRef    = useRef<google.maps.Marker | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle');
  const [picked, setPicked] = useState<PickedLocation | null>(null);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';

  const reverseGeocode = useCallback(async (lat: number, lng: number) => {
    setStatus('loading');
    try {
      const res  = await fetch(`/api/reverse-geocode?lat=${lat}&lng=${lng}`);
      const data = await res.json();
      if (res.ok) {
        const loc: PickedLocation = {
          lat, lng,
          address:      data.address      || '',
          neighborhood: data.neighborhood || '',
          city:         data.city         || '',
          state:        data.state        || '',
          zipCode:      data.zipCode      || '',
          formatted:    data.formatted    || `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
        };
        setPicked(loc);
        onPick(loc);
        setStatus('done');
      } else {
        setStatus('idle');
      }
    } catch {
      setStatus('idle');
    }
  }, [onPick]);

  useEffect(() => {
    if (!containerRef.current || !apiKey) return;

    const loader = getLoader(apiKey);
    loader.load().then(() => {
      if (!containerRef.current || mapRef.current) return;

      const center = initialLat && initialLng
        ? { lat: initialLat, lng: initialLng }
        : CDMX;

      const map = new google.maps.Map(containerRef.current, {
        center,
        zoom: initialLat ? 15 : 11,
        disableDefaultUI: true,
        zoomControl: true,
        clickableIcons: false,
        styles: [
          { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
          { featureType: 'transit', elementType: 'labels', stylers: [{ visibility: 'off' }] },
        ],
      });

      mapRef.current = map;

      // If initial coords, drop a marker
      if (initialLat && initialLng) {
        markerRef.current = new google.maps.Marker({
          position: { lat: initialLat, lng: initialLng },
          map,
          icon: {
            url: '/oxxo-logo.png',
            scaledSize: new google.maps.Size(40, 17),
            anchor: new google.maps.Point(20, 17),
          },
          animation: google.maps.Animation.DROP,
        });
      }

      // Click handler
      map.addListener('click', (e: google.maps.MapMouseEvent) => {
        if (!e.latLng) return;
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();

        // Move or create marker
        if (markerRef.current) {
          markerRef.current.setPosition({ lat, lng });
        } else {
          markerRef.current = new google.maps.Marker({
            position: { lat, lng },
            map,
            icon: {
              url: '/oxxo-logo.png',
              scaledSize: new google.maps.Size(48, 20),
              anchor: new google.maps.Point(24, 20),
            },
            animation: google.maps.Animation.DROP,
          });
        }

        reverseGeocode(lat, lng);
      });
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKey]);

  if (!apiKey) {
    return (
      <div className="h-48 rounded-2xl bg-[var(--c-surface-2)] border border-[var(--c-border)] flex items-center justify-center text-sm text-[var(--c-text-muted)]">
        Configura NEXT_PUBLIC_GOOGLE_MAPS_API_KEY para activar el selector de mapa
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Instruction banner */}
      <div className="flex items-center gap-2 text-xs text-[var(--c-text-muted)] bg-[var(--c-surface-2)] px-3 py-2 rounded-xl border border-[var(--c-border)]">
        <MapPin className="w-3.5 h-3.5 text-oxxo-red flex-shrink-0" />
        <span>Haz clic en el mapa para seleccionar la ubicación de la sucursal</span>
      </div>

      {/* Map */}
      <div
        ref={containerRef}
        className="w-full rounded-2xl overflow-hidden border border-[var(--c-border)] cursor-crosshair"
        style={{ height: 280 }}
      />

      {/* Status */}
      {status === 'loading' && (
        <div className="flex items-center gap-2 text-xs text-[var(--c-text-muted)]">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-oxxo-red" />
          Obteniendo dirección…
        </div>
      )}
      {status === 'done' && picked && (
        <div className="flex items-start gap-2 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 px-3 py-2 rounded-xl">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">Ubicación detectada</p>
            <p className="text-xs text-emerald-600 dark:text-emerald-500 mt-0.5">{picked.formatted}</p>
          </div>
        </div>
      )}
    </div>
  );
}
