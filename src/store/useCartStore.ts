import { create } from 'zustand';
import { PlantSpecimen } from '../data/plants';

export interface CartItem {
  id: string; // unique cart line item id
  plantId: string;
  plant: PlantSpecimen;
  sizeId: string;
  sizeName: string;
  vesselId: string;
  vesselName: string;
  vesselColor: string;
  drainage: boolean;
  unitPrice: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  promoCode: string | null;
  discountPercent: number;
  promoError: string | null;

  addItem: (
    plant: PlantSpecimen,
    sizeId: string,
    vesselId: string,
    drainage?: boolean,
    quantity?: number
  ) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  applyPromo: (code: string) => boolean;
  removePromo: () => void;

  getSubtotal: () => number;
  getDiscount: () => number;
  getShippingFee: () => number;
  getAmountToFreeShipping: () => number;
  getShippingProgress: () => number;
  getTotal: () => number;
  getItemCount: () => number;
}

export const FREE_SHIPPING_THRESHOLD = 2999;
export const STANDARD_SHIPPING_FEE = 149;
export const GST_RATE = 0.18; // 18% Indian GST

export const useCartStore = create<CartState>((set, get) => ({
  // Initialize with the 2 items from the Stitch cart mockup!
  items: [],
  promoCode: null,
  discountPercent: 0,
  promoError: null,

  addItem: (plant, sizeId, vesselId, drainage = true, quantity = 1) => {
    const size = plant.sizes.find((s) => s.id === sizeId) || plant.sizes[0];
    const vessel = plant.vessels.find((v) => v.id === vesselId) || plant.vessels[0];
    const unitPrice = plant.price + (size?.priceDelta || 0) + (vessel?.priceDelta || 0);

    const lineId = `${plant.id}-${size?.id}-${vessel?.id}-${drainage ? 'drain' : 'nodrain'}`;

    set((state) => {
      const existing = state.items.find((item) => item.id === lineId);
      if (existing) {
        return {
          items: state.items.map((item) =>
            item.id === lineId ? { ...item, quantity: item.quantity + quantity } : item
          ),
        };
      } else {
        return {
          items: [
            ...state.items,
            {
              id: lineId,
              plantId: plant.id,
              plant,
              sizeId: size?.id || 'default',
              sizeName: size?.name || 'Standard',
              vesselId: vessel?.id || 'default',
              vesselName: vessel?.name || 'Standard Pot',
              vesselColor: vessel?.colorHex || '#74c69d',
              drainage,
              unitPrice,
              quantity,
            },
          ],
        };
      }
    });
  },

  updateQuantity: (itemId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(itemId);
      return;
    }
    set((state) => ({
      items: state.items.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      ),
    }));
  },

  removeItem: (itemId) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== itemId),
    }));
  },

  clearCart: () => {
    set({ items: [], promoCode: null, discountPercent: 0, promoError: null });
  },

  applyPromo: (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'SPRING20' || cleanCode === 'BOTANICAL20') {
      set({ promoCode: cleanCode, discountPercent: 0.20, promoError: null });
      return true;
    } else if (cleanCode === 'GREEN10') {
      set({ promoCode: cleanCode, discountPercent: 0.10, promoError: null });
      return true;
    } else {
      set({ promoError: 'Invalid promo code. Try "SPRING20" for 20% off.' });
      return false;
    }
  },

  removePromo: () => {
    set({ promoCode: null, discountPercent: 0, promoError: null });
  },

  getSubtotal: () => {
    return get().items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  },

  getDiscount: () => {
    const subtotal = get().getSubtotal();
    return subtotal * get().discountPercent;
  },

  getShippingFee: () => {
    const subtotal = get().getSubtotal();
    if (subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD) {
      return 0.00;
    }
    return STANDARD_SHIPPING_FEE;
  },

  getAmountToFreeShipping: () => {
    const subtotal = get().getSubtotal();
    return Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  },

  getShippingProgress: () => {
    const subtotal = get().getSubtotal();
    return Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  },

  getTotal: () => {
    const subtotal = get().getSubtotal();
    const discount = get().getDiscount();
    const shipping = get().getShippingFee();
    const tax = (subtotal - discount) * GST_RATE; // 18% Indian GST
    return Math.max(0, subtotal - discount + shipping + tax);
  },

  getItemCount: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },
}));
