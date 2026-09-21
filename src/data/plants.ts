// Botanical Living - Curated Plant Dataset
// Contains high-res botanical photography, taxonomic metadata, care specs, and climate zone traits

export interface PlantSpecimen {
  id: string;
  name: string;
  botanicalName: string;
  family: string;
  commonName: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  bestseller?: boolean;
  petSafe: boolean;
  airPurifying: boolean;
  easyCare: boolean;
  lowLight: boolean;
  tree: boolean;
  badge?: string;
  zoneMatchPercent: Record<string, number>; // zone -> percentage (e.g. { '10a': 98, '9b': 92, '5b': 65 })
  climateTag: string;
  description: string;
  imageUrl: string;
  additionalImages: string[];
  care: {
    light: string;
    lightIcon: string; // Ionicons / Material
    watering: string;
    waterFrequency: string;
    humidity: string;
    temperature: string;
    difficulty: 'Beginner' | 'Moderate' | 'Expert';
    difficultyDrops: number;
    toxicity: string;
  };
  sizes: {
    id: string;
    name: string;
    potDiameter: string;
    priceDelta: number;
  }[];
  vessels: {
    id: string;
    name: string;
    colorHex: string;
    priceDelta: number;
  }[];
}

export const PLANTS_DATA: PlantSpecimen[] = [
  {
    id: 'monstera-deliciosa',
    name: 'Monstera Deliciosa',
    botanicalName: 'Monstera deliciosa Liebm.',
    family: 'Araceae Family',
    commonName: 'Swiss Cheese Plant',
    price: 42.00,
    originalPrice: 54.00,
    rating: 4.9,
    reviewCount: 184,
    bestseller: true,
    petSafe: false,
    airPurifying: true,
    easyCare: true,
    lowLight: false,
    tree: false,
    badge: 'Bestseller',
    climateTag: 'Bay Area Coastal Airflow',
    zoneMatchPercent: {
      '10a': 98,
      '9b': 94,
      '8a': 82,
      '5b': 75,
      '11a': 99,
    },
    description: 'Renowned for its dramatic aerial roots and glossy split leaves (fenestrations). Thrives in warm, indirect greenhouse lighting and brings immediate architectural sculpture to interiors.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFR_0KrqCEHpXlMjb8y6jGPvxoBhy-1IXOfRG2YxAyeNzKkdJbLSAKy_P0IKYnAmcAIQqxkTuxTxdpvwKX6IsBdKNBfa-rBIvgmnxZB43Fo9no5dYVKDRGEK75mUtjUnZ5Jg9zNHh4TAvrb0u-Yira5B-YWRDFKov7CuTNhjtlRSD-aQeilKWy_EYDE8GBraA7JgNaH8pXsoYZC9opsZ5B_D2qBVfF9yWm5VHAZ4J0yNXNIQAViia4gw',
    additionalImages: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDbvNFX_YqhUinlaFKL0ufPv6hnvwkFwge9FiySS7fh9C47gNnZ3xYYz9bv3qry3B3pbuxi1Ek9uQw_0e6-uVo_zJPtt1Lk6No2cVO4aV8WaSlYUP6w1QYpef-6zehR2tuSiolLAE52jnjKjwiin3D6heZhdrJ_jqmSLoW04Ox8srAKCYxoZYpLI9mJ9SB8UyD-9Q722zm67J-a8GvOx6BC1rx_ayHh2ZopX9CGmTbCNnp4AkrwcFvXdA',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCwy384c8_0J29L2xVqsXySEs4IJy-QmVdz36nZnuBt1j5SC8wpB39RE9vhDJUA9Jr_Xc9gXCipBAsrG9QxXhzdRqRo8Lfjj0ffCyJ1GaolyO7t3JqKkcjO7iUPnyY0oQakqE9muixtvi7DFDHFKBWt7oF1T3UBU0tGRTST8bAiu2p5b81Pdl91tyZh2cnrHmJxEXxHWBsyKW74vvCDMr1TOMDyBKu7gAKyuSaysC_MVk3illqqb8wPiw',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAKMcq9ZVpN-PMCeUbvnU6GRE213wwGNY_XcyV6qC1m_ZBfALIbcAOunAN7Qnnvfv3-PuhlSPHZBZaaCrmfbsiHEMbfKD2CVuynmnbFGq-bFIHocgSqiUVq1KoPz2kuX3KSrN8LI5JdrtW7jY_H6UJ_dnyKvu1sisq4UkZMOFbfJU0IjEVDFZMsdVWoqE62DAjrlJazITX5B_wM6nQb9JTl7sQtzufUNmvWlrqUL76NcA-44YOIMOqMQQ',
    ],
    care: {
      light: 'Bright, indirect morning sunlight. Avoid harsh scorching afternoon rays.',
      lightIcon: 'sunny',
      watering: 'Allow top 2-3 inches of soil to dry before watering thoroughly.',
      waterFrequency: 'Every 7-10 days',
      humidity: 'Enjoys 55% - 70% humidity. Mist weekly.',
      temperature: '65°F – 85°F (18°C – 30°C)',
      difficulty: 'Beginner',
      difficultyDrops: 1,
      toxicity: 'Mildly toxic if ingested by pets; keep out of reach of curious cats.',
    },
    sizes: [
      { id: 'sm', name: 'Small', potDiameter: '4" Nursery Pot', priceDelta: -10 },
      { id: 'md', name: 'Medium', potDiameter: '6" Matte Pot', priceDelta: 0 },
      { id: 'lg', name: 'Large', potDiameter: '10" Floor Vessel', priceDelta: 24 },
      { id: 'xl', name: 'Extra Large', potDiameter: '14" Statement Planter', priceDelta: 52 },
    ],
    vessels: [
      { id: 'sage', name: 'Matte Sage', colorHex: '#74c69d', priceDelta: 0 },
      { id: 'terracotta', name: 'Warm Terracotta', colorHex: '#c86d51', priceDelta: 4 },
      { id: 'sand', name: 'Sand Ceramic', colorHex: '#d8cfbc', priceDelta: 6 },
      { id: 'linen', name: 'Linen Glaze', colorHex: '#edeae1', priceDelta: 8 },
    ],
  },
  {
    id: 'staghorn-fern',
    name: 'Staghorn Fern',
    botanicalName: 'Platycerium bifurcatum',
    family: 'Polypodiaceae',
    commonName: 'Elkhorn Fern',
    price: 34.00,
    rating: 4.8,
    reviewCount: 92,
    bestseller: false,
    petSafe: true,
    airPurifying: true,
    easyCare: false,
    lowLight: true,
    tree: false,
    badge: '98% Match',
    climateTag: 'Fog & Humidity Lover',
    zoneMatchPercent: {
      '10a': 98,
      '9b': 95,
      '8a': 80,
      '5b': 68,
      '11a': 96,
    },
    description: 'An epiphytic botanical marvel with bifurcated fronds resembling stag antlers. Naturally mounts to cedar plaques or moss kokedama.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAVlC-rBsoPnzqxAfKEEJnSjXMrSnS0lWnizQs-k95mYzjIiPRjSIbeRnm7493pznvpum46jVJqC4JZJ6StorFbBAlsQxsFb6QM9ICuVR2LIYyRQ9FiwRz16OpI7Gecs3AtAchIT1SSeyJHu5v2VrqH05b3GWjtenzt1Ay3KKOVw7CLX104ihwxuVP1gFs-RIXMsnhGws19CVzbkowuYuD8tPLmsT7UHt4IjoAP0NNgSSzUN-n_1l_xMw',
    additionalImages: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAVlC-rBsoPnzqxAfKEEJnSjXMrSnS0lWnizQs-k95mYzjIiPRjSIbeRnm7493pznvpum46jVJqC4JZJ6StorFbBAlsQxsFb6QM9ICuVR2LIYyRQ9FiwRz16OpI7Gecs3AtAchIT1SSeyJHu5v2VrqH05b3GWjtenzt1Ay3KKOVw7CLX104ihwxuVP1gFs-RIXMsnhGws19CVzbkowuYuD8tPLmsT7UHt4IjoAP0NNgSSzUN-n_1l_xMw',
    ],
    care: {
      light: 'Filtered indirect light or gentle dapple shade.',
      lightIcon: 'partly-sunny',
      watering: 'Submerge root ball or mist shield fronds when moss feels dry.',
      waterFrequency: 'Once every 7 days',
      humidity: 'Needs 60%+ humidity.',
      temperature: '60°F – 80°F',
      difficulty: 'Moderate',
      difficultyDrops: 2,
      toxicity: '100% Pet-friendly and non-toxic to cats & dogs.',
    },
    sizes: [
      { id: 'sm', name: 'Mounted 6"', potDiameter: 'Cedar Plaque', priceDelta: 0 },
      { id: 'md', name: 'Mounted 10"', potDiameter: 'Reclaimed Plank', priceDelta: 18 },
    ],
    vessels: [
      { id: 'cedar', name: 'Reclaimed Cedar', colorHex: '#8b5a2b', priceDelta: 0 },
      { id: 'sage-plaque', name: 'Sage Slate', colorHex: '#4a6b57', priceDelta: 6 },
    ],
  },
  {
    id: 'maidenhair-fern',
    name: 'Maidenhair Fern',
    botanicalName: 'Adiantum raddianum',
    family: 'Pteridaceae',
    commonName: 'Delta Maidenhair',
    price: 26.00,
    originalPrice: 32.00,
    rating: 4.7,
    reviewCount: 76,
    bestseller: false,
    petSafe: true,
    airPurifying: true,
    easyCare: false,
    lowLight: true,
    tree: false,
    badge: '96% Match',
    climateTag: 'Cool Breeze Tolerant',
    zoneMatchPercent: {
      '10a': 96,
      '9b': 91,
      '8a': 76,
      '5b': 60,
      '11a': 90,
    },
    description: 'Ethereal emerald fronds on ebony wiry stems. Revels in gentle bathroom humidity and brings delicate organic motion to shaded living areas.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDA7abj6ZRXEeyQXjyMvKR3g3AdG36ePaMsKn-Okn74BSDL01Fly99RflehGBoKLqaIWoQs48l5dW9JXpVwP7HM16X__D67bGAagSyeM0s8yMmUgVrnPpC_PVJQyoOUC7wxEUzKhDx8gId1X9CN5IhZcCX4s8Wah1Xc6kBs05JD7wRzOs16AEQq2I6iEkQygZ44OTcR6dOAZAAkcSscyyfdCr5EMPyvb7Rj1mXVZFr-SlLFGAs89i7-4w',
    additionalImages: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDA7abj6ZRXEeyQXjyMvKR3g3AdG36ePaMsKn-Okn74BSDL01Fly99RflehGBoKLqaIWoQs48l5dW9JXpVwP7HM16X__D67bGAagSyeM0s8yMmUgVrnPpC_PVJQyoOUC7wxEUzKhDx8gId1X9CN5IhZcCX4s8Wah1Xc6kBs05JD7wRzOs16AEQq2I6iEkQygZ44OTcR6dOAZAAkcSscyyfdCr5EMPyvb7Rj1mXVZFr-SlLFGAs89i7-4w',
    ],
    care: {
      light: 'Gentle morning light or low ambient northern exposure.',
      lightIcon: 'cloudy-outline',
      watering: 'Keep soil continuously moist; do not allow roots to dehydrate.',
      waterFrequency: 'Every 3-4 days',
      humidity: 'High (65%+). Excellent for terrariums and bathrooms.',
      temperature: '58°F – 75°F',
      difficulty: 'Expert',
      difficultyDrops: 3,
      toxicity: 'Completely pet safe.',
    },
    sizes: [
      { id: 'sm', name: 'Compact 4"', potDiameter: '4" Ceramic', priceDelta: 0 },
      { id: 'md', name: 'Lush 6"', potDiameter: '6" Terracotta', priceDelta: 12 },
    ],
    vessels: [
      { id: 'terracotta', name: 'Terracotta Saucer', colorHex: '#c86d51', priceDelta: 0 },
      { id: 'sand', name: 'Sand Ceramic', colorHex: '#d8cfbc', priceDelta: 4 },
    ],
  },
  {
    id: 'monstera-adansonii',
    name: 'Monstera Adansonii',
    botanicalName: 'Monstera adansonii Schott',
    family: 'Araceae',
    commonName: 'Swiss Cheese Vine',
    price: 30.00,
    rating: 4.9,
    reviewCount: 115,
    bestseller: true,
    petSafe: false,
    airPurifying: true,
    easyCare: true,
    lowLight: false,
    tree: false,
    badge: '94% Match',
    climateTag: 'Indirect Sun Lover',
    zoneMatchPercent: {
      '10a': 94,
      '9b': 90,
      '8a': 80,
      '5b': 70,
      '11a': 95,
    },
    description: 'A rapid trailing vine featuring oval leaves pierced with symmetrical holes. Cascades gracefully from bookshelves or climbs moss poles.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6DStvkNBTRWzcPmW04dM4QrmeQbMo2FlRRw_wYSUBTXQHKnO3T_UuBJWq4RHBZDeXAG0tckGgHm1tLc3E2T1mFc8qtQYxivjO10s5qKJpK3T6AhoX7UHAU7fanYcTEoW0Cuqrs4lHaNEEMZvUnGNG3diriI1bWGXjuz3qprt0o-7Xa_sLbPZSaW9T0wMCsOfA7GB8Vn12n64EGbzC0M2c0ToPolOo0C2ZTWf-2p0PHYbuumMc87Subw',
    additionalImages: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB6DStvkNBTRWzcPmW04dM4QrmeQbMo2FlRRw_wYSUBTXQHKnO3T_UuBJWq4RHBZDeXAG0tckGgHm1tLc3E2T1mFc8qtQYxivjO10s5qKJpK3T6AhoX7UHAU7fanYcTEoW0Cuqrs4lHaNEEMZvUnGNG3diriI1bWGXjuz3qprt0o-7Xa_sLbPZSaW9T0wMCsOfA7GB8Vn12n64EGbzC0M2c0ToPolOo0C2ZTWf-2p0PHYbuumMc87Subw',
    ],
    care: {
      light: 'Medium to bright indirect sunlight.',
      lightIcon: 'sunny',
      watering: 'Water when top 50% of soil feels dry.',
      waterFrequency: 'Every 7 days',
      humidity: '50% - 65% humidity.',
      temperature: '65°F – 82°F',
      difficulty: 'Beginner',
      difficultyDrops: 1,
      toxicity: 'Mild irritant if consumed by pets.',
    },
    sizes: [
      { id: 'md', name: 'Hanging 6"', potDiameter: '6" Hanging Basket', priceDelta: 0 },
      { id: 'lg', name: 'Climbing 8" (Moss Pole)', potDiameter: '8" Vessel with Pole', priceDelta: 20 },
    ],
    vessels: [
      { id: 'sage', name: 'Matte Sage', colorHex: '#74c69d', priceDelta: 0 },
      { id: 'sand', name: 'Sand Ceramic', colorHex: '#d8cfbc', priceDelta: 5 },
    ],
  },
  {
    id: 'fiddle-leaf-fig',
    name: 'Fiddle Leaf Fig',
    botanicalName: 'Ficus lyrata',
    family: 'Moraceae',
    commonName: 'Fiddle-leaf Fig Tree',
    price: 68.00,
    originalPrice: 85.00,
    rating: 4.8,
    reviewCount: 142,
    bestseller: false,
    petSafe: false,
    airPurifying: true,
    easyCare: false,
    lowLight: false,
    tree: true,
    badge: 'Curator Pick',
    climateTag: 'Bright Sun Sanctuary',
    zoneMatchPercent: {
      '10a': 88,
      '9b': 85,
      '8a': 75,
      '5b': 65,
      '11a': 94,
    },
    description: 'Towering violin-shaped foliage that anchors living spaces with commanding presence. Loves bright sunny windows.',
    imageUrl: 'https://images.unsplash.com/photo-1597055181300-e3633a917c9c?auto=format&fit=crop&w=800&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1597055181300-e3633a917c9c?auto=format&fit=crop&w=800&q=80',
    ],
    care: {
      light: 'Consistent bright filtered light with 3-4 hours direct sun.',
      lightIcon: 'sunny',
      watering: 'Deep soaking when top 2 inches dry out. Good drainage is key.',
      waterFrequency: 'Every 8-10 days',
      humidity: 'Moderate 50%+',
      temperature: '65°F – 78°F',
      difficulty: 'Moderate',
      difficultyDrops: 2,
      toxicity: 'Toxic to dogs and cats.',
    },
    sizes: [
      { id: 'lg', name: 'Floor Plant (3-4 ft)', potDiameter: '10" Planter', priceDelta: 0 },
      { id: 'xl', name: 'Specimen Tree (5-6 ft)', potDiameter: '14" Estate Planter', priceDelta: 45 },
    ],
    vessels: [
      { id: 'sand', name: 'Sand Ceramic', colorHex: '#d8cfbc', priceDelta: 0 },
      { id: 'terracotta', name: 'Terracotta', colorHex: '#c86d51', priceDelta: 10 },
      { id: 'sage', name: 'Matte Sage', colorHex: '#74c69d', priceDelta: 12 },
    ],
  },
  {
    id: 'calathea-orbifolia',
    name: 'Calathea Orbifolia',
    botanicalName: 'Goeppertia orbifolia',
    family: 'Marantaceae',
    commonName: 'Prayer Plant',
    price: 38.00,
    rating: 4.9,
    reviewCount: 98,
    bestseller: false,
    petSafe: true,
    airPurifying: true,
    easyCare: false,
    lowLight: true,
    tree: false,
    badge: '100% Pet Safe',
    climateTag: 'Gentle Humidity Oasis',
    zoneMatchPercent: {
      '10a': 92,
      '9b': 89,
      '8a': 78,
      '5b': 70,
      '11a': 93,
    },
    description: 'Expansive circular leaves patterned with silver-metallic brushstrokes. Leaves fold upwards at dusk in natural rhythmic prayer.',
    imageUrl: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80',
    ],
    care: {
      light: 'Medium indirect light; keep away from harsh sunlight to avoid leaf scorching.',
      lightIcon: 'partly-sunny',
      watering: 'Use rainwater or filtered water to avoid tip browning.',
      waterFrequency: 'Every 5-7 days',
      humidity: 'High 60%-75%',
      temperature: '65°F – 80°F',
      difficulty: 'Moderate',
      difficultyDrops: 2,
      toxicity: 'Completely pet safe and non-toxic.',
    },
    sizes: [
      { id: 'md', name: 'Medium 6"', potDiameter: '6" Ceramic', priceDelta: 0 },
      { id: 'lg', name: 'Full 8"', potDiameter: '8" Cylinder Vessel', priceDelta: 16 },
    ],
    vessels: [
      { id: 'linen', name: 'Linen Glaze', colorHex: '#edeae1', priceDelta: 0 },
      { id: 'sage', name: 'Matte Sage', colorHex: '#74c69d', priceDelta: 5 },
    ],
  },
  {
    id: 'sansevieria-laurentii',
    name: 'Snake Plant Laurentii',
    botanicalName: 'Dracaena trifasciata',
    family: 'Asparagaceae',
    commonName: 'Mother-in-Law’s Tongue',
    price: 32.00,
    rating: 5.0,
    reviewCount: 230,
    bestseller: true,
    petSafe: false,
    airPurifying: true,
    easyCare: true,
    lowLight: true,
    tree: false,
    badge: 'Indestructible',
    climateTag: 'Extreme Hardiness Champion',
    zoneMatchPercent: {
      '10a': 99,
      '9b': 98,
      '8a': 95,
      '5b': 90,
      '11a': 100,
    },
    description: 'Upright architectural sword-like leaves edged with vibrant golden variegation. NASA-certified oxygen producer that thrives on neglect.',
    imageUrl: 'https://images.unsplash.com/photo-1593482892290-f54927ae1bf6?auto=format&fit=crop&w=800&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1593482892290-f54927ae1bf6?auto=format&fit=crop&w=800&q=80',
    ],
    care: {
      light: 'Adapts from deep shade to bright direct sun.',
      lightIcon: 'sunny-outline',
      watering: 'Let soil completely dry between waterings. Highly drought tolerant.',
      waterFrequency: 'Every 2-3 weeks',
      humidity: 'Low to moderate 30%-50%',
      temperature: '55°F – 90°F',
      difficulty: 'Beginner',
      difficultyDrops: 1,
      toxicity: 'Mildly toxic if ingested by pets.',
    },
    sizes: [
      { id: 'sm', name: 'Desk 4"', potDiameter: '4" Cylinder', priceDelta: -8 },
      { id: 'md', name: 'Medium 6"', potDiameter: '6" Matte Pot', priceDelta: 0 },
      { id: 'lg', name: 'Floor 10"', potDiameter: '10" Tall Vessel', priceDelta: 22 },
    ],
    vessels: [
      { id: 'sage', name: 'Matte Sage', colorHex: '#74c69d', priceDelta: 0 },
      { id: 'terracotta', name: 'Terracotta', colorHex: '#c86d51', priceDelta: 4 },
      { id: 'sand', name: 'Sand Ceramic', colorHex: '#d8cfbc', priceDelta: 6 },
    ],
  },
  {
    id: 'olive-tree',
    name: 'Mission Olive Tree',
    botanicalName: 'Olea europaea',
    family: 'Oleaceae',
    commonName: 'Mediterranean Olive',
    price: 85.00,
    originalPrice: 110.00,
    rating: 4.9,
    reviewCount: 67,
    bestseller: true,
    petSafe: true,
    airPurifying: true,
    easyCare: true,
    lowLight: false,
    tree: true,
    badge: 'Statement Tree',
    climateTag: 'Mediterranean Sun Lover',
    zoneMatchPercent: {
      '10a': 99,
      '9b': 96,
      '8a': 88,
      '5b': 62,
      '11a': 98,
    },
    description: 'Silvery willow-like foliage on a sculptural organic woody trunk. Imparts timeless Tuscan warmth and serene balance to sunlit rooms.',
    imageUrl: 'https://images.unsplash.com/photo-1512428813834-c702c7702b78?auto=format&fit=crop&w=800&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1512428813834-c702c7702b78?auto=format&fit=crop&w=800&q=80',
    ],
    care: {
      light: 'Needs 6+ hours of direct sunny window light.',
      lightIcon: 'sunny',
      watering: 'Water thoroughly, allow top half of soil to dry before soaking.',
      waterFrequency: 'Every 10-14 days',
      humidity: 'Low to average (30%-45%)',
      temperature: '60°F – 85°F',
      difficulty: 'Beginner',
      difficultyDrops: 1,
      toxicity: 'Completely pet safe.',
    },
    sizes: [
      { id: 'lg', name: 'Patio Tree (3-4 ft)', potDiameter: '10" Vessel', priceDelta: 0 },
      { id: 'xl', name: 'Estate Specimen (5-6 ft)', potDiameter: '14" Terracotta Urn', priceDelta: 55 },
    ],
    vessels: [
      { id: 'terracotta', name: 'Raw Terracotta Urn', colorHex: '#c86d51', priceDelta: 0 },
      { id: 'sand', name: 'Sand Ceramic', colorHex: '#d8cfbc', priceDelta: 12 },
    ],
  },
];

export const USDA_ZONES = [
  { zone: '10a', name: 'Zone 10a (30°F to 35°F)', city: 'San Francisco, CA', zip: '94103', desc: 'Mild maritime coastal humidity, cool fog, year-round moderate climate' },
  { zone: '9b', name: 'Zone 9b (25°F to 30°F)', city: 'Seattle, WA', zip: '98101', desc: 'Pacific Northwest rainy season, temperate summers, evergreen flora' },
  { zone: '8a', name: 'Zone 8a (10°F to 15°F)', city: 'Austin, TX', zip: '78701', desc: 'Subtropical warmth, high summer heat, mild brief winters' },
  { zone: '5b', name: 'Zone 5b (-15°F to -10°F)', city: 'Chicago, IL', zip: '60601', desc: 'Midwest continental freeze; requires winter indoor conservatory warmth' },
  { zone: '11a', name: 'Zone 11a (40°F to 45°F)', city: 'Honolulu, HI', zip: '96815', desc: 'Tropical year-round warmth, trade winds, lush year-round growth' },
];
