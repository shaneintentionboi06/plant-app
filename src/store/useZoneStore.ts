import { create } from 'zustand';

interface ZoneState {
  currentZone: string;
  currentCity: string;
  currentZip: string;
  isZonePickerOpen: boolean;

  setZone: (zone: string, city: string, zip: string) => void;
  openZonePicker: () => void;
  closeZonePicker: () => void;
}

export const useZoneStore = create<ZoneState>((set) => ({
  currentZone: '13a',
  currentCity: 'Mumbai, MH',
  currentZip: '400001',
  isZonePickerOpen: false,

  setZone: (zone, city, zip) =>
    set({ currentZone: zone, currentCity: city, currentZip: zip, isZonePickerOpen: false }),

  openZonePicker: () => set({ isZonePickerOpen: true }),
  closeZonePicker: () => set({ isZonePickerOpen: false }),
}));
