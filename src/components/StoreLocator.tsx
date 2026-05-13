'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { StoreWithDistance } from '@/types/store';
import { haversine, isCurrentlyOpen, formatDistance } from '@/lib/geo';
import { useDarkMode } from '@/lib/useDarkMode';
import StoreList from './StoreList';
import StoreDetail from './StoreDetail';
import OxxoLogo from './OxxoLogo';
import {
  Navigation, Map, List, Loader2, AlertCircle, X,
  ChevronRight, Settings, Moon, Sun, MapPin, LocateFixed, Search,
} from 'lucide-react';

const StoreMap = dynamic(() => import('./StoreMap'), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex items-center justify-center" style={{ background: 'var(--c-bg)' }}>
      <Loader2 className="w-8 h-8 text-oxxo-red animate-spin" />
    </div>
  ),
});

type Tab = 'map' | 'list';
type FilterKey = 'all' | '24h' | 'atm' | 'open' | 'payments';
type GeoStatus = 'idle' | 'requesting' | 'locating' | 'success' | 'denied' | 'error';

function applyFilter(stores: StoreWithDistance[], filter: FilterKey, search: string) {
  return stores.filter((s) => {
    if (!s.active) return false;
    if (search) {
      const q = search.toLowerCase();
      if (
        !s.name.toLowerCase().includes(q) &&
        !s.address.toLowerCase().includes(q) &&
        !s.neighborhood.toLowerCase().includes(q) &&
        !s.city.toLowerCase().includes(q)
      ) return false;
    }
    if (filter === '24h')       return s.isOpen24h;
    if (filter === 'atm')       return s.services.includes('ATM');
    if (filter === 'open')      return isCurrentlyOpen(s.hours, s.isOpen24h);
    if (filter === 'payments')  return s.services.includes('Pago de servicios');
    return true;
  });
}

export default function StoreLocator() {
  const [stores,        setStores]        = useState<StoreWithDistance[]>([]);
  const [tab,           setTab]           = useState<Tab>('map');
  const [userLocation,  setUserLocation]  = useState<{ lat: number; lng: number } | null>(null);
  const [selectedStore, setSelectedStore] = useState<StoreWithDistance | null>(null);
  const [detailOpen,    setDetailOpen]    = useState(false);
  const [search,        setSearch]        = useState('');
  const [activeFilter,  setActiveFilter]  = useState<FilterKey>('all');
  const [loading,       setLoading]       = useState(true);
  const [geoStatus,     setGeoStatus]     = useState<GeoStatus>('idle');
  const [geoError,      setGeoError]      = useState('');
  const touchStartY   = useRef(0);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { dark, toggle: toggleDark } = useDarkMode();

  /* ── Fetch stores ── */
  useEffect(() => {
    fetch('/api/stores')
      .then((r) => r.json())
      .then((data: StoreWithDistance[]) => {
        setStores(data.filter((s) => s.active));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  /* ── Sort by proximity when location changes ── */
  useEffect(() => {
    if (!userLocation) return;
    setStores((prev) =>
      [...prev]
        .map((s) => ({
          ...s,
          distance: haversine(userLocation.lat, userLocation.lng, s.lat, s.lng),
        }))
        .sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity))
    );
  }, [userLocation]);

  /* ── Auto-locate on mount ── */
  const locate = useCallback(() => {
    if (!navigator.geolocation) {
      setGeoStatus('error');
      setGeoError('Geolocalización no disponible en este dispositivo.');
      return;
    }
    setGeoStatus('locating');
    setGeoError('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGeoStatus('success');
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setGeoStatus('denied');
          setGeoError('Permiso denegado. Activa la ubicación en tu navegador y vuelve a intentarlo.');
        } else {
          setGeoStatus('error');
          setGeoError('No se pudo obtener tu ubicación. Intenta de nuevo.');
        }
      },
      { timeout: 12000, maximumAge: 60000, enableHighAccuracy: true }
    );
  }, []);

  useEffect(() => {
    // Auto-request on load after stores are fetched
    if (!loading) locate();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  /* ── Manual search fallback when geo fails ── */
  const handleSearchFallback = useCallback(() => {
    setGeoError('');
    setGeoStatus('idle');
    setTab('list');
    setTimeout(() => searchInputRef.current?.focus(), 150);
  }, []);

  /* ── Store selection ── */
  const handleSelectStore = useCallback((store: StoreWithDistance) => {
    setSelectedStore(store);
    setDetailOpen(true);
    if (tab === 'list') setTab('map');
  }, [tab]);

  const handleCloseDetail = useCallback(() => {
    setDetailOpen(false);
    setTimeout(() => setSelectedStore(null), 350);
  }, []);

  /* ── Swipe-down to dismiss ── */
  const onTouchStart = (e: React.TouchEvent) => { touchStartY.current = e.touches[0].clientY; };
  const onTouchEnd   = (e: React.TouchEvent) => {
    if (e.changedTouches[0].clientY - touchStartY.current > 64) handleCloseDetail();
  };

  const filtered = applyFilter(stores, activeFilter, search);
  const nearest  = filtered[0];
  const hasActiveQuery = search.trim().length > 0 || activeFilter !== 'all';

  /* ── Loading splash ── */
  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-5"
           style={{ background: 'var(--c-bg)' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <OxxoLogo size="xl" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="flex items-center gap-2 text-sm font-medium"
          style={{ color: 'var(--c-text-muted)' }}
        >
          <Loader2 className="w-4 h-4 animate-spin text-oxxo-red" />
          Cargando sucursales…
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full relative overflow-hidden"
         style={{ background: 'var(--c-bg)' }}>

      {/* ── Header ── */}
      <motion.header
        initial={{ y: -8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="flex-shrink-0 border-b z-10"
        style={{
          background: 'var(--c-surface)',
          borderColor: 'var(--c-border)',
          boxShadow: '0 1px 0 var(--c-border)',
        }}
      >
        <div className="flex items-center justify-between px-4 py-3 gap-2">
          {/* Logo */}
          <OxxoLogo size="sm" variant="full" />

          {/* Locate pill */}
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={locate}
            disabled={geoStatus === 'locating'}
            className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-full border transition-all disabled:opacity-60"
            style={userLocation
              ? { borderColor: '#EE1C25', color: '#EE1C25', background: 'rgba(238,28,37,0.06)' }
              : { borderColor: 'var(--c-border)', color: 'var(--c-text)', background: 'var(--c-surface)' }
            }
          >
            {geoStatus === 'locating'
              ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
              : userLocation
                ? <LocateFixed className="w-3.5 h-3.5" />
                : <Navigation className="w-3.5 h-3.5" />
            }
            {geoStatus === 'locating' ? 'Buscando…' : userLocation ? 'Ubicado' : 'Ubicarme'}
          </motion.button>

          <div className="flex items-center gap-1.5">
            {/* Dark mode toggle */}
            <motion.button
              whileTap={{ scale: 0.88, rotate: 15 }}
              onClick={toggleDark}
              className="w-9 h-9 rounded-full border flex items-center justify-center transition-colors"
              style={{ borderColor: 'var(--c-border)', background: 'var(--c-surface)' }}
            >
              <AnimatePresence mode="wait" initial={false}>
                {dark ? (
                  <motion.span key="sun"
                    initial={{ opacity: 0, rotate: -60, scale: 0.5 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: 60, scale: 0.5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun className="w-4 h-4" style={{ color: 'var(--c-text-muted)' }} />
                  </motion.span>
                ) : (
                  <motion.span key="moon"
                    initial={{ opacity: 0, rotate: 60, scale: 0.5 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: -60, scale: 0.5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon className="w-4 h-4" style={{ color: 'var(--c-text-muted)' }} />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Admin */}
            <motion.a
              href="/admin"
              whileTap={{ scale: 0.9 }}
              className="w-9 h-9 rounded-full border flex items-center justify-center transition-colors"
              style={{ borderColor: 'var(--c-border)', background: 'var(--c-surface)', color: 'var(--c-text-subtle)' }}
            >
              <Settings className="w-4 h-4" />
            </motion.a>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex px-4">
          {([
            { key: 'map'  as Tab, icon: Map,  label: 'Mapa'  },
            { key: 'list' as Tab, icon: List, label: 'Lista' },
          ] as const).map(({ key, icon: Icon, label }) => (
            <motion.button
              key={key}
              onClick={() => setTab(key)}
              whileTap={{ scale: 0.95 }}
              className="flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-bold border-b-2 transition-colors relative"
              style={tab === key
                ? { borderColor: '#EE1C25', color: '#EE1C25' }
                : { borderColor: 'transparent', color: 'var(--c-text-subtle)' }
              }
            >
              <Icon className="w-4 h-4" />
              {label}
              {key === 'list' && hasActiveQuery && tab !== 'list' && (
                <span className="w-1.5 h-1.5 rounded-full bg-oxxo-red absolute top-2.5 right-[calc(50%-18px)]" />
              )}
              {tab === key && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-oxxo-red"
                  transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </motion.header>

      {/* ── Geo error / permission banner ── */}
      <AnimatePresence>
        {(geoStatus === 'denied' || geoStatus === 'error') && geoError && (
          <motion.div
            key="geo-error"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="flex items-center gap-3 px-4 py-2.5 border-b text-xs font-medium z-10 overflow-hidden"
            style={{
              background: 'rgba(245,158,11,0.08)',
              borderColor: 'rgba(245,158,11,0.3)',
              color: 'var(--c-text)',
            }}
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-amber-500" />
            <span className="flex-1">{geoError}</span>
            {geoStatus === 'denied' ? (
              <motion.button
                whileTap={{ scale: 0.93 }}
                onClick={handleSearchFallback}
                className="flex items-center gap-1 font-bold text-oxxo-red whitespace-nowrap"
              >
                <Search className="w-3 h-3" />
                Buscar manualmente
              </motion.button>
            ) : (
              <motion.button
                whileTap={{ scale: 0.93 }}
                onClick={locate}
                className="font-bold text-oxxo-red underline underline-offset-2 whitespace-nowrap"
              >
                Reintentar
              </motion.button>
            )}
            <button onClick={() => { setGeoError(''); setGeoStatus('idle'); }}>
              <X className="w-3.5 h-3.5" style={{ color: 'var(--c-text-subtle)' }} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main views ── */}
      <div className="flex-1 min-h-0 relative">
        {/* Map */}
        <div className={`absolute inset-0 flex flex-col ${tab === 'map' ? 'z-0 pointer-events-auto' : '-z-10 pointer-events-none opacity-0'}`}>
          <StoreMap
            stores={filtered}
            selectedStore={selectedStore}
            userLocation={userLocation}
            onSelectStore={handleSelectStore}
          />

          {/* Active filter chip on map */}
          <AnimatePresence>
            {hasActiveQuery && tab === 'map' && (
              <motion.div
                key="map-filter-chip"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border z-10"
                style={{
                  background: 'var(--c-surface)',
                  borderColor: 'var(--c-border)',
                  color: 'var(--c-text)',
                  boxShadow: '0 2px 8px var(--c-shadow)',
                }}
              >
                <Search className="w-3 h-3 text-oxxo-red flex-shrink-0" />
                <span className="max-w-[160px] truncate">
                  {search.trim() || activeFilter}
                </span>
                <button
                  onClick={() => { setSearch(''); setActiveFilter('all'); }}
                  className="ml-1 opacity-60 hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Nearest store floating card */}
          <AnimatePresence>
            {!detailOpen && nearest && tab === 'map' && (
              <motion.button
                key="nearest-card"
                initial={{ opacity: 0, y: 24, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 16, scale: 0.95 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -2, boxShadow: '0 12px 40px var(--c-shadow-lg)' }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleSelectStore(nearest)}
                className="absolute bottom-6 left-4 right-4 rounded-2xl border px-4 py-3.5 flex items-center gap-3 z-10"
                style={{
                  background: 'var(--c-surface)',
                  borderColor: 'var(--c-border)',
                  boxShadow: '0 8px 32px var(--c-shadow)',
                }}
              >
                <OxxoLogo size="xs" variant="icon" />
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-xs font-semibold mb-0.5 flex items-center gap-1"
                     style={{ color: 'var(--c-text-subtle)' }}>
                    <MapPin className="w-3 h-3 text-oxxo-red" />
                    {userLocation ? 'Más cercano' : 'Sugerido'}
                  </p>
                  <p className="font-extrabold text-sm truncate" style={{ color: 'var(--c-text)' }}>{nearest.name}</p>
                  <p className="text-xs truncate" style={{ color: 'var(--c-text-muted)' }}>
                    {nearest.neighborhood}, {nearest.city}
                  </p>
                </div>
                <div className="flex flex-col items-end flex-shrink-0 gap-1">
                  {nearest.distance !== undefined && (
                    <p className="font-extrabold text-oxxo-red text-base tabular-nums">
                      {formatDistance(nearest.distance)}
                    </p>
                  )}
                  <ChevronRight className="w-4 h-4" style={{ color: 'var(--c-border)' }} />
                </div>
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* List */}
        <AnimatePresence mode="wait">
          {tab === 'list' && (
            <motion.div
              key="list-view"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 flex flex-col"
            >
              <StoreList
                stores={filtered}
                selectedStore={selectedStore}
                search={search}
                activeFilter={activeFilter}
                onSearchChange={setSearch}
                onFilterChange={setActiveFilter}
                onSelectStore={handleSelectStore}
                userLocation={userLocation}
                searchInputRef={searchInputRef}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Backdrop ── */}
      <AnimatePresence>
        {detailOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 z-20 backdrop-blur-[2px]"
            style={{ background: 'rgba(0,0,0,0.45)' }}
            onClick={handleCloseDetail}
          />
        )}
      </AnimatePresence>

      {/* ── Bottom sheet ── */}
      <AnimatePresence>
        {detailOpen && selectedStore && (
          <motion.div
            key="detail-sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 38, mass: 1 }}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            className="absolute inset-x-0 bottom-0 rounded-t-3xl z-30 flex flex-col overflow-hidden"
            style={{
              maxHeight: '87vh',
              background: 'var(--c-surface)',
              boxShadow: '0 -8px 48px var(--c-shadow-lg)',
            }}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
              <motion.div
                className="w-12 h-1.5 rounded-full"
                style={{ background: 'var(--c-border)' }}
                whileTap={{ scaleX: 1.3 }}
              />
            </div>

            <div className="flex-1 overflow-hidden flex flex-col">
              <StoreDetail store={selectedStore} onClose={handleCloseDetail} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
