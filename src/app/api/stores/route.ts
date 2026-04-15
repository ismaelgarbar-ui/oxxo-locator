import { NextRequest, NextResponse } from 'next/server';
import { readStores, writeStores, generateId } from '@/lib/stores';
import { Store } from '@/types/store';

export async function GET() {
  try {
    const stores = readStores();
    return NextResponse.json(stores);
  } catch {
    return NextResponse.json({ error: 'Error al leer sucursales' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Omit<Store, 'id'>;
    const stores = readStores();
    const newStore: Store = { id: generateId(stores), ...body };
    stores.push(newStore);
    writeStores(stores);
    return NextResponse.json(newStore, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Error al crear sucursal' }, { status: 500 });
  }
}
