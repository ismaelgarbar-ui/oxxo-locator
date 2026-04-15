import fs from 'fs';
import path from 'path';
import { Store } from '@/types/store';

const DATA_FILE = path.join(process.cwd(), 'data', 'stores.json');

export function readStores(): Store[] {
  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(raw) as Store[];
}

export function writeStores(stores: Store[]): void {
  fs.writeFileSync(DATA_FILE, JSON.stringify(stores, null, 2), 'utf-8');
}

export function findStoreById(id: string): Store | undefined {
  return readStores().find((s) => s.id === id);
}

/** Generate a simple sequential ID */
export function generateId(stores: Store[]): string {
  const max = stores
    .map((s) => parseInt(s.id.replace('oxxo-', ''), 10))
    .filter(Number.isFinite)
    .reduce((a, b) => Math.max(a, b), 0);
  return `oxxo-${String(max + 1).padStart(3, '0')}`;
}
