// API Service Layer - Botanical Living
// Provides typed asynchronous endpoints conforming to the REST API specification
// Supports connection to live remote backend or dynamic in-memory seed service

import { PLANTS_DATA, USDA_ZONES, PlantSpecimen } from '../data/plants';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || '';
const CHATBOT_BASE_URL = process.env.EXPO_PUBLIC_CHATBOT_URL || '';

export interface PlantFilterParams {
  category?: string;
  light?: string;
  petFriendly?: boolean;
  airPurifying?: boolean;
  easyCare?: boolean;
  maxPrice?: number;
  sort?: string;
  page?: number;
  limit?: number;
}

export const ApiService = {
  // 1. Botanical Catalog
  getPlants: async (filters?: PlantFilterParams): Promise<PlantSpecimen[]> => {
    if (API_BASE_URL) {
      try {
        const query = new URLSearchParams(filters as any).toString();
        const res = await fetch(`${API_BASE_URL}/api/v1/plants?${query}`);
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('API fetch failed, falling back to local dataset:', err);
      }
    }

    // Dynamic mock engine
    let results = [...PLANTS_DATA];

    if (filters?.category && filters.category !== 'all') {
      if (filters.category === 'low-light') results = results.filter((p) => p.lowLight);
      if (filters.category === 'pet-friendly') results = results.filter((p) => p.petSafe);
      if (filters.category === 'air-purifying') results = results.filter((p) => p.airPurifying);
      if (filters.category === 'easy-care') results = results.filter((p) => p.easyCare);
      if (filters.category === 'under-35') results = results.filter((p) => p.price <= 35);
      if (filters.category === 'trees') results = results.filter((p) => p.tree);
    }

    if (filters?.maxPrice) {
      results = results.filter((p) => p.price <= filters.maxPrice!);
    }

    return results;
  },

  getPlantById: async (id: string): Promise<PlantSpecimen | undefined> => {
    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/plants/${id}`);
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('API fetch failed, falling back to local dataset:', err);
      }
    }
    return PLANTS_DATA.find((p) => p.id === id);
  },

  // 2. Zone Recommendations
  getZoneRecommendations: async (zoneCode: string): Promise<PlantSpecimen[]> => {
    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/zones/recommendations?zone=${zoneCode}`);
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('API zone fetch failed, falling back to local dataset:', err);
      }
    }

    // Sort by zone match percentage
    return [...PLANTS_DATA].sort((a, b) => {
      const matchA = a.zoneMatchPercent[zoneCode] || 80;
      const matchB = b.zoneMatchPercent[zoneCode] || 80;
      return matchB - matchA;
    });
  },

  // 3. Location Lookup
  lookupLocation: async (query: string) => {
    const q = query.trim().toLowerCase();
    const match = USDA_ZONES.find(
      (z) => z.zip.includes(q) || z.city.toLowerCase().includes(q) || z.zone.toLowerCase() === q
    );
    return match || USDA_ZONES[0];
  },

  // 4. Planty Chatbot
  sendChatMessage: async (message: string): Promise<string> => {
    if (!CHATBOT_BASE_URL) {
      throw new Error('Chatbot is not configured (EXPO_PUBLIC_CHATBOT_URL missing).');
    }
    const res = await fetch(`${CHATBOT_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
    if (!res.ok) {
      throw new Error(`Chatbot request failed with status ${res.status}`);
    }
    const data = await res.json();
    return data.reply || "Sorry, I could not generate a response.";
  },

  getChatbotHealth: async (): Promise<boolean> => {
    if (!CHATBOT_BASE_URL) return false;
    try {
      const res = await fetch(`${CHATBOT_BASE_URL}/health`);
      if (!res.ok) return false;
      const data = await res.json();
      return data.ollama === true;
    } catch {
      return false;
    }
  },
};
