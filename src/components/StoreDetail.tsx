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

const NavBtn = ({ onClick, bg, icon: Icon, children }: { 
  onClick: () => void; 
  bg: string; 
  icon: any;
  children: React.ReactNode 
}) => (
  <motion.button
    whileTap={{ scale: 0.94 }}
    onClick={onClick}
    className="flex flex-col items-center justify-center gap-1.5 py-4 rounded-2xl border transition-all"
    style={{ 
      background: 'var(--c-surface)', 
      borderColor: 'var(--c-border)',
      boxShadow: '0 2px 8px var(--c-shadow)'
    }}
  >
    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white" style={{ background: bg }}>
      <Icon className="w-5 h-5" />
    </div>
    <span className="text-[10px] font-black uppercase tracking-wider text-[var(--c-text)]">
      {children}
    </span>
  </motion.button>
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
    <div className="flex flex-col h-full bg-[var(--c-bg)]">

      {/* ── Premium Hero (Light) ── */}
      <div className="relative flex-shrink-0 border-b border-[var(--c-border)] shadow-sm z-10 bg-[var(--c-surface)]">
        {/* Close / Share */}
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          <motion.button whileTap={{ scale: 0.92 }} onClick={handleShare}
            className="w-9 h-9 rounded-full flex items-center justify-center border border-[var(--c-border)] bg-[var(--c-surface)] shadow-sm">
            <Share2 className="w-4 h-4 text-[var(--c-text-muted)]" />
          </motion.button>
          <motion.button whileTap={{ scale: 0.92 }} onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center border border-[var(--c-border)] bg-[var(--c-surface)] shadow-sm">
            <X className="w-4 h-4 text-[var(--c-text-muted)]" />
          </motion.button>
        </div>

        <div className="px-6 pt-6 pb-5">
          <div className="flex items-center gap-3 mb-1">
            <Image src="/oxxo-logo.png" alt="OXXO" width={80} height={34}
              style={{ objectFit: 'contain' }} />
          </div>
          <h2 className="font-extrabold text-2xl leading-tight text-[var(--c-text)]">{store.name}</h2>
          {store.distance !== undefined && (
            <p className="text-[var(--c-text-muted)] text-sm font-medium mt-1">A {formatDistance(store.distance)} de tu ubicación</p>
          )}

          {/* Status pill */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border"
            style={{
              background: store.isOpen24h || open ? 'rgba(34,197,94,0.06)' : 'rgba(0,0,0,0.03)',
              color: store.isOpen24h || open ? '#166534' : 'var(--c-text-subtle)',
              borderColor: store.isOpen24h || open ? 'rgba(34,197,94,0.2)' : 'var(--c-border)',
            }}
          >
            {store.isOpen24h ? (
              <><Zap className="w-3.5 h-3.5" />Abierto 24 horas</>
            ) : open ? (
              <><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />Abierto ahora</>
            ) : (
              <><span className="w-2 h-2 rounded-full bg-[var(--c-text-subtle)] inline-block opacity-40" />Cerrado</>
            )}
            {!store.isOpen24h && (
              <span className="ml-1 opacity-60 border-l border-current pl-2">{store.hours[todayKey]}</span>
            )}
          </motion.div>
        </div>
      </div>

      {/* ── Scrollable content ── */}
      <div className="flex-1 overflow-y-auto bg-[var(--c-bg)] scrollbar-none">

        {/* Info Blocks */}
        <div className="px-6 py-6 space-y-6">
          {/* Address */}
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
            className="flex items-start gap-4 p-5 rounded-2xl bg-[var(--c-surface)] border border-[var(--c-border)] shadow-sm">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 bg-oxxo-red/5">
              <MapPin className="w-5 h-5 text-oxxo-red" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-black text-[var(--c-text-subtle)] uppercase tracking-wider mb-1">Ubicación</p>
              <p className="text-sm font-bold text-[var(--c-text)] leading-snug">{store.address}</p>
              <p className="text-sm text-[var(--c-text-muted)] mt-0.5">{store.neighborhood}, {store.city}</p>
            </div>
          </motion.div>

          {/* Phone */}
          {store.phone && (
            <motion.a 
              href={`tel:${store.phone}`}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="flex items-center gap-4 p-5 rounded-2xl bg-[var(--c-surface)] border border-[var(--c-border)] shadow-sm active:scale-[0.98] transition-all">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 bg-emerald-500/5">
                <Phone className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black text-[var(--c-text-subtle)] uppercase tracking-wider mb-1">Teléfono</p>
                <p className="text-sm font-bold text-blue-500 tracking-tight">{store.phone}</p>
              </div>
            </motion.a>
          )}

          {/* Schedule */}
          {!store.isOpen24h && (
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}
              className="p-5 rounded-2xl bg-[var(--c-surface)] border border-[var(--c-border)] shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-4 h-4 text-oxxo-red" />
                <p className="text-xs font-black uppercase tracking-[0.1em] text-[var(--c-text-subtle)]">Horario semanal</p>
              </div>
              <div className="space-y-3">
                {Object.entries(DAY_LABELS).map(([key, label]) => (
                  <div key={key}
                       className={`flex justify-between text-sm ${key === todayKey ? 'font-bold' : ''}`}
                       style={{ color: key === todayKey ? 'var(--c-text)' : 'var(--c-text-muted)' }}>
                    <span className="text-xs font-bold uppercase opacity-70">{label}</span>
                    <span className="font-mono text-xs" style={{ color: key === todayKey ? '#EE1C25' : 'var(--c-text-muted)' }}>
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
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}
              className="p-5 rounded-2xl bg-[var(--c-surface)] border border-[var(--c-border)] shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.1em] text-[var(--c-text-subtle)] mb-4">
                Servicios disponibles
              </p>
              <div className="grid grid-cols-2 gap-3">
                {store.services.map((srv) => (
                  <div
                    key={srv}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 bg-[var(--c-surface-2)] border border-[var(--c-border)]"
                  >
                    <span className="text-oxxo-red">{SERVICE_ICONS[srv] ?? <MapPin className="w-4 h-4" />}</span>
                    <span className="text-[10px] font-black uppercase leading-tight text-[var(--c-text)]">
                      {srv}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
        <div className="h-10" />
      </div>

      {/* ── CTA (Navigation Grid) ── */}
      <div className="flex-shrink-0 px-6 pt-5 pb-8 border-t bg-[var(--c-surface)] border-[var(--c-border)] safe-area-bottom">
        <p className="text-center text-[10px] font-black uppercase tracking-[0.2em] mb-5 text-[var(--c-text-subtle)]">
          Cómo llegar
        </p>
        <div className={`grid gap-3 ${showAppleMaps ? 'grid-cols-3' : 'grid-cols-2'}`}>
          <NavBtn onClick={() => openGoogleMaps(store.lat, store.lng, store.name)} bg="#4285F4" icon={Navigation}>
            Google
          </NavBtn>
          <NavBtn onClick={() => openWaze(store.lat, store.lng)} bg="#0DA5E0" icon={Zap}>
            Waze
          </NavBtn>
          {showAppleMaps && (
            <NavBtn onClick={() => openAppleMaps(store.lat, store.lng, store.name)} bg="#000000" icon={Navigation}>
              Apple
            </NavBtn>
          )}
        </div>
      </div>
    </div>
  );
}
