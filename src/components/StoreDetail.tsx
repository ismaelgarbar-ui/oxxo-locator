'use client';

import { motion } from 'framer-motion';
import { StoreWithDistance } from '@/types/store';
import { formatDistance, isCurrentlyOpen, DAY_LABELS } from '@/lib/geo';
import { openGoogleMaps, openWaze, openAppleMaps, isIOS } from '@/lib/navigation';
import { SERVICE_ICONS } from '@/lib/services';
import {
  MapPin, Phone, Clock, X, Share2, Zap,
} from 'lucide-react';
import Image from 'next/image';

interface StoreDetailProps {
  store: StoreWithDistance;
  onClose: () => void;
}

const IconNavBtn = ({ onClick, src, label }: {
  onClick: () => void;
  src: string;
  label: string;
}) => (
  <motion.button
    whileTap={{ scale: 0.9 }}
    onClick={onClick}
    className="flex flex-col items-center gap-1"
  >
    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white border border-[var(--c-border)] shadow-sm overflow-hidden active:brightness-95 transition-all p-2.5">
      <div className="relative w-full h-full">
        <Image src={src} alt={label} fill className="object-contain" />
      </div>
    </div>
    <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--c-text-subtle)]">{label}</span>
  </motion.button>
);

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[11px] font-black uppercase tracking-[0.08em] text-[var(--c-text-subtle)]">{children}</p>
);

export default function StoreDetail({ store, onClose }: StoreDetailProps) {
  const open     = isCurrentlyOpen(store.hours, store.isOpen24h);
  const todayKey = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'][new Date().getDay()];
  const showAppleMaps = isIOS();

  const handleShare = async () => {
    const text = `${store.name} — ${store.address}, ${store.neighborhood}, ${store.city}`;
    if (navigator.share) {
      await navigator.share({ title: store.name, text, url: `https://maps.google.com/?q=${store.lat},${store.lng}` });
    } else {
      await navigator.clipboard.writeText(text);
    }
  };

  return (
    <div className="flex flex-col max-h-full bg-[var(--c-bg)] overflow-hidden">

      {/* ── Fixed Header ── */}
      <div className="relative flex-shrink-0 border-b border-[var(--c-border)] bg-[var(--c-surface)] z-20">
        <div className="absolute top-4 right-4 flex gap-2">
          <button onClick={handleShare} className="w-9 h-9 rounded-full flex items-center justify-center border border-[var(--c-border)] bg-[var(--c-surface)] active:bg-[var(--c-surface-2)]">
            <Share2 className="w-4 h-4 text-[var(--c-text-muted)]" />
          </button>
          <button onClick={onClose} className="w-9 h-9 rounded-full flex items-center justify-center border border-[var(--c-border)] bg-[var(--c-surface)] active:bg-[var(--c-surface-2)]">
            <X className="w-4 h-4 text-[var(--c-text-muted)]" />
          </button>
        </div>

        <div className="px-6 pt-6 pb-5">
          <Image src="/store-logo.svg" alt="Store" width={76} height={32} style={{ objectFit: 'contain' }} className="mb-2" />
          <h2 className="font-extrabold text-xl leading-tight text-[var(--c-text)]">{store.name}</h2>

          <div className="flex items-center justify-between mt-3 gap-4">
            <div className="flex-1 min-w-0">
              {store.distance !== undefined && (
                <p className="text-[var(--c-text-muted)] text-xs font-medium">A {formatDistance(store.distance)} de tu ubicación</p>
              )}
              <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border"
                style={{
                  background: store.isOpen24h || open ? 'rgba(34,197,94,0.06)' : 'rgba(0,0,0,0.03)',
                  color: store.isOpen24h || open ? '#166534' : 'var(--c-text-subtle)',
                  borderColor: store.isOpen24h || open ? 'rgba(34,197,94,0.2)' : 'var(--c-border)',
                }}
              >
                {store.isOpen24h ? <><Zap className="w-3 h-3" />Abierto 24h</> :
                 open ? <><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />Abierto ahora</> :
                 <><span className="w-1.5 h-1.5 rounded-full bg-[var(--c-text-subtle)] inline-block opacity-40" />Cerrado</>}
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center gap-4 flex-shrink-0">
              <IconNavBtn onClick={() => openGoogleMaps(store.lat, store.lng, store.name)} src="/google-map-icon.webp" label="Google" />
              <IconNavBtn onClick={() => openWaze(store.lat, store.lng)} src="/waze-icon.webp" label="Waze" />
              {showAppleMaps && (
                <IconNavBtn onClick={() => openAppleMaps(store.lat, store.lng, store.name)} src="/apple.png" label="Apple" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Scrollable Body ── */}
      <div className="flex-1 overflow-y-auto scrollbar-none overscroll-contain">
        <div className="px-5 py-6 space-y-5">

          {/* Address Card */}
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-[var(--c-surface)] border border-[var(--c-border)] shadow-sm">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-oxxo-red/5">
              <MapPin className="w-5 h-5 text-oxxo-red" />
            </div>
            <div className="min-w-0">
              <SectionLabel>Dirección</SectionLabel>
              <p className="text-sm font-bold text-[var(--c-text)] leading-snug mt-0.5">{store.address}</p>
              <p className="text-sm text-[var(--c-text-muted)] mt-0.5">{store.neighborhood}, {store.city}</p>
            </div>
          </div>

          {/* Phone Card */}
          {store.phone && (
            <a href={`tel:${store.phone}`} className="flex items-center gap-4 p-4 rounded-2xl bg-[var(--c-surface)] border border-[var(--c-border)] shadow-sm active:scale-[0.98] transition-all">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-emerald-500/5">
                <Phone className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="min-w-0">
                <SectionLabel>Comunícate</SectionLabel>
                <p className="text-sm font-bold text-blue-500 tracking-tight mt-0.5">{store.phone}</p>
              </div>
            </a>
          )}

          {/* Services Section */}
          {store.services.length > 0 && (
            <div className="p-4 rounded-2xl bg-[var(--c-surface)] border border-[var(--c-border)] shadow-sm">
              <SectionLabel>Servicios OXXO</SectionLabel>
              <div className="grid grid-cols-2 gap-3 mt-4">
                {store.services.map((srv) => (
                  <div key={srv} className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 bg-[var(--c-surface-2)] border border-[var(--c-border)]">
                    <span className="text-oxxo-red flex-shrink-0">{SERVICE_ICONS[srv] ?? <MapPin className="w-4 h-4" />}</span>
                    <span className="text-xs font-bold leading-tight text-[var(--c-text)]">{srv}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Schedule Section */}
          {!store.isOpen24h && (
            <div className="p-4 rounded-2xl bg-[var(--c-surface)] border border-[var(--c-border)] shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-4 h-4 text-oxxo-red" />
                <SectionLabel>Horarios</SectionLabel>
              </div>
              <div className="space-y-2.5">
                {Object.entries(DAY_LABELS).map(([key, label]) => (
                  <div key={key} className={`flex justify-between text-sm ${key === todayKey ? 'font-bold' : ''}`} style={{ color: key === todayKey ? 'var(--c-text)' : 'var(--c-text-muted)' }}>
                    <span className="text-xs font-bold uppercase opacity-60">{label}</span>
                    <span className="font-mono text-xs">{store.hours[key]}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="h-4" />
        </div>
      </div>
    </div>
  );
}
