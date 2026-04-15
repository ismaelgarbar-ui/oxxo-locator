import { NextRequest, NextResponse } from 'next/server';
import { readStores, writeStores } from '@/lib/stores';
import { Store } from '@/types/store';

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const store = readStores().find((s) => s.id === id);
  if (!store) return NextResponse.json({ error: 'No encontrada' }, { status: 404 });
  return NextResponse.json(store);
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = (await req.json()) as Partial<Store>;
    const stores = readStores();
    const idx = stores.findIndex((s) => s.id === id);
    if (idx === -1) return NextResponse.json({ error: 'No encontrada' }, { status: 404 });
    stores[idx] = { ...stores[idx], ...body, id };
    writeStores(stores);
    return NextResponse.json(stores[idx]);
  } catch {
    return NextResponse.json({ error: 'Error al actualizar sucursal' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const stores = readStores();
    const idx = stores.findIndex((s) => s.id === id);
    if (idx === -1) return NextResponse.json({ error: 'No encontrada' }, { status: 404 });
    const [removed] = stores.splice(idx, 1);
    writeStores(stores);
    return NextResponse.json(removed);
  } catch {
    return NextResponse.json({ error: 'Error al eliminar sucursal' }, { status: 500 });
  }
}
