'use client';

import { motion } from 'framer-motion';
import { StoreWithDistance } from '@/types/store';
import { formatDistance, isCurrentlyOpen, DAY_LABELS } from '@/lib/geo';
import { openGoogleMaps, openWaze, openAppleMaps, isIOS } from '@/lib/navigation';
import {
  MapPin, Phone, Clock, X, Navigation, Share2,
  CreditCard, Lightbulb, Smartphone, DollarSign, Printer, Package, Zap,
} from 'lucide-react';
import Image from 'next/image';

interface StoreDetailProps {
  store: StoreWithDistance;
  onClose: () => void;
}

const SERVICE_ICONS: Record<string, React.ReactNode> = {
  'ATM':                 <CreditCard className="w-4 h-4" />,
  'Pago de servicios':   <Lightbulb className="w-4 h-4" />,
  'Recarga de celular':  <Smartphone className="w-4 h-4" />,
  'Envío de dinero':     <DollarSign className="w-4 h-4" />,
  'Impresiones':         <Printer className="w-4 h-4" />,
  'Recibo de paquetes':  <Package className="w-4 h-4" />,
};

const NavBtn = ({ onClick, bg, children }: { onClick: () => void; bg: string; children: React.ReactNode }) => (
  <motion.button
    whileTap={{ scale: 0.96 }}
    whileHover={{ brightness: 1.05 } as never}
    onClick={onClick}
    className="flex items-center justify-center gap-2 text-white text-sm font-bold py-4 rounded-2xl"
    style={{ background: bg }}
  >
    {children}
  </motion.button>
);

export default function StoreDetail({ store, onClose }: StoreDetailProps) {
  const open     = isCurrentlyOpen(store.hours, store.isOpen24h);
  const todayKey = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'][new Date().getDay()];

  const handleShare = async () => {
    const text = `${store.name} — ${store.address}, ${store.neighborhood}, ${store.city}`;
    if (navigator.share) {
      await navigator.share({ title: store.name, text, url: `https://maps.google.com/?q=${store.lat},${store.lng}` });
    } else {
      await navigator.clipboard.writeText(text);
    }
  };

  return (
    <div className="flex flex-col h-full">

      {/* ── Hero ── */}
      <div className="relative flex-shrink-0" style={{ background: 'var(--c-dark)' }}>
        {/* Close / Share */}
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          <motion.button whileTap={{ scale: 0.92 }} onClick={handleShare}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.12)' }}>
            <Share2 className="w-4 h-4 text-white" />
          </motion.button>
          <motion.button whileTap={{ scale: 0.92 }} onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.12)' }}>
            <X className="w-4 h-4 text-white" />
          </motion.button>
        </div>

        <div className="px-5 pt-5 pb-4">
          <div className="flex items-center gap-3">
            <Image src="/oxxo-logo.png" alt="OXXO" width={76} height={32}
              style={{ objectFit: 'contain' }} />
          </div>
          <h2 className="text-white font-extrabold text-xl mt-2 leading-tight">{store.name}</h2>
          {store.distance !== undefined && (
            <p className="text-white/60 text-sm mt-0.5">A {formatDistance(store.distance)} de tu ubicación</p>
          )}

          {/* Status pill */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
            style={{
              background: store.isOpen24h || open ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.1)',
              color: store.isOpen24h || open ? '#4ade80' : 'rgba(255,255,255,0.5)',
            }}
          >
            {store.isOpen24h ? (
              <><Zap className="w-3 h-3" />Abierto 24 horas</>
            ) : open ? (
              <><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />Abierto ahora</>
            ) : (
              <><span className="w-1.5 h-1.5 rounded-full bg-white/30 inline-block" />Cerrado</>
            )}
            {!store.isOpen24h && (
              <span className="ml-1 opacity-70">{store.hours[todayKey]}</span>
            )}
          </motion.div>
        </div>
      </div>

      {/* ── Scrollable content ── */}
      <div className="flex-1 overflow-y-auto" style={{ background: 'var(--c-surface)' }}>

        {/* Address */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.12 }}
          className="px-5 py-4 border-b" style={{ borderColor: 'var(--c-border)' }}>
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                 style={{ background: 'rgba(238,28,37,0.08)' }}>
              <MapPin className="w-4 h-4 text-oxxo-red" />
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: 'var(--c-text)' }}>{store.address}</p>
              <p className="text-sm" style={{ color: 'var(--c-text-muted)' }}>{store.neighborhood}, {store.city}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--c-text-subtle)' }}>{store.state} {store.zipCode}</p>
            </div>
          </div>
          {store.phone && (
            <a href={`tel:${store.phone}`}
               className="flex items-center gap-3 mt-3 active:opacity-70">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                   style={{ background: 'rgba(238,28,37,0.08)' }}>
                <Phone className="w-4 h-4 text-oxxo-red" />
              </div>
              <p className="text-sm font-semibold text-blue-500">{store.phone}</p>
            </a>
          )}
        </motion.div>

        {/* Schedule */}
        {!store.isOpen24h && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.18 }}
            className="px-5 py-4 border-b" style={{ borderColor: 'var(--c-border)' }}>
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4" style={{ color: 'var(--c-text-muted)' }} />
              <p className="text-sm font-bold" style={{ color: 'var(--c-text)' }}>Horario semanal</p>
            </div>
            <div className="space-y-2">
              {Object.entries(DAY_LABELS).map(([key, label]) => (
                <div key={key}
                     className={`flex justify-between text-sm ${key === todayKey ? 'font-bold' : ''}`}
                     style={{ color: key === todayKey ? 'var(--c-text)' : 'var(--c-text-muted)' }}>
                  <span>{label}</span>
                  <span style={{ color: key === todayKey ? '#EE1C25' : 'var(--c-text-muted)' }}>
                    {store.hours[key]}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Services */}
        {store.services.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.22 }}
            className="px-5 py-4">
            <p className="text-sm font-bold mb-3" style={{ color: 'var(--c-text)' }}>
              Servicios disponibles
            </p>
            <div className="grid grid-cols-2 gap-2">
              {store.services.map((srv) => (
                <motion.div
                  key={srv}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-3 border"
                  style={{ background: 'var(--c-surface-2)', borderColor: 'var(--c-border)' }}
                >
                  <span style={{ color: '#EE1C25' }}>{SERVICE_ICONS[srv] ?? <MapPin className="w-4 h-4" />}</span>
                  <span className="text-xs font-semibold leading-tight" style={{ color: 'var(--c-text)' }}>
                    {srv}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
        <div className="h-6" />
      </div>

      {/* ── CTA ── */}
      <div className="flex-shrink-0 px-5 pt-3 pb-5 border-t safe-area-bottom"
           style={{ background: 'var(--c-surface)', borderColor: 'var(--c-border)' }}>
        <p className="text-center text-xs font-bold uppercase tracking-wider mb-3"
           style={{ color: 'var(--c-text-subtle)' }}>
          Cómo llegar
        </p>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <NavBtn onClick={() => openGoogleMaps(store.lat, store.lng, store.name)} bg="#4285F4">
            <Navigation className="w-4 h-4" />Google Maps
          </NavBtn>
          <NavBtn onClick={() => openWaze(store.lat, store.lng)} bg="#0DA5E0">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.54 7.28C19.7 3.19 16.09.5 12 .5 7.41.5 3.5 4 3.5 8.5c0 1.5.47 3.16 1.35 4.56L3.5 16.5l4.04-1.05A9.47 9.47 0 0012 16.5c5.23 0 9.5-4.04 9.5-9 0-.74-.16-1.46-.34-2.22h-.62z"/>
            </svg>
            Waze
          </NavBtn>
        </div>
        {isIOS() && (
          <NavBtn onClick={() => openAppleMaps(store.lat, store.lng, store.name)} bg="var(--c-dark)">
            <Navigation className="w-4 h-4" />Apple Maps
          </NavBtn>
        )}
      </div>
    </div>
  );
}
