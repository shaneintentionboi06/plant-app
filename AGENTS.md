# AGENTS.md — plants-app (Botanical Living)

Expo HAS CHANGED. Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.

## Stack
- Expo SDK `~57.0.24`, `expo-router` `~57.0.22`, React `19.2.3`, RN `0.86.3`, zustand, TS `~6.0.3`. No test runner, no ESLint config, no CI configured.
- Path alias: `@/*` → `./src/*` (`tsconfig.json`). `app.json` has `typedRoutes: true` + `reactCompiler: true`.
- No native toolchains locally (no JDK/`adb`); do not attempt local native builds. Phone testing = Expo Go QR scan; binaries = EAS cloud.

## Entrypoints (read these first)
- `package.json` `main: expo-router/entry` → `src/app/_layout.tsx` (Stack, `headerShown: false`, injects Playfair Display + Plus Jakarta Sans + `document.title` on web) → `src/app/index.tsx`.
- `src/app/index.tsx` is a single-route state switcher (`currentTab: catalog | cart | account | details | article`), not file-based navigation. Add new `app/` routes only if truly needed; default to extending the switcher. Article pages (`src/screens/ArticleScreen.tsx`, content in `src/data/articles.ts`) also ride the switcher via `selectedArticle` slug.
- `src/constants/theme.ts`: canonical palette (`surface #fbf9f5`, `primary #012d1d`), radii, warm-green shadows. Use tokens, never hardcode. Prices: `src/utils/currency.ts` `formatINR`/`formatINRExact` — all catalog prices are whole INR; cart uses 18% GST (`GST_RATE`), free shipping ≥ ₹2,999.
- `src/data/plants.ts`: `PLANTS_DATA` + `GROWING_ZONES` seed dataset (Indian cities; zone keys feed `plant.zoneMatchPercent`, do not rename keys). `src/services/api.ts`: tries `EXPO_PUBLIC_API_URL` then falls back to local data — app works with no backend.
- Design source of truth: `stitch_plants_e_commerce_app/botanical_living/DESIGN.md`. Build log/API contract: `context.md`. Geolocation plan (`expo-location`, `implementation_plan.md`) is **proposed, not implemented** — do not assume it exists.

## Structure
- `src/components/`: `Header`, `HeroBanner`, `FilterChips`, `PlantCard`, `BottomNav` (mobile only, `!isDesktop`).
- `src/screens/`: `HomeScreen`, `ProductDetailsScreen`, `CartScreen`, `AccountScreen`, `LocationZoneModal` (global, driven by `useZoneStore.openZonePicker`).
- `src/store/`: `useCartStore`, `useZoneStore`, `useWishlistStore`, `useAuthStore` (zustand, no persistence).
- `src/hooks/useResponsive.ts`: breakpoints `768 / 1024`, columns `2 / 3 / 4`, `contentMaxWidth` 1280 desktop.

## Business logic gotchas (do not re-derive)
- Cart (`useCartStore.ts`): line id = `plant-size-vessel-drainage`; free shipping ≥ `$50`, else `$8`; tax `8.5%`; promos `SPRING20`/`BOTANICAL20` = 20%, `GREEN10` = 10%.
- Zone matching: `plant.zoneMatchPercent[zoneCode]`, default `80` when missing; `api.lookupLocation` matches zip/city/zone, falls back to `USDA_ZONES[0]`.

## Commands
```bash
npm install
npx expo start          # web + Expo Go QR (web on http://localhost:8081)
npm run web             # web only
npm run android / npm run ios   # requires Expo Go device, no local emulators
npx tsc --noEmit        # typecheck — must be 0 errors (verified workflow)
npx expo export --platform web  # production web bundle → dist/
npm run lint            # expo lint (no custom config)
```
- Do not run `scripts/reset-project.js` — it moves starter code and would destroy `src/app/`.
- Web-only DOM/font tweaks belong behind `Platform.OS === 'web'` in `_layout.tsx`; mobile must not import `document`/`window`.
