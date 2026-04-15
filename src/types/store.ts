export interface StoreHours {
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
  [key: string]: string;
}

export interface Store {
  id: string;
  name: string;
  address: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  lat: number;
  lng: number;
  phone?: string;
  hours: StoreHours;
  services: string[];
  isOpen24h: boolean;
  active: boolean;
}

export interface StoreWithDistance extends Store {
  distance?: number; // km
}
