# Botanical Living — Project Context & Build Log

This document serves as the persistent living record and build log of the **Botanical Living** universal React Native (Expo) application. It chronicles the design assets, architecture, system tooling, backend API contracts, and all components, screens, and features built into the project.

---

## 1. Project Overview & Inspiration

- **Source Assets**: `stitch_plants_e_commerce_app`
- **Application Name**: Botanical Living ("PLANTS")
- **Target Platforms**: 
  - **Phone App**: iOS and Android (via React Native / Expo Go & native builds)
  - **Website**: Desktop and Mobile Web (via React Native Web / Metro)
- **Core Philosophy**: An organic, warm modern botanical shopping experience and plant stewardship portal. Bridges tactile aesthetics (warm linen, deep forest green, soft sage) with climate-matched plant discovery based on USDA Growing Zones.

---

## 2. Design System & Tokens Reference

Extracted and standardized from `stitch_plants_e_commerce_app/botanical_living/DESIGN.md`:

### 2.1 Color Palette
| Token | Hex | Role |
| :--- | :--- | :--- |
| `primary` | `#012d1d` | Deep forest green for primary typography, dominant buttons, and active tabs |
| `primary-container` | `#1b4332` | Rich emerald container fill (hero sections, high emphasis cards) |
| `secondary` | `#0e6c4a` / `#74c69d` | Soft sage accent, active icons, zone tags, progress bars |
| `secondary-container`| `#a0f4c8` / `#d8f3dc` | Tender sage badge backgrounds, positive pills |
| `surface` | `#fbf9f5` | Warm linen canvas background (replaces sterile white) |
| `surface-container-low`| `#f5f3ef` | Soft warm container fill, input backgrounds, subtle chips |
| `surface-container` | `#efeeea` | Segmented controls and divider layers |
| `surface-container-lowest`| `#ffffff` | Elevated product cards, modal surfaces, floating sheets |
| `on-surface` | `#1b1c1a` | Primary dark body and headline text |
| `on-surface-variant` | `#414844` | Secondary text, botanical common names |
| `outline` | `#717973` | Subtle borders and placeholder text |
| `outline-variant` | `#c1c8c2` | Hairline dividers |

### 2.2 Typography
- **Headlines / Editorial**: *Playfair Display* (Serif) — horticultural journal elegance for plant botanical names, banners, section headers.
- **Body / Interface / Badges**: *Plus Jakarta Sans* (Humanist sans-serif) — high legibility for specs, prices, care instructions, labels.

### 2.3 Visual Depth & Shapes
- **Corner Radii**: `sm`: 4px, `md`: 8px, `lg`: 16px, `xl`: 24px, `full`: 9999px (pills).
- **Shadows**: Ambient warm green diffused shadows (`rgba(27, 67, 50, 0.06)` to `0.12)` rather than flat gray drops.

---

## 3. System Tooling Audit Log

Conducted on `2026-09-21`:
- **Node.js**: `v26.9.0` (Verified active)
- **npm**: `v11.19.1` (Verified active)
- **npx**: Available
- **Git**: `v2.53.0` (Verified active)
- **Expo Tooling**: Verified operational non-interactively via `npx create-expo-app`
- **Native Android / iOS Local Compilers**:
  - JDK (`java`) & Android SDK (`adb`) are not installed locally.
  - **Execution Strategy**:
    - **Website (Desktop/Web)**: Runs locally on `localhost:8081` via Metro Web / `npm run web`.
    - **Phone App (iOS & Android)**: Runs via **Expo Go** by scanning the dev server QR code from any physical iPhone or Android device.
    - **Standalone APK / App Store binaries**: Managed via EAS Build cloud pipeline or containerized SDKs.

---

## 4. Backend REST API Endpoints Specification

Documented contract required to make the app fully dynamic:

### 4.1 Botanical Catalog & Discovery
- `GET /api/v1/plants`: Paginated plant catalog with multi-filter query params (`category`, `light`, `pet_friendly`, `air_purifying`, `easy_care`, `max_price`, `sort`, `page`, `limit`).
- `GET /api/v1/plants/:id`: Comprehensive botanical specifications, variants, image carousel, care specs, ratings.
- `GET /api/v1/plants/search`: Real-time query search and autocomplete suggestions (`q`, `limit`).
- `GET /api/v1/promotions/hero`: Active seasonal editorial banner content and discount promotions.

### 4.2 Climate & USDA Growing Zone Intelligence
- `GET /api/v1/zones/recommendations`: Location-matched plants with match percentage (`zone`, `zip`).
- `GET /api/v1/locations/lookup`: Resolves Zip code or City to USDA Hardiness Zone and climate profile.
- `GET /api/v1/zones`: Metadata of supported climate zones.

### 4.3 Botanical Cart & Orders
- `GET /api/v1/cart`: User/guest cart items, live subtotal, and eco-shipping $50 progress calculator.
- `POST /api/v1/cart/items`: Add plant specimen with size and vessel options.
- `PATCH /api/v1/cart/items/:id`: Update item quantity or variant.
- `DELETE /api/v1/cart/items/:id`: Remove single item from cart.
- `DELETE /api/v1/cart`: Clear entire cart.
- `POST /api/v1/cart/apply-promo`: Validate and apply discount coupon codes.
- `POST /api/v1/checkout/create-intent`: Initialize secure payment intent (Stripe / Apple Pay / Google Pay).

### 4.4 Wishlist & User Favorites
- `GET /api/v1/wishlist`: Retrieve saved plant IDs.
- `POST /api/v1/wishlist/:id`: Bookmark plant.
- `DELETE /api/v1/wishlist/:id`: Unbookmark plant.

### 4.5 Member Account, Auth & Greenhouse Atelier
- `POST /api/v1/auth/register`: Create new botanical member account.
- `POST /api/v1/auth/login`: Authenticate existing member.
- `POST /api/v1/auth/social`: Google / Apple SSO authentication.
- `POST /api/v1/auth/refresh`: Refresh JWT access token.
- `GET /api/v1/user/profile`: Profile, member stewardship tier (*Level 3 Steward*), eco-points (*320/500*).
- `PATCH /api/v1/user/profile`: Update member details.
- `GET /api/v1/user/greenhouse`: User's adopted living plants, health tracking, watering countdown timers.
- `POST /api/v1/user/greenhouse/:id/water`: Log watering action.
- `GET /api/v1/user/impact`: Eco-metrics (adopted plants, trees planted, points).
- `GET /api/v1/orders`: Historical purchases and delivery tracking.

---

## 5. Architectural Log & File Inventory

As the application is constructed, all components, state stores, screens, and services will be tracked in this section:

### 5.1 Directory Structure Planned (`plants-app/`)
```
plants-app/
├── assets/                  # High-res botanical imagery, logos, icons
├── src/
│   ├── components/          # Reusable cross-platform UI components
│   │   ├── Header.tsx       # Responsive header (mobile compact / desktop expanded)
│   │   ├── PlantCard.tsx    # Botanical product card with wishlist & add button
│   │   ├── FilterChips.tsx  # Horizontal filter category chips
│   │   ├── HeroBanner.tsx   # Seasonal editorial drop hero banner
│   │   └── CareSpec.tsx     # Botanical requirement icons (light, water, humidity)
│   ├── constants/
│   │   └── theme.ts         # Design tokens: palette, typography scales, shadows
│   ├── data/
│   │   └── plants.ts        # Seed botanical dataset with imagery & zone ratings
│   ├── hooks/
│   │   └── useResponsive.ts # Viewport breakpoint detection (mobile, tablet, desktop)
│   ├── screens/
│   │   ├── HomeScreen.tsx   # Catalog feed & "Thriving in Your Area" recommendations
│   │   ├── ProductDetailsScreen.tsx # Multi-image gallery, vessel swatches, buy box
│   │   ├── CartScreen.tsx   # Bag review, free shipping meter, order summary
│   │   ├── LocationZoneModal.tsx # Zip/City USDA zone selector
│   │   └── AccountScreen.tsx # Sign-in/Sign-up, member level & digital greenhouse
│   ├── services/
│   │   └── api.ts           # Centralized HTTP client & mock dynamic fallback
│   └── store/
│       ├── useCartStore.ts  # Cart state & shipping math
│       ├── useZoneStore.ts  # Active growing zone & location filter
│       └── useAuthStore.ts  # User session, adopted plants, and eco-points
├── app.json                 # Expo universal app configuration
├── package.json             # NPM dependencies & run scripts
└── tsconfig.json            # TypeScript configuration
```

---

## 6. Build History & Change Log

| Timestamp | Phase / Action | Description | Status |
| :--- | :--- | :--- | :--- |
| **2026-09-21 10:48** | **Analysis & Planning** | Inspected `stitch_plants_e_commerce_app` (all 12 screens & `DESIGN.md`), validated system tools, formulated implementation plan artifact. | Complete |
| **2026-09-21 10:52** | **API Specification** | Formulated complete REST API endpoint requirements for dynamic phone & web app. | Complete |
| **2026-09-21 10:55** | **Context Log Created** | Created `context.md` in workspace root to serve as persistent build log and architecture ledger. | Complete |
| **2026-09-21 11:09** | **Project Initialization** | Initialized `plants-app` Expo SDK 57 project, installed `@expo/vector-icons`, `zustand`, Google Fonts, and configured web assets. | Complete |
| **2026-09-21 11:10** | **Design System & Data** | Implemented `theme.ts` with exact Stitch botanical tokens and `plants.ts` curated dataset with CDN imagery and USDA zone match algorithms. | Complete |
| **2026-09-21 11:15** | **State Stores & API** | Built `useCartStore`, `useZoneStore`, `useWishlistStore`, `useAuthStore`, and `api.ts` typed service layer. | Complete |
| **2026-09-21 11:16** | **UI Components** | Implemented responsive `Header`, `HeroBanner`, `FilterChips`, `PlantCard`, and `BottomNav`. | Complete |
| **2026-09-21 11:18** | **Screens Construction** | Implemented `HomeScreen`, `ProductDetailsScreen`, `CartScreen`, `LocationZoneModal`, and `AccountScreen`. | Complete |
| **2026-09-21 11:20** | **App Shell & Type Check** | Wired `_layout.tsx` and `app/index.tsx`. Passed TypeScript validation (`npx tsc --noEmit`) with 0 errors. | Complete |
| **2026-09-21 11:22** | **Web Bundle & Dev Server**| Production export (`npx expo export --platform web`) bundled cleanly to `dist/`. Dev server active on `http://localhost:8081`. | Complete |
