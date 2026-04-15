'use client';

import { useEffect, useRef, useCallback } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { StoreWithDistance } from '@/types/store';

interface StoreMapProps {
  stores: StoreWithDistance[];
  selectedStore: StoreWithDistance | null;
  userLocation: { lat: number; lng: number } | null;
  onSelectStore: (store: StoreWithDistance) => void;
}

const CDMX_CENTER = { lat: 19.4326, lng: -99.1332 };
const OXXO_RED = '#EE1C25';

// OXXO pin SVG as base64 data URI
const OXXO_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="44" viewBox="0 0 36 44">
  <path d="M18 0C8.06 0 0 8.06 0 18c0 13.5 18 26 18 26S36 31.5 36 18C36 8.06 27.94 0 18 0z" fill="${OXXO_RED}"/>
  <circle cx="18" cy="18" r="10" fill="white"/>
  <text x="18" y="23" text-anchor="middle" font-size="11" font-weight="bold" fill="${OXXO_RED}" font-family="Arial">OXXO</text>
</svg>`;

const OXXO_ICON_URL = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(OXXO_ICON_SVG)}`;

const SELECTED_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="42" height="52" viewBox="0 0 42 52">
  <path d="M21 0C9.4 0 0 9.4 0 21c0 15.75 21 31 21 31S42 36.75 42 21C42 9.4 32.6 0 21 0z" fill="#1A1A1A"/>
  <circle cx="21" cy="21" r="13" fill="white"/>
  <text x="21" y="27" text-anchor="middle" font-size="12" font-weight="bold" fill="${OXXO_RED}" font-family="Arial">OXXO</text>
</svg>`;

const SELECTED_ICON_URL = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(SELECTED_SVG)}`;

let loaderInstance: Loader | null = null;

function getLoader(apiKey: string): Loader {
  if (!loaderInstance) {
    loaderInstance = new Loader({
      apiKey,
      version: 'weekly',
      libraries: ['marker'],
    });
  }
  return loaderInstance;
}

export default function StoreMap({
  stores,
  selectedStore,
  userLocation,
  onSelectStore,
}: StoreMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<Map<string, google.maps.Marker>>(new Map());
  const userMarkerRef = useRef<google.maps.Marker | null>(null);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';

  const initMap = useCallback(async () => {
    if (!mapRef.current || googleMapRef.current) return;

    if (!apiKey) {
      // Render placeholder when no key is configured
      return;
    }

    const loader = getLoader(apiKey);
    await loader.load();

    const map = new google.maps.Map(mapRef.current, {
      center: CDMX_CENTER,
      zoom: 12,
      disableDefaultUI: false,
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      styles: [
        { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
        { featureType: 'transit', elementType: 'labels', stylers: [{ visibility: 'off' }] },
      ],
    });

    googleMapRef.current = map;
  }, [apiKey]);

  // Initialize map once
  useEffect(() => {
    initMap();
  }, [initMap]);

  // Sync markers with stores
  useEffect(() => {
    if (!googleMapRef.current || !apiKey) return;

    const map = googleMapRef.current;
    const existing = new Set(markersRef.current.keys());

    stores.forEach((store) => {
      existing.delete(store.id);
      const isSelected = selectedStore?.id === store.id;

      if (markersRef.current.has(store.id)) {
        const marker = markersRef.current.get(store.id)!;
        marker.setIcon({
          url: isSelected ? SELECTED_ICON_URL : OXXO_ICON_URL,
          scaledSize: new google.maps.Size(isSelected ? 42 : 36, isSelected ? 52 : 44),
          anchor: new google.maps.Point(isSelected ? 21 : 18, isSelected ? 52 : 44),
        });
        marker.setZIndex(isSelected ? 999 : 1);
      } else {
        const marker = new google.maps.Marker({
          position: { lat: store.lat, lng: store.lng },
          map,
          title: store.name,
          icon: {
            url: OXXO_ICON_URL,
            scaledSize: new google.maps.Size(36, 44),
            anchor: new google.maps.Point(18, 44),
          },
        });
        marker.addListener('click', () => onSelectStore(store));
        markersRef.current.set(store.id, marker);
      }
    });

    // Remove stale markers
    existing.forEach((id) => {
      markersRef.current.get(id)?.setMap(null);
      markersRef.current.delete(id);
    });
  }, [stores, selectedStore, onSelectStore, apiKey]);

  // Pan to selected store
  useEffect(() => {
    if (!googleMapRef.current || !selectedStore) return;
    googleMapRef.current.panTo({ lat: selectedStore.lat, lng: selectedStore.lng });
    googleMapRef.current.setZoom(15);
  }, [selectedStore]);

  // User location marker
  useEffect(() => {
    if (!googleMapRef.current || !userLocation || !apiKey) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.setPosition(userLocation);
    } else {
      userMarkerRef.current = new google.maps.Marker({
        position: userLocation,
        map: googleMapRef.current,
        title: 'Mi ubicación',
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 9,
          fillColor: '#4285F4',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        },
        zIndex: 9999,
      });
    }
    googleMapRef.current.panTo(userLocation);
    googleMapRef.current.setZoom(13);
  }, [userLocation, apiKey]);

  if (!apiKey) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 text-center px-6 gap-4">
        <div className="w-20 h-20 rounded-2xl bg-oxxo-red/10 flex items-center justify-center">
          <svg className="w-10 h-10 text-oxxo-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6-10l6-3m6 3l-5.447 2.724A1 1 0 0015 10.618v10.764a1 1 0 001.447.894L21 20V9m-6-2l-6 3" />
          </svg>
        </div>
        <div>
          <p className="font-semibold text-gray-700">Mapa no disponible</p>
          <p className="text-sm text-gray-500 mt-1">
            Configura{' '}
            <code className="bg-gray-100 px-1 rounded text-xs">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code>{' '}
            en <code className="bg-gray-100 px-1 rounded text-xs">.env.local</code> para activar el mapa.
          </p>
        </div>
        <p className="text-xs text-gray-400">
          Mientras tanto, usa la vista de Lista para explorar sucursales.
        </p>
      </div>
    );
  }

  return (
    <div
      ref={mapRef}
      className="flex-1 w-full"
      style={{ minHeight: 0 }}
    />
  );
}
