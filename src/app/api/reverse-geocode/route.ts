import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const lat = req.nextUrl.searchParams.get('lat');
  const lng = req.nextUrl.searchParams.get('lng');
  if (!lat || !lng) return NextResponse.json({ error: 'lat y lng requeridos' }, { status: 400 });

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) return NextResponse.json({ error: 'API key no configurada' }, { status: 500 });

  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&region=mx&language=es&key=${apiKey}`;
  const res  = await fetch(url);
  const data = await res.json();

  if (data.status !== 'OK' || !data.results?.length) {
    return NextResponse.json({ error: 'Sin resultados' }, { status: 404 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const comps: any[] = data.results[0].address_components;
  const get = (type: string) => comps.find((c) => c.types.includes(type))?.long_name ?? '';

  return NextResponse.json({
    formatted:    data.results[0].formatted_address,
    address:      `${get('route')} ${get('street_number')}`.trim(),
    neighborhood: get('sublocality_level_1') || get('neighborhood') || get('sublocality'),
    city:         get('locality') || get('administrative_area_level_3') || get('administrative_area_level_2'),
    state:        get('administrative_area_level_1'),
    zipCode:      get('postal_code'),
    lat:          parseFloat(lat),
    lng:          parseFloat(lng),
  });
}
