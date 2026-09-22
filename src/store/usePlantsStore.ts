import { create } from 'zustand';
import { ApiService } from '../services/api';
import { PLANTS_DATA, PlantSpecimen } from '../data/plants';

interface PlantsState {
  plants: PlantSpecimen[];
  isLoading: boolean;
  error: string | null;
  hasFetched: boolean;

  fetchPlants: () => Promise<void>;
}

// Seeded with the local mock catalog so screens render instantly; fetchPlants
// swaps in live data from the backend when available, falling back to the
// same mock (ApiService already does this internally too) if it isn't.
export const usePlantsStore = create<PlantsState>((set, get) => ({
  plants: PLANTS_DATA,
  isLoading: false,
  error: null,
  hasFetched: false,

  fetchPlants: async () => {
    if (get().hasFetched || get().isLoading) return;
    set({ isLoading: true, error: null });
    try {
      const plants = await ApiService.getPlants();
      set({ plants: plants.length > 0 ? plants : PLANTS_DATA, isLoading: false, hasFetched: true });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false, hasFetched: true });
    }
  },
}));
