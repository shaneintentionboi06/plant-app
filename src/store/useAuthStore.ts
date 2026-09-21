import { create } from 'zustand';

export interface AdoptedPlant {
  id: string;
  name: string;
  species: string;
  adoptedDate: string;
  lastWatered: string;
  waterCadenceDays: number;
  health: 'Thriving' | 'Needs Mist' | 'Ready to Water';
  imageUrl: string;
}

export interface UserProfile {
  name: string;
  email: string;
  tier: string;
  ecoPoints: number;
  nextTierPoints: number;
  adoptedCount: number;
  treesGrown: number;
  avatarUrl: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile;
  adoptedPlants: AdoptedPlant[];
  login: (email: string, pass: string) => boolean;
  register: (name: string, email: string, pass: string) => boolean;
  logout: () => void;
  waterAdoptedPlant: (plantId: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: true, // Defaults to authenticated member matching the Stitch desktop mockup
  user: {
    name: 'Emma Green',
    email: 'emma.green@botanical.atelier',
    tier: 'Level 3 Steward',
    ecoPoints: 320,
    nextTierPoints: 500,
    adoptedCount: 3,
    treesGrown: 4,
    avatarUrl: 'https://lh3.googleusercontent.com/aida/AEtjO1XjllxOCTz0zOu9GQ9Mfm8UBBj9FYSfbqX_eKUvFeLTPtR47yghGBmdaEWQehiDhpEpVSuhKWFjTSQun5RSyl5_LOX8YT47jORaPjhFXBzelVfd8SKyIf_F-ZcIqv9biGHbSL7hG5VpCjU7susVOgiJPCToA8LfoyR_iBEMdVdJLLupImG1CsXLw5ysGkakyONG82LUJYm_F0bGdBqDf9DsS6GJr--NUs0PbopWCedLRAFqEv_oijNuF7oy',
  },
  adoptedPlants: [
    {
      id: 'ap-1',
      name: 'Monty',
      species: 'Monstera Deliciosa',
      adoptedDate: 'May 14, 2025',
      lastWatered: 'Yesterday',
      waterCadenceDays: 7,
      health: 'Thriving',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFR_0KrqCEHpXlMjb8y6jGPvxoBhy-1IXOfRG2YxAyeNzKkdJbLSAKy_P0IKYnAmcAIQqxkTuxTxdpvwKX6IsBdKNBfa-rBIvgmnxZB43Fo9no5dYVKDRGEK75mUtjUnZ5Jg9zNHh4TAvrb0u-Yira5B-YWRDFKov7CuTNhjtlRSD-aQeilKWy_EYDE8GBraA7JgNaH8pXsoYZC9opsZ5B_D2qBVfF9yWm5VHAZ4J0yNXNIQAViia4gw',
    },
    {
      id: 'ap-2',
      name: 'Staghorn Plaque',
      species: 'Platycerium bifurcatum',
      adoptedDate: 'July 2, 2025',
      lastWatered: '3 days ago',
      waterCadenceDays: 6,
      health: 'Needs Mist',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAVlC-rBsoPnzqxAfKEEJnSjXMrSnS0lWnizQs-k95mYzjIiPRjSIbeRnm7493pznvpum46jVJqC4JZJ6StorFbBAlsQxsFb6QM9ICuVR2LIYyRQ9FiwRz16OpI7Gecs3AtAchIT1SSeyJHu5v2VrqH05b3GWjtenzt1Ay3KKOVw7CLX104ihwxuVP1gFs-RIXMsnhGws19CVzbkowuYuD8tPLmsT7UHt4IjoAP0NNgSSzUN-n_1l_xMw',
    },
    {
      id: 'ap-3',
      name: 'Olive Hearth',
      species: 'Olea Europaea',
      adoptedDate: 'August 19, 2025',
      lastWatered: '5 days ago',
      waterCadenceDays: 12,
      health: 'Ready to Water',
      imageUrl: 'https://images.unsplash.com/photo-1512428813834-c702c7702b78?auto=format&fit=crop&w=800&q=80',
    },
  ],

  login: (email, _pass) => {
    set({
      isAuthenticated: true,
      user: {
        name: email.split('@')[0].replace('.', ' ') || 'Emma Green',
        email,
        tier: 'Level 3 Steward',
        ecoPoints: 320,
        nextTierPoints: 500,
        adoptedCount: 3,
        treesGrown: 4,
        avatarUrl: 'https://lh3.googleusercontent.com/aida/AEtjO1XjllxOCTz0zOu9GQ9Mfm8UBBj9FYSfbqX_eKUvFeLTPtR47yghGBmdaEWQehiDhpEpVSuhKWFjTSQun5RSyl5_LOX8YT47jORaPjhFXBzelVfd8SKyIf_F-ZcIqv9biGHbSL7hG5VpCjU7susVOgiJPCToA8LfoyR_iBEMdVdJLLupImG1CsXLw5ysGkakyONG82LUJYm_F0bGdBqDf9DsS6GJr--NUs0PbopWCedLRAFqEv_oijNuF7oy',
      },
    });
    return true;
  },

  register: (name, email, _pass) => {
    set({
      isAuthenticated: true,
      user: {
        name: name || 'New Steward',
        email,
        tier: 'Level 1 Seedling',
        ecoPoints: 50,
        nextTierPoints: 200,
        adoptedCount: 0,
        treesGrown: 1,
        avatarUrl: 'https://lh3.googleusercontent.com/aida/AEtjO1XjllxOCTz0zOu9GQ9Mfm8UBBj9FYSfbqX_eKUvFeLTPtR47yghGBmdaEWQehiDhpEpVSuhKWFjTSQun5RSyl5_LOX8YT47jORaPjhFXBzelVfd8SKyIf_F-ZcIqv9biGHbSL7hG5VpCjU7susVOgiJPCToA8LfoyR_iBEMdVdJLLupImG1CsXLw5ysGkakyONG82LUJYm_F0bGdBqDf9DsS6GJr--NUs0PbopWCedLRAFqEv_oijNuF7oy',
      },
      adoptedPlants: [],
    });
    return true;
  },

  logout: () => {
    set({
      isAuthenticated: false,
    });
  },

  waterAdoptedPlant: (plantId) => {
    set((state) => ({
      adoptedPlants: state.adoptedPlants.map((p) =>
        p.id === plantId
          ? { ...p, lastWatered: 'Just now', health: 'Thriving' }
          : p
      ),
      user: {
        ...state.user,
        ecoPoints: state.user.ecoPoints + 15,
      },
    }));
  },
}));
