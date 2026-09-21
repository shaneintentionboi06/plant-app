// Botanical Journal — article content store.
// Images are resolved from the existing plant dataset (no new assets).
// Prices/availability always come from PLANTS_DATA at render time.

import { PLANTS_DATA } from './plants';

export type ArticleCategory =
  | 'Plant Care'
  | 'Beginner'
  | 'Home'
  | 'Pet Friendly'
  | 'Seasonal';

export const ARTICLE_CATEGORIES: ArticleCategory[] = [
  'Plant Care',
  'Beginner',
  'Home',
  'Pet Friendly',
  'Seasonal',
];

export interface ArticleSection {
  heading: string;
  body: string[];
}

export interface Article {
  slug: string;
  category: ArticleCategory;
  title: string;
  description: string;
  readTime: string;
  imagePlantId: string;
  intro: string;
  sections: ArticleSection[];
  routine: string[];
  relatedPlantId?: string;
}

function plantImage(id: string): string {
  return (
    PLANTS_DATA.find((p) => p.id === id)?.imageUrl || PLANTS_DATA[0].imageUrl
  );
}

export function articleImage(article: Article): string {
  return plantImage(article.imagePlantId);
}

export const ARTICLES: Article[] = [
  {
    slug: 'monstera-care',
    category: 'Plant Care',
    title: 'How to Care for Your Monstera',
    description:
      'Everything you need to know about light, watering, humidity and healthy growth.',
    readTime: '5 min read',
    imagePlantId: 'monstera-deliciosa',
    intro:
      'A simple guide to keeping your Monstera healthy, lush, and growing beautifully — including notes for Indian homes with AC rooms and humid monsoons.',
    sections: [
      {
        heading: 'Overview',
        body: [
          'Monstera deliciosa is known for its large, split leaves and relatively easy-care nature. With the right balance of light, water and humidity, it can thrive indoors for years, even in a typical apartment.',
        ],
      },
      {
        heading: 'Light',
        body: [
          'Place your Monstera in bright, indirect light — near an east-facing window is ideal in most Indian homes. Avoid prolonged exposure to harsh direct afternoon sun, which can scorch the leaves.',
          'In low-light rooms it will survive but grow slowly with fewer splits. If you only have a north-facing room, keep the plant as close to the window as possible.',
        ],
      },
      {
        heading: 'Water',
        body: [
          'Water when the top 2–3 cm of soil feels dry to the touch. Let excess water drain out fully and never leave the pot sitting in a saucer of water.',
          'During the monsoon, when humidity is high and soil dries slowly, stretch the gap between waterings. In dry AC rooms in summer, check the soil more often — air-conditioning pulls moisture from both air and soil.',
        ],
      },
      {
        heading: 'Humidity',
        body: [
          'Monsteras generally appreciate moderate to high humidity (50% and above), especially in dry indoor environments. Grouping plants together, a pebble tray, or occasional misting helps in air-conditioned rooms.',
          'During the monsoon, natural humidity is usually enough — focus instead on airflow so leaves dry and fungal spots do not develop.',
        ],
      },
      {
        heading: 'Soil',
        body: [
          'Use a loose, well-draining mix: regular potting soil with added cocopeat, perlite and a little orchid bark or coco chips. The roots need air as much as moisture.',
        ],
      },
      {
        heading: 'Fertilising',
        body: [
          'Feed once a month during the active growing season (roughly March to September) with a balanced liquid houseplant fertiliser at half strength. Skip feeding in the coolest winter weeks when growth slows.',
        ],
      },
      {
        heading: 'Repotting',
        body: [
          'Repot every 1–2 years, or when roots circle the bottom of the pot. Move up just one pot size. Early summer, before the monsoon growth spurt, is a good time.',
        ],
      },
      {
        heading: 'Common problems',
        body: [
          'Yellow leaves usually mean overwatering — check drainage first. Brown, crispy edges usually mean dry air or underwatering. A leggy plant with small, unsplit leaves is asking for more light.',
          'Wipe leaves with a damp cloth every few weeks. Dust blocks light, and clean leaves photosynthesise better.',
        ],
      },
    ],
    routine: [
      'Check soil moisture before watering',
      'Rotate the plant regularly for even growth',
      'Clean leaves occasionally with a damp cloth',
      'Feed during active growth, March to September',
    ],
    relatedPlantId: 'monstera-deliciosa',
  },
  {
    slug: 'watering-guide',
    category: 'Plant Care',
    title: 'How Often Should You Water Your Plants?',
    description:
      'A practical guide to knowing when your plant actually needs water.',
    readTime: '4 min read',
    imagePlantId: 'fiddle-leaf-fig',
    intro:
      'Overwatering kills more houseplants than anything else. Here is how to read your plant and your soil instead of following a fixed schedule.',
    sections: [
      {
        heading: 'Overview',
        body: [
          'There is no universal watering schedule — light, pot size, soil mix and season all change how fast soil dries. The goal is simple: water thoroughly, then let the soil dry to the right level before watering again.',
        ],
      },
      {
        heading: 'The finger test',
        body: [
          'Push a finger 2–3 cm into the soil. If it feels dry, water. If it feels damp, wait a day or two and check again. For succulents and cacti, wait until the soil is dry all the way through.',
        ],
      },
      {
        heading: 'Watering technique',
        body: [
          'Water slowly until it flows from the drainage holes, then empty the saucer. Every pot you own should have a drainage hole — without one, roots sit in water and rot.',
        ],
      },
      {
        heading: 'Seasonal rhythm in India',
        body: [
          'In hot, dry months (April–June) most indoor plants drink faster, especially in AC rooms. During the monsoon, cut back sharply: humid air and low light mean soil stays wet for days.',
          'In winter in the north, growth slows and so should watering. Always check the soil rather than the calendar.',
        ],
      },
      {
        heading: 'Common mistakes',
        body: [
          'Small sips every day keep only the surface wet while roots below stay dry or rot. Misting is not watering — it raises humidity briefly but does not replace a proper soak.',
        ],
      },
    ],
    routine: [
      'Check soil moisture first, every time',
      'Water deeply, then empty the saucer',
      'Reduce frequency during the monsoon',
      'Increase checks in dry AC rooms',
    ],
    relatedPlantId: 'fiddle-leaf-fig',
  },
  {
    slug: 'low-light-rooms',
    category: 'Home',
    title: 'The Best Plants for Low-Light Rooms',
    description:
      'Beautiful options for bedrooms, offices and shaded corners.',
    readTime: '4 min read',
    imagePlantId: 'maidenhair-fern',
    intro:
      'Not every room gets generous sunlight. These plants stay lush in shade and make bedrooms, offices and north-facing apartments feel alive.',
    sections: [
      {
        heading: 'Overview',
        body: [
          'Low light does not mean no light — it means gentle, indirect light a few feet from a window. Ferns, pothos relatives and many palms evolved for forest floors and handle exactly these conditions.',
        ],
      },
      {
        heading: 'Where they work',
        body: [
          'Bedrooms with small windows, home offices lit mostly by tube lights, bathrooms with frosted glass, and corridors that never see direct sun. Rotate the plant a quarter turn every week so growth stays even.',
        ],
      },
      {
        heading: 'Care notes',
        body: [
          'Low-light plants use less water, so the biggest risk is overwatering — check soil carefully. Dust leaves monthly, since every bit of available light counts in a dim room.',
        ],
      },
    ],
    routine: [
      'Place within a few feet of the brightest available window',
      'Rotate weekly for even growth',
      'Water less than sun-loving plants',
      'Dust leaves monthly',
    ],
    relatedPlantId: 'maidenhair-fern',
  },
  {
    slug: 'first-plants-beginners',
    category: 'Beginner',
    title: '5 Easy Plants for First-Time Plant Parents',
    description:
      'Low-maintenance plants that are forgiving and easy to grow.',
    readTime: '6 min read',
    imagePlantId: 'monstera-adansonii',
    intro:
      'Starting your first indoor garden? These five forgive missed waterings, tolerate apartment light, and still look fantastic.',
    sections: [
      {
        heading: 'Overview',
        body: [
          'The best first plants share three traits: they tolerate irregular watering, adapt to medium light, and show clearly when they need something. Start with one or two, learn their rhythm, then expand.',
        ],
      },
      {
        heading: 'What to buy first',
        body: [
          'Monsteras and pothos-type trailers are ideal starters — fast-growing and expressive. Ferns suit bathrooms and shaded corners. A fiddle-leaf fig is better saved for your second year, once you have the basics down.',
        ],
      },
      {
        heading: 'Starter kit',
        body: [
          'You need less gear than you think: pots with drainage holes, a basic potting mix with cocopeat and perlite, and a small watering can. Skip fertiliser for the first two months while the plant settles in.',
        ],
      },
    ],
    routine: [
      'Start with one or two forgiving plants',
      'Learn the finger test for watering',
      'Give them your brightest indirect spot',
      'Repot only when roots fill the pot',
    ],
    relatedPlantId: 'monstera-adansonii',
  },
  {
    slug: 'indian-homes',
    category: 'Home',
    title: 'Choosing Indoor Plants for Indian Homes',
    description:
      'How temperature, humidity and seasonal changes affect your plants.',
    readTime: '5 min read',
    imagePlantId: 'staghorn-fern',
    intro:
      'Indian homes swing from dry AC cool to humid monsoon within months. Here is how to pick plants — and spots — that handle it all.',
    sections: [
      {
        heading: 'Overview',
        body: [
          'Most popular houseplants are tropical, so Indian summers suit them — but constant air-conditioning, dust, and low-light apartment layouts create challenges worth planning around.',
        ],
      },
      {
        heading: 'Heat and AC',
        body: [
          'Keep plants away from direct AC blasts, which dry leaves fast. In non-AC rooms, heat above 35°C stresses most indoor plants — move them slightly away from west-facing glass in peak summer.',
        ],
      },
      {
        heading: 'Light in apartments',
        body: [
          'Balconies with grills, tinted glass and neighbouring buildings all cut light. East-facing windows are the sweet spot; south and west windows need sheer curtains in summer.',
        ],
      },
      {
        heading: 'Dust and pollution',
        body: [
          'City dust settles fast and blocks light. Wipe broad leaves monthly and rinse smaller plants under a gentle shower occasionally.',
        ],
      },
    ],
    routine: [
      'Keep plants clear of direct AC airflow',
      'Sheer curtains for harsh west sun',
      'Wipe leaves monthly in dusty cities',
      'Ease off water during humid months',
    ],
    relatedPlantId: 'staghorn-fern',
  },
  {
    slug: 'pet-friendly-plants',
    category: 'Pet Friendly',
    title: 'Pet-Friendly Plants for Your Home',
    description:
      'Plant choices for households with cats and dogs.',
    readTime: '4 min read',
    imagePlantId: 'maidenhair-fern',
    intro:
      'You should not have to choose between a green home and a safe one for your pets. These plants let you have both.',
    sections: [
      {
        heading: 'Overview',
        body: [
          'Several popular houseplants — including Monsteras — can irritate pets if chewed. If your cat nibbles leaves or your dog investigates everything, build your collection around plants considered safe for cats and dogs.',
        ],
      },
      {
        heading: 'Safer choices',
        body: [
          'Ferns are among the most reliable pet-safe groups, and they love the humidity of Indian bathrooms and kitchens. Always check the specific species before buying, since safety varies even within plant families.',
        ],
      },
      {
        heading: 'Placement still matters',
        body: [
          'Even safe plants can upset a sensitive stomach if eaten in quantity. Use wall shelves, hanging planters and closed balconies to keep curious pets and plants comfortably apart.',
        ],
      },
    ],
    routine: [
      'Verify each species before bringing it home',
      'Use shelves and hangers for curious cats',
      'Watch new plants for chewing for a week',
      'Keep your vet’s number handy, just in case',
    ],
  },
  {
    slug: 'monsoon-care',
    category: 'Seasonal',
    title: 'Monsoon Plant Care Guide',
    description:
      'How to adjust watering, airflow and humidity during the monsoon.',
    readTime: '5 min read',
    imagePlantId: 'staghorn-fern',
    intro:
      'The monsoon brings free humidity your tropical plants will love — and soggy soil they will not. A few adjustments keep everything thriving through the rains.',
    sections: [
      {
        heading: 'Overview',
        body: [
          'From June to September, lower light and saturated air slow down how fast pots dry. Most monsoon plant problems — yellow leaves, fungus gnats, stem rot — trace back to too much water, not too much rain.',
        ],
      },
      {
        heading: 'Watering',
        body: [
          'Cut watering frequency by roughly half and always check soil first. Move outdoor pots under cover so a week of downpour does not waterlog them.',
        ],
      },
      {
        heading: 'Airflow and light',
        body: [
          'Keep a fan running or windows open when possible — moving air prevents fungal spots on leaves. Shift plants closer to windows to make up for grey skies, but keep them off cold wet sills at night.',
        ],
      },
      {
        heading: 'Pests and hygiene',
        body: [
          'Remove dead leaves promptly, clean saucers, and watch for fungus gnats around damp topsoil. A thin top layer of sand or coco chips helps keep the surface drier.',
        ],
      },
    ],
    routine: [
      'Halve watering frequency, check soil first',
      'Shelter outdoor pots from continuous rain',
      'Improve airflow around dense foliage',
      'Clear dead leaves and standing water',
    ],
    relatedPlantId: 'monstera-deliciosa',
  },
];
