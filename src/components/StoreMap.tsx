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

// Custom Marker settings using the generic store logo
const MARKER_ICON = {
  url: '/store-logo.svg',
  scaledSize: { width: 42, height: 18 } as any,
  anchor: { x: 21, y: 18 } as any,
};

const SELECTED_MARKER_ICON = {
  url: '/store-logo.svg',
  scaledSize: { width: 56, height: 24 } as any,
  anchor: { x: 28, y: 24 } as any,
};

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

    if (!apiKey) return;

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

  useEffect(() => {
    initMap();
  }, [initMap]);

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
          url: isSelected ? SELECTED_MARKER_ICON.url : MARKER_ICON.url,
          scaledSize: isSelected ? SELECTED_MARKER_ICON.scaledSize : MARKER_ICON.scaledSize,
          anchor: isSelected ? SELECTED_MARKER_ICON.anchor : MARKER_ICON.anchor,
        });
        marker.setZIndex(isSelected ? 999 : 1);
      } else {
        const marker = new google.maps.Marker({
          position: { lat: store.lat, lng: store.lng },
          map,
          title: store.name,
          icon: {
            url: MARKER_ICON.url,
            scaledSize: MARKER_ICON.scaledSize,
            anchor: MARKER_ICON.anchor,
          },
        });
        marker.addListener('click', () => onSelectStore(store));
        markersRef.current.set(store.id, marker);
      }
    });

    existing.forEach((id) => {
      markersRef.current.get(id)?.setMap(null);
      markersRef.current.delete(id);
    });
  }, [stores, selectedStore, onSelectStore, apiKey]);

  useEffect(() => {
    if (!googleMapRef.current || !selectedStore) return;
    googleMapRef.current.panTo({ lat: selectedStore.lat, lng: selectedStore.lng });
    googleMapRef.current.setZoom(15);
  }, [selectedStore]);

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
        <p className="font-semibold text-gray-700">Mapa no disponible</p>
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
