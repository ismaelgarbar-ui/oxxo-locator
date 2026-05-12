'use client';

import { motion } from 'framer-motion';
import { StoreWithDistance } from '@/types/store';
import { formatDistance, isCurrentlyOpen } from '@/lib/geo';
import { MapPin, Clock, ChevronRight, Zap, CreditCard, Lightbulb } from 'lucide-react';
import Image from 'next/image';

interface StoreCardProps {
  store: StoreWithDistance;
  isSelected?: boolean;
  onClick: () => void;
  index?: number;
}

const SERVICE_ICONS: Record<string, React.ReactNode> = {
  'ATM':                 <CreditCard className="w-2.5 h-2.5" />,
  'Pago de servicios':   <Lightbulb className="w-2.5 h-2.5" />,
  'Envío de dinero':     <ChevronRight className="w-2.5 h-2.5" />,
};

export default function StoreCard({ store, isSelected, onClick, index = 0 }: StoreCardProps) {
  const open = isCurrentlyOpen(store.hours, store.isOpen24h);

  return (
    <motion.button
      layout
      onClick={onClick}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1], delay: Math.min(index * 0.045, 0.3) }}
      whileHover={{ y: -2, boxShadow: '0 8px 28px var(--c-shadow-lg)' }}
      whileTap={{ scale: 0.98 }}
      className={`w-full text-left rounded-2xl border transition-colors duration-200 p-4 flex gap-3 items-start
        ${isSelected
          ? 'bg-[var(--c-surface)] border-oxxo-red shadow-card-lg'
          : 'bg-[var(--c-surface)] border-[var(--c-border)] shadow-card hover:border-[var(--c-text-muted)]'
        }`}
      style={{ display: 'flex' }}
    >
      {/* Logo tile */}
      <div className={`flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden flex items-center justify-center
        ${isSelected ? 'bg-oxxo-red/8' : 'bg-[var(--c-surface-2)]'}`}>
        <Image src="/store-logo.svg" alt="Store" width={48} height={20} style={{ objectFit: 'contain' }} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={`font-bold text-sm leading-snug ${isSelected ? 'text-oxxo-red' : 'text-[var(--c-text)]'}`}>
            {store.name}
          </p>
          {store.distance !== undefined && (
            <span className="flex-shrink-0 text-xs font-semibold text-[var(--c-text-muted)] tabular-nums">
              {formatDistance(store.distance)}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 mt-1">
          <MapPin className="w-3 h-3 text-[var(--c-text-subtle)] flex-shrink-0" />
          <p className="text-xs text-[var(--c-text-muted)] truncate">{store.neighborhood}, {store.city}</p>
        </div>

        <div className="flex items-center gap-2 mt-2 flex-wrap">
          {/* Status */}
          {store.isOpen24h ? (
            <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
              <Zap className="w-3 h-3" />
              24h
            </span>
          ) : (
            <span className={`flex items-center gap-1 text-xs font-semibold
              ${open ? 'text-emerald-600' : 'text-[var(--c-text-subtle)]'}`}>
              <Clock className="w-3 h-3" />
              {open ? 'Abierto' : 'Cerrado'}
            </span>
          )}

          {/* Service badges */}
          {store.services.includes('ATM') && (
            <span className="flex items-center gap-0.5 text-xs px-1.5 py-0.5 rounded-full
                             bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium">
              <CreditCard className="w-2.5 h-2.5" />ATM
            </span>
          )}
          {store.services.includes('Pago de servicios') && (
            <span className="flex items-center gap-0.5 text-xs px-1.5 py-0.5 rounded-full
                             bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 font-medium">
              <Lightbulb className="w-2.5 h-2.5" />Pagos
            </span>
          )}

          {/* Nearest tag */}
          {index === 0 && store.distance !== undefined && (
            <span className="ml-auto text-xs font-bold text-oxxo-red">Más cercano</span>
          )}
        </div>
      </div>

      <ChevronRight className={`flex-shrink-0 w-4 h-4 self-center transition-colors
        ${isSelected ? 'text-oxxo-red' : 'text-[var(--c-border)]'}`} />
    </motion.button>
  );
}
