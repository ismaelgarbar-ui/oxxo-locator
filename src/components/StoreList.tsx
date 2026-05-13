'use client';

import { RefObject } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StoreWithDistance } from '@/types/store';
import StoreCard from './StoreCard';
import { Search, MapPin, Zap, CreditCard, Lightbulb, Clock, X } from 'lucide-react';

type FilterKey = 'all' | '24h' | 'atm' | 'open' | 'payments';

interface StoreListProps {
  stores: StoreWithDistance[];
  selectedStore: StoreWithDistance | null;
  search: string;
  activeFilter: FilterKey;
  onSearchChange: (v: string) => void;
  onFilterChange: (f: FilterKey) => void;
  onSelectStore: (store: StoreWithDistance) => void;
  userLocation: { lat: number; lng: number } | null;
  searchInputRef?: RefObject<HTMLInputElement | null>;
}

const FILTERS: { key: FilterKey; label: string; icon: React.ReactNode }[] = [
  { key: 'all',      label: 'Todas',          icon: <MapPin className="w-3 h-3" /> },
  { key: 'open',     label: 'Abierto ahora',  icon: <Clock className="w-3 h-3" /> },
  { key: '24h',      label: '24 horas',       icon: <Zap className="w-3 h-3" /> },
  { key: 'atm',      label: 'Con ATM',        icon: <CreditCard className="w-3 h-3" /> },
  { key: 'payments', label: 'Pago servicios', icon: <Lightbulb className="w-3 h-3" /> },
];

export default function StoreList({
  stores, selectedStore, search, activeFilter,
  onSearchChange, onFilterChange, onSelectStore, userLocation,
  searchInputRef,
}: StoreListProps) {
  const hasActiveQuery = search.trim().length > 0 || activeFilter !== 'all';

  return (
    <div className="flex flex-col h-full" style={{ background: 'var(--c-bg)' }}>

      {/* Search */}
      <div className="px-4 pt-3 pb-2 border-b" style={{ borderColor: 'var(--c-border)', background: 'var(--c-surface)' }}>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--c-text-subtle)' }} />
          <input
            ref={searchInputRef}
            type="search"
            placeholder="Ciudad, colonia o nombre…"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-2xl text-sm font-medium border
                       focus:outline-none focus:ring-2 focus:ring-oxxo-red/20 focus:border-oxxo-red transition-all"
            style={{
              background: 'var(--c-surface-2)',
              borderColor: 'var(--c-border)',
              color: 'var(--c-text)',
            }}
          />
        </div>
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 px-4 py-2.5 overflow-x-auto scrollbar-none border-b"
           style={{ borderColor: 'var(--c-border)', background: 'var(--c-surface)' }}>
        {FILTERS.map((f) => (
          <motion.button
            key={f.key}
            whileTap={{ scale: 0.95 }}
            onClick={() => onFilterChange(f.key)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full
                        text-xs font-semibold border whitespace-nowrap transition-all duration-200`}
            style={activeFilter === f.key
              ? { background: 'var(--c-text)', color: 'var(--c-surface)', borderColor: 'var(--c-text)' }
              : { background: 'var(--c-surface)', color: 'var(--c-text-muted)', borderColor: 'var(--c-border)' }
            }
          >
            {f.icon}
            {f.label}
          </motion.button>
        ))}
      </div>

      {/* Count */}
      <div className="px-4 py-2 flex items-center justify-between">
        <p className="text-xs font-semibold" style={{ color: 'var(--c-text-muted)' }}>
          {stores.length} sucursal{stores.length !== 1 ? 'es' : ''}
          {userLocation ? ' · por cercanía' : ''}
        </p>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-4 pb-8 space-y-3">
        <AnimatePresence mode="popLayout">
          {stores.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 gap-4"
            >
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                   style={{ background: 'var(--c-surface-2)' }}>
                <Search className="w-7 h-7" style={{ color: 'var(--c-text-subtle)' }} />
              </div>
              <div className="text-center">
                <p className="font-bold text-sm" style={{ color: 'var(--c-text)' }}>Sin resultados</p>
                <p className="text-xs mt-1" style={{ color: 'var(--c-text-muted)' }}>
                  {hasActiveQuery ? 'No hay sucursales con ese filtro.' : 'Prueba con otro término.'}
                </p>
              </div>
              {hasActiveQuery && (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { onSearchChange(''); onFilterChange('all'); }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold border transition-colors"
                  style={{
                    borderColor: 'var(--c-border)',
                    color: 'var(--c-text)',
                    background: 'var(--c-surface)',
                  }}
                >
                  <X className="w-3 h-3" />
                  Quitar filtros
                </motion.button>
              )}
            </motion.div>
          ) : (
            stores.map((store, i) => (
              <StoreCard
                key={store.id}
                store={store}
                isSelected={selectedStore?.id === store.id}
                onClick={() => onSelectStore(store)}
                index={i}
              />
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
