'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Store, StoreHours } from '@/types/store';
import { DAY_LABELS } from '@/lib/geo';
import { Loader2, MapPin, X, CheckCircle2, Map, Navigation, Clock, CreditCard, Zap, Info } from 'lucide-react';
import dynamic from 'next/dynamic';

const MapPicker = dynamic(() => import('@/components/MapPicker'), { 
  ssr: false,
  loading: () => (
    <div className="w-full aspect-video rounded-2xl bg-[var(--c-surface-2)] animate-pulse flex items-center justify-center">
      <Loader2 className="w-6 h-6 animate-spin text-oxxo-red" />
    </div>
  )
});

const AVAILABLE_SERVICES = [
  { name: 'ATM', icon: CreditCard },
  { name: 'Pago de servicios', icon: Zap },
  { name: 'Recarga de celular', icon: Navigation },
  { name: 'Envío de dinero', icon: CheckCircle2 },
  { name: 'Impresiones', icon: Info },
  { name: 'Recibo de paquetes', icon: MapPin },
];

const DEFAULT_HOURS: StoreHours = {
  monday: '07:00 - 23:00',
  tuesday: '07:00 - 23:00',
  wednesday: '07:00 - 23:00',
  thursday: '07:00 - 23:00',
  friday: '07:00 - 23:00',
  saturday: '07:00 - 23:00',
  sunday: '08:00 - 22:00',
};

const HOURS_24: StoreHours = {
  monday: '00:00 - 23:59',
  tuesday: '00:00 - 23:59',
  wednesday: '00:00 - 23:59',
  thursday: '00:00 - 23:59',
  friday: '00:00 - 23:59',
  saturday: '00:00 - 23:59',
  sunday: '00:00 - 23:59',
};

interface StoreFormProps {
  store?: Store | null;
  onSave: (store: Partial<Store>) => Promise<void>;
  onCancel: () => void;
}

export default function StoreForm({ store, onSave, onCancel }: StoreFormProps) {
  const [form, setForm] = useState<Partial<Store>>({
    name: '',
    address: '',
    neighborhood: '',
    city: 'Ciudad de México',
    state: 'CDMX',
    zipCode: '',
    phone: '',
    lat: 0,
    lng: 0,
    hours: { ...DEFAULT_HOURS },
    services: [],
    isOpen24h: false,
    active: true,
  });
  const [saving,      setSaving]      = useState(false);
  const [mapExpanded, setMapExpanded] = useState(false);
  const [pickedLabel, setPickedLabel] = useState('');

  useEffect(() => {
    if (store) {
      setForm(store);
      if (store.lat && store.lng) {
        setPickedLabel(`${store.lat.toFixed(5)}, ${store.lng.toFixed(5)}`);
      }
    }
  }, [store]);

  const set = <K extends keyof Store>(key: K, value: Store[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleService = (srv: string) => {
    const current = form.services ?? [];
    set('services', current.includes(srv) ? current.filter((s) => s !== srv) : [...current, srv]);
  };

  const toggleOpen24h = () => {
    const next = !form.isOpen24h;
    set('isOpen24h', next);
    if (next) set('hours', { ...HOURS_24 });
  };

  const handleMapPick = (loc: {
    lat: number; lng: number;
    address: string; neighborhood: string;
    city: string; state: string;
    zipCode: string; formatted: string;
  }) => {
    setForm((prev) => ({
      ...prev,
      lat:          loc.lat,
      lng:          loc.lng,
      address:      loc.address      || prev.address,
      neighborhood: loc.neighborhood || prev.neighborhood,
      city:         loc.city         || prev.city,
      state:        loc.state        || prev.state,
      zipCode:      loc.zipCode      || prev.zipCode,
    }));
    setPickedLabel(loc.formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(form);
    } finally {
      setSaving(false);
    }
  };

  const inputCls =
    'w-full bg-[var(--c-surface-2)] border border-[var(--c-border)] rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-oxxo-red/20 focus:border-oxxo-red/40 transition-all text-[var(--c-text)] placeholder-[var(--c-text-subtle)]';

  const labelCls = 'text-[10px] font-bold uppercase tracking-wider mb-2 block text-[var(--c-text-muted)] px-1';
  const sectionTitleCls = 'text-[11px] font-black uppercase tracking-[0.15em] mb-4 text-[var(--c-text-subtle)] border-b border-[var(--c-border)] pb-2';

  const sectionVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full bg-[var(--c-surface)]">

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--c-border)] bg-[var(--c-surface)] sticky top-0 z-20">
        <div>
          <h2 className="text-lg font-black text-[var(--c-text)]">
            {store ? 'Editar sucursal' : 'Nueva sucursal'}
          </h2>
          <p className="text-[10px] font-bold text-[var(--c-text-muted)] uppercase tracking-wider">Completa los detalles de la ubicación</p>
        </div>
        <motion.button 
          whileTap={{ scale: 0.9 }}
          type="button" 
          onClick={onCancel} 
          className="w-10 h-10 rounded-full flex items-center justify-center bg-[var(--c-surface-2)] text-[var(--c-text-muted)] border border-[var(--c-border)]"
        >
          <X className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8 scrollbar-none">

        {/* Basic info */}
        <motion.section variants={sectionVariants} initial="hidden" animate="visible" transition={{ delay: 0.1 }}>
          <h3 className={sectionTitleCls}>Información básica</h3>
          <div className="space-y-4">
            <div>
              <label className={labelCls}>Nombre de sucursal *</label>
              <input
                className={inputCls}
                value={form.name ?? ''}
                onChange={(e) => set('name', e.target.value)}
                placeholder="Ej. OXXO Reforma 222"
                required
              />
            </div>
            <div>
              <label className={labelCls}>Teléfono de contacto</label>
              <div className="relative">
                <input
                  className={inputCls}
                  value={form.phone ?? ''}
                  onChange={(e) => set('phone', e.target.value)}
                  placeholder="55 5555 5555"
                  type="tel"
                />
              </div>
            </div>
          </div>
        </motion.section>

        {/* GPS via Map */}
        <motion.section variants={sectionVariants} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={sectionTitleCls + ' mb-0 flex-1'}>Ubicación GPS</h3>
            <button
              type="button"
              onClick={() => setMapExpanded((v) => !v)}
              className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider px-4 py-2 rounded-xl transition-all border ${
                mapExpanded 
                  ? 'bg-oxxo-dark text-white border-oxxo-dark dark:bg-white dark:text-black dark:border-white' 
                  : 'bg-oxxo-red text-white border-oxxo-red shadow-lg shadow-oxxo-red/20'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              {mapExpanded ? 'Cerrar Mapa' : 'Seleccionar en Mapa'}
            </button>
          </div>

          <AnimatePresence>
            {mapExpanded && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden mb-4"
              >
                <div className="rounded-2xl border-2 border-[var(--c-border)] overflow-hidden shadow-inner">
                  <MapPicker
                    onPick={handleMapPick}
                    initialLat={form.lat || undefined}
                    initialLng={form.lng || undefined}
                  />
                </div>
                <p className="text-[10px] font-medium text-[var(--c-text-subtle)] mt-2 italic px-1">
                  Haz clic en el mapa para ubicar la sucursal y obtener la dirección automáticamente.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {!mapExpanded && pickedLabel && (
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-start gap-3 p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400 mb-4"
            >
              <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] font-black uppercase tracking-wider mb-0.5 opacity-70">Ubicación confirmada</p>
                <p className="text-xs font-bold truncate leading-tight">{pickedLabel}</p>
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Latitud</label>
              <input
                className={inputCls + ' font-mono text-xs'}
                type="number" step="any"
                value={form.lat ?? 0}
                onChange={(e) => set('lat', parseFloat(e.target.value))}
                required
              />
            </div>
            <div>
              <label className={labelCls}>Longitud</label>
              <input
                className={inputCls + ' font-mono text-xs'}
                type="number" step="any"
                value={form.lng ?? 0}
                onChange={(e) => set('lng', parseFloat(e.target.value))}
                required
              />
            </div>
          </div>
        </motion.section>

        {/* Address Fields */}
        <motion.section variants={sectionVariants} initial="hidden" animate="visible" transition={{ delay: 0.3 }}>
          <h3 className={sectionTitleCls}>Dirección Detallada</h3>
          <div className="space-y-4">
            <div>
              <label className={labelCls}>Calle y número *</label>
              <input
                className={inputCls}
                value={form.address ?? ''}
                onChange={(e) => set('address', e.target.value)}
                placeholder="Calle, número exterior/interior"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Colonia *</label>
                <input
                  className={inputCls}
                  value={form.neighborhood ?? ''}
                  onChange={(e) => set('neighborhood', e.target.value)}
                  placeholder="Ej. Polanco"
                  required
                />
              </div>
              <div>
                <label className={labelCls}>Código Postal</label>
                <input
                  className={inputCls}
                  value={form.zipCode ?? ''}
                  onChange={(e) => set('zipCode', e.target.value)}
                  placeholder="00000"
                  maxLength={5}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Ciudad</label>
                <input
                  className={inputCls}
                  value={form.city ?? ''}
                  onChange={(e) => set('city', e.target.value)}
                />
              </div>
              <div>
                <label className={labelCls}>Estado</label>
                <input
                  className={inputCls}
                  value={form.state ?? ''}
                  onChange={(e) => set('state', e.target.value)}
                />
              </div>
            </div>
          </div>
        </motion.section>

        {/* Hours */}
        <motion.section variants={sectionVariants} initial="hidden" animate="visible" transition={{ delay: 0.4 }}>
          <div className="flex items-center justify-between mb-4 border-b border-[var(--c-border)] pb-2">
            <h3 className="text-[11px] font-black uppercase tracking-[0.15em] text-[var(--c-text-subtle)] mb-0">Horarios de Servicio</h3>
            <label className="flex items-center gap-2 cursor-pointer group">
              <span className="text-[10px] font-bold text-[var(--c-text-muted)] uppercase tracking-wider group-hover:text-oxxo-red transition-colors">Abierto 24 Horas</span>
              <div 
                className={`relative w-9 h-5 rounded-full transition-all ${form.isOpen24h ? 'bg-oxxo-red' : 'bg-[var(--c-border)]'}`}
                onClick={(e) => { e.preventDefault(); toggleOpen24h(); }}
              >
                <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${form.isOpen24h ? 'translate-x-4' : ''}`} />
              </div>
            </label>
          </div>
          
          {!form.isOpen24h && (
            <div className="bg-[var(--c-surface-2)] rounded-2xl p-4 space-y-3 border border-[var(--c-border)] shadow-inner">
              {Object.entries(DAY_LABELS).map(([key, label], idx) => (
                <div key={key} className="flex items-center gap-3">
                  <span className="text-[10px] font-black w-14 text-[var(--c-text-muted)] uppercase">{label}</span>
                  <input
                    className="flex-1 bg-[var(--c-surface)] border border-[var(--c-border)] rounded-xl px-3 py-2 text-xs font-bold font-mono focus:outline-none focus:ring-2 focus:ring-oxxo-red/20 text-[var(--c-text)]"
                    value={form.hours?.[key as keyof StoreHours] ?? ''}
                    onChange={(e) =>
                      set('hours', { ...(form.hours ?? DEFAULT_HOURS), [key]: e.target.value })
                    }
                    placeholder="07:00 - 23:00"
                  />
                </div>
              ))}
            </div>
          )}
        </motion.section>

        {/* Services */}
        <motion.section variants={sectionVariants} initial="hidden" animate="visible" transition={{ delay: 0.5 }}>
          <h3 className={sectionTitleCls}>Servicios y Beneficios</h3>
          <div className="grid grid-cols-2 gap-2">
            {AVAILABLE_SERVICES.map(({ name, icon: Icon }) => {
              const active = (form.services ?? []).includes(name);
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => toggleService(name)}
                  className={`flex items-center gap-2.5 px-3 py-3 rounded-xl border-2 font-bold text-[10px] uppercase tracking-wide transition-all ${
                    active
                      ? 'bg-oxxo-red text-white border-oxxo-red shadow-lg shadow-oxxo-red/10'
                      : 'border-[var(--c-border)] text-[var(--c-text-muted)] bg-[var(--c-surface)] hover:border-[var(--c-text-subtle)]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="truncate">{name}</span>
                </button>
              );
            })}
          </div>
        </motion.section>

        {/* Status toggle */}
        <motion.section variants={sectionVariants} initial="hidden" animate="visible" transition={{ delay: 0.6 }} className="pb-4">
          <div 
            onClick={() => set('active', !form.active)}
            className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-4 ${
              form.active 
                ? 'border-emerald-500/20 bg-emerald-500/5' 
                : 'border-[var(--c-border)] bg-[var(--c-surface-2)] grayscale'
            }`}
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${form.active ? 'bg-emerald-500 text-white' : 'bg-[var(--c-text-subtle)] text-white'}`}>
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <p className="font-black text-sm text-[var(--c-text)]">{form.active ? 'Sucursal Activa' : 'Sucursal Inactiva'}</p>
              <p className="text-[10px] font-bold text-[var(--c-text-muted)] uppercase tracking-tight">
                {form.active ? 'Visible actualmente para todos los usuarios' : 'Oculta temporalmente de la aplicación'}
              </p>
            </div>
            <div className={`w-10 h-6 rounded-full transition-colors relative ${form.active ? 'bg-emerald-500' : 'bg-[var(--c-text-subtle)]'}`}>
              <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.active ? 'translate-x-4' : ''}`} />
            </div>
          </div>
        </motion.section>
      </div>

      {/* Footer sticky buttons */}
      <div className="flex gap-4 px-6 py-5 border-t border-[var(--c-border)] bg-[var(--c-surface)] sticky bottom-0 z-20">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-4 bg-[var(--c-surface-2)] text-[var(--c-text)] rounded-2xl text-xs font-black uppercase tracking-[0.15em] transition-all hover:bg-[var(--c-border)]"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex-[1.5] py-4 bg-oxxo-red text-white rounded-2xl text-xs font-black uppercase tracking-[0.15em] disabled:opacity-60 transition-all shadow-xl shadow-oxxo-red/30 flex items-center justify-center gap-2"
        >
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          {store ? 'Guardar Cambios' : 'Crear Sucursal'}
        </button>
      </div>
    </form>
  );
}
