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

const MapButton = ({ onClick, color, icon: Icon, label }: { 
  onClick: () => void; 
  color: string; 
  icon: any; 
  label: string 
}) => (
  <motion.button
    whileTap={{ scale: 0.96 }}
    onClick={onClick}
    className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl text-white font-black uppercase tracking-wider text-sm shadow-md"
    style={{ background: color }}
  >
    <Icon className="w-5 h-5" />
    {label}
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

      {/* ── Header ── */}
      <div className="relative flex-shrink-0 border-b border-[var(--c-border)] bg-[var(--c-surface)] z-10">
        <div className="absolute top-4 right-4 flex gap-2">
          <button onClick={handleShare} className="w-10 h-10 rounded-full flex items-center justify-center border border-[var(--c-border)] bg-[var(--c-surface)] active:bg-[var(--c-surface-2)]">
            <Share2 className="w-5 h-5 text-[var(--c-text-muted)]" />
          </button>
          <button onClick={onClose} className="w-10 h-10 rounded-full flex items-center justify-center border border-[var(--c-border)] bg-[var(--c-surface)] active:bg-[var(--c-surface-2)]">
            <X className="w-5 h-5 text-[var(--c-text-muted)]" />
          </button>
        </div>

        <div className="px-6 pt-6 pb-5">
          <Image src="/oxxo-logo.png" alt="OXXO" width={80} height={34} style={{ objectFit: 'contain' }} className="mb-2" />
          <h2 className="font-extrabold text-2xl leading-tight text-[var(--c-text)]">{store.name}</h2>
          {store.distance !== undefined && (
            <p className="text-[var(--c-text-muted)] text-sm font-medium mt-1">A {formatDistance(store.distance)} de tu ubicación</p>
          )}

          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border"
            style={{
              background: store.isOpen24h || open ? 'rgba(34,197,94,0.06)' : 'rgba(0,0,0,0.03)',
              color: store.isOpen24h || open ? '#166534' : 'var(--c-text-subtle)',
              borderColor: store.isOpen24h || open ? 'rgba(34,197,94,0.2)' : 'var(--c-border)',
            }}
          >
            {store.isOpen24h ? <><Zap className="w-3.5 h-3.5" />Abierto 24 horas</> : 
             open ? <><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />Abierto ahora</> : 
             <><span className="w-2 h-2 rounded-full bg-[var(--c-text-subtle)] inline-block opacity-40" />Cerrado</>}
          </div>
        </div>
      </div>

      {/* ── Scrollable Body ── */}
      <div className="flex-1 overflow-y-auto scrollbar-none">
        <div className="px-6 py-6 space-y-6">
          
          {/* Cómo llegar (Now at the top of content for easy access) */}
          <div className="space-y-3">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--c-text-subtle)] mb-2">Cómo llegar</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <MapButton onClick={() => openGoogleMaps(store.lat, store.lng, store.name)} color="#4285F4" icon={Navigation} label="Google Maps" />
              <MapButton onClick={() => openWaze(store.lat, store.lng)} color="#33CCFF" icon={Zap} label="Waze" />
              {showAppleMaps && (
                <MapButton onClick={() => openAppleMaps(store.lat, store.lng, store.name)} color="#000000" icon={Navigation} label="Apple Maps" />
              )}
            </div>
          </div>

          <div className="h-px bg-[var(--c-border)]" />

          {/* Address */}
          <div className="flex items-start gap-4 p-5 rounded-2xl bg-[var(--c-surface)] border border-[var(--c-border)] shadow-sm">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 bg-oxxo-red/5">
              <MapPin className="w-5 h-5 text-oxxo-red" />
            </div>
            <div>
              <p className="text-xs font-black text-[var(--c-text-subtle)] uppercase tracking-wider mb-1">Ubicación</p>
              <p className="text-sm font-bold text-[var(--c-text)] leading-snug">{store.address}</p>
              <p className="text-sm text-[var(--c-text-muted)] mt-0.5">{store.neighborhood}, {store.city}</p>
            </div>
          </div>

          {/* Phone */}
          {store.phone && (
            <a href={`tel:${store.phone}`} className="flex items-center gap-4 p-5 rounded-2xl bg-[var(--c-surface)] border border-[var(--c-border)] shadow-sm active:scale-[0.98] transition-all">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 bg-emerald-500/5">
                <Phone className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs font-black text-[var(--c-text-subtle)] uppercase tracking-wider mb-1">Teléfono</p>
                <p className="text-sm font-bold text-blue-500 tracking-tight">{store.phone}</p>
              </div>
            </a>
          )}

          {/* Services */}
          {store.services.length > 0 && (
            <div className="p-5 rounded-2xl bg-[var(--c-surface)] border border-[var(--c-border)] shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.1em] text-[var(--c-text-subtle)] mb-4">Servicios disponibles</p>
              <div className="grid grid-cols-2 gap-3">
                {store.services.map((srv) => (
                  <div key={srv} className="flex items-center gap-3 rounded-xl px-3 py-3 bg-[var(--c-surface-2)] border border-[var(--c-border)]">
                    <span className="text-oxxo-red">{SERVICE_ICONS[srv] ?? <MapPin className="w-4 h-4" />}</span>
                    <span className="text-[10px] font-black uppercase leading-tight text-[var(--c-text)]">{srv}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Schedule */}
          {!store.isOpen24h && (
            <div className="p-5 rounded-2xl bg-[var(--c-surface)] border border-[var(--c-border)] shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-4 h-4 text-oxxo-red" />
                <p className="text-xs font-black uppercase tracking-[0.1em] text-[var(--c-text-subtle)]">Horario semanal</p>
              </div>
              <div className="space-y-3">
                {Object.entries(DAY_LABELS).map(([key, label]) => (
                  <div key={key} className={`flex justify-between text-sm ${key === todayKey ? 'font-bold' : ''}`} style={{ color: key === todayKey ? 'var(--c-text)' : 'var(--c-text-muted)' }}>
                    <span className="text-xs font-bold uppercase opacity-70">{label}</span>
                    <span className="font-mono text-xs">{store.hours[key]}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="h-10" />
      </div>
    </div>
  );
}
