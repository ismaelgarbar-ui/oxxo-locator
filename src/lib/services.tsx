import { CreditCard, Lightbulb, DollarSign, Smartphone, Printer, Package, MapPin } from 'lucide-react';

export const SERVICE_ICONS: Record<string, React.ReactNode> = {
  'ATM':                 <CreditCard className="w-4 h-4" />,
  'Pago de servicios':   <Lightbulb className="w-4 h-4" />,
  'Envío de dinero':     <DollarSign className="w-4 h-4" />,
  'Recarga de celular':  <Smartphone className="w-4 h-4" />,
  'Impresiones':         <Printer className="w-4 h-4" />,
  'Recibo de paquetes':  <Package className="w-4 h-4" />,
};

export const SERVICE_ICONS_SM: Record<string, React.ReactNode> = {
  'ATM':                 <CreditCard className="w-2.5 h-2.5" />,
  'Pago de servicios':   <Lightbulb className="w-2.5 h-2.5" />,
  'Envío de dinero':     <DollarSign className="w-2.5 h-2.5" />,
  'Recarga de celular':  <Smartphone className="w-2.5 h-2.5" />,
  'Impresiones':         <Printer className="w-2.5 h-2.5" />,
  'Recibo de paquetes':  <Package className="w-2.5 h-2.5" />,
};

export function getServiceIcon(service: string, size: 'sm' | 'md' = 'md'): React.ReactNode {
  const map = size === 'sm' ? SERVICE_ICONS_SM : SERVICE_ICONS;
  return map[service] ?? (size === 'sm' ? <MapPin className="w-2.5 h-2.5" /> : <MapPin className="w-4 h-4" />);
}
