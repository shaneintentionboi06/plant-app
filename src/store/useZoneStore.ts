import { create } from 'zustand';
import { USDA_ZONES } from '../data/plants';

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
  currentZone: '10a',
  currentCity: 'San Francisco, CA',
  currentZip: '94103',
  isZonePickerOpen: false,

  setZone: (zone, city, zip) =>
    set({ currentZone: zone, currentCity: city, currentZip: zip, isZonePickerOpen: false }),

  openZonePicker: () => set({ isZonePickerOpen: true }),
  closeZonePicker: () => set({ isZonePickerOpen: false }),
}));
