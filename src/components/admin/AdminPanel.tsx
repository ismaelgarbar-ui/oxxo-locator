'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Store } from '@/types/store';
import { isCurrentlyOpen } from '@/lib/geo';
import StoreForm from './StoreForm';
import OxxoLogo from '../OxxoLogo';
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  ChevronLeft,
  AlertTriangle,
  LayoutDashboard,
  ExternalLink,
  Loader2,
} from 'lucide-react';

type Filter = 'all' | 'active' | 'inactive';

export default function AdminPanel() {
  const [stores, setStores] = useState<Store[]>([]);
  const [filter, setFilter] = useState<Filter>('all');
  const [search, setSearch] = useState('');
  const [editingStore, setEditingStore] = useState<Store | null | undefined>(undefined);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/stores');
      setStores(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = stores.filter((s) => {
    const matchFilter = filter === 'all' || (filter === 'active' ? s.active : !s.active);
    const matchSearch =
      search === '' ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.address.toLowerCase().includes(search.toLowerCase()) ||
      s.neighborhood.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const handleSave = async (data: Partial<Store>) => {
    if (editingStore) {
      await fetch(`/api/stores/${editingStore.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      showToast('Sucursal actualizada correctamente.');
    } else {
      await fetch('/api/stores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      showToast('Sucursal creada correctamente.');
    }
    setEditingStore(undefined);
    load();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/stores/${id}`, { method: 'DELETE' });
    setDeleting(null);
    showToast('Sucursal eliminada.');
    load();
  };

  const activeCount = stores.filter((s) => s.active).length;
  const inactiveCount = stores.length - activeCount;

  if (editingStore !== undefined) {
    return (
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="h-full flex flex-col bg-[var(--c-bg)]"
      >
        <StoreForm
          store={editingStore}
          onSave={handleSave}
          onCancel={() => setEditingStore(undefined)}
        />
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[var(--c-bg)] text-[var(--c-text)]">
      {/* Premium Header */}
      <header className="px-6 py-6 border-b border-[var(--c-border)] bg-[var(--c-surface)]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <OxxoLogo size="sm" variant="icon" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--c-text-subtle)]">Panel Administrativo</p>
              <h1 className="text-xl font-black">Gestión de Sucursales</h1>
            </div>
          </div>
          <motion.a
            whileHover={{ x: 2 }}
            href="/"
            className="flex items-center gap-1.5 text-xs font-bold text-oxxo-red px-3 py-1.5 rounded-full bg-oxxo-red/5 border border-oxxo-red/20 transition-colors"
          >
            Ver App <ExternalLink className="w-3 h-3" />
          </motion.a>
        </div>

        {/* Premium Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Total', value: stores.length, color: 'text-oxxo-red', bg: 'bg-oxxo-red/5' },
            { label: 'Activas', value: activeCount, color: 'text-emerald-500', bg: 'bg-emerald-500/5' },
            { label: 'Inactivas', value: inactiveCount, color: 'text-[var(--c-text-subtle)]', bg: 'bg-[var(--c-surface-2)]' },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`${s.bg} rounded-2xl p-3 border border-[var(--c-border)]`}
            >
              <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--c-text-muted)]">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </header>

      {/* Modern Toolbar */}
      <div className="px-4 py-4 bg-[var(--c-surface)] border-b border-[var(--c-border)] space-y-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--c-text-subtle)]" />
            <input
              type="search"
              placeholder="Buscar por nombre o dirección…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[var(--c-surface-2)] border border-[var(--c-border)] rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-oxxo-red/20 focus:border-oxxo-red/40 transition-all"
            />
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setEditingStore(null)}
            className="flex items-center justify-center w-11 h-11 bg-oxxo-red text-white rounded-2xl shadow-lg shadow-oxxo-red/20"
          >
            <Plus className="w-5 h-5" />
          </motion.button>
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {(['all', 'active', 'inactive'] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${
                filter === f
                  ? 'bg-oxxo-dark text-white border-oxxo-dark dark:bg-white dark:text-black dark:border-white'
                  : 'bg-[var(--c-surface)] text-[var(--c-text-muted)] border-[var(--c-border)]'
              }`}
            >
              {f === 'all' ? 'Todas' : f === 'active' ? 'Activas' : 'Inactivas'}
            </button>
          ))}
        </div>
      </div>

      {/* Animated Store List */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-oxxo-red" />
            <p className="text-sm font-medium text-[var(--c-text-muted)]">Cargando datos…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 px-10">
            <div className="w-16 h-16 bg-[var(--c-surface-2)] rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-7 h-7 text-[var(--c-text-subtle)]" />
            </div>
            <p className="font-bold text-[var(--c-text)]">No se encontraron sucursales</p>
            <p className="text-sm text-[var(--c-text-muted)] mt-1">Intenta con otros términos o filtros.</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filtered.map((store, i) => {
              const open = isCurrentlyOpen(store.hours as Record<string, string>, store.isOpen24h);
              return (
                <motion.div
                  layout
                  key={store.id}
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: Math.min(i * 0.05, 0.3) }}
                  className="bg-[var(--c-surface)] rounded-2xl border border-[var(--c-border)] shadow-sm overflow-hidden"
                >
                  <div className="px-4 py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          <h3 className="font-black text-[var(--c-text)] text-sm">{store.name}</h3>
                          <div className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            store.active 
                              ? 'bg-emerald-500/10 text-emerald-600' 
                              : 'bg-red-500/10 text-red-500'
                          }`}>
                            {store.active ? 'Activa' : 'Inactiva'}
                          </div>
                   
                          <div className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            store.isOpen24h || open
                              ? 'bg-oxxo-red/10 text-oxxo-red'
                              : 'bg-[var(--c-surface-2)] text-[var(--c-text-subtle)]'
                          }`}>
                            {store.isOpen24h ? '24 HORAS' : open ? 'ABIERTO' : 'CERRADO'}
                          </div>
                        </div>

                        <div className="flex items-start gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-oxxo-red flex-shrink-0 mt-0.5" />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-[var(--c-text-muted)] truncate">
                              {store.address}
                            </p>
                            <p className="text-[10px] font-medium text-[var(--c-text-subtle)]">
                              {store.neighborhood}, {store.city}
                            </p>
                          </div>
                        </div>

                        {store.services.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-3">
                            {store.services.map((s) => (
                              <span
                                key={s}
                                className="text-[9px] font-bold bg-[var(--c-surface-2)] text-[var(--c-text-muted)] px-1.5 py-0.5 rounded-md border border-[var(--c-border)] uppercase tracking-tight"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2 flex-shrink-0">
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setEditingStore(store)}
                          className="w-9 h-9 flex items-center justify-center rounded-xl bg-[var(--c-surface-2)] text-[var(--c-text-muted)] hover:bg-oxxo-red hover:text-white transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setDeleting(store.id)}
                          className="w-9 h-9 flex items-center justify-center rounded-xl bg-[var(--c-surface-2)] text-[var(--c-text-muted)] hover:bg-red-500 hover:text-white transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>

      {/* Delete confirmation dialog */}
      <AnimatePresence>
        {deleting && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-end justify-center z-50 p-4"
          >
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="bg-[var(--c-surface)] rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-[var(--c-border)]"
            >
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="w-7 h-7 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-[var(--c-text)]">¿Eliminar sucursal?</h3>
                  <p className="text-sm text-[var(--c-text-muted)] mt-1">
                    Esta acción es permanente y no se podrá recuperar la información de la sucursal.
                  </p>
                </div>
              </div>
              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => setDeleting(null)}
                  className="flex-1 py-3 bg-[var(--c-surface-2)] text-[var(--c-text)] rounded-2xl text-sm font-bold transition-colors hover:bg-[var(--c-border)]"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleDelete(deleting)}
                  className="flex-1 py-3 bg-red-600 text-white rounded-2xl text-sm font-bold shadow-lg shadow-red-200"
                >
                  Eliminar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute bottom-10 left-6 right-6 bg-oxxo-dark text-white text-xs font-bold px-5 py-3.5 rounded-2xl shadow-2xl flex items-center justify-center gap-2 z-[60] dark:bg-white dark:text-black"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
