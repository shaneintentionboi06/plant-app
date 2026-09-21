---
name: Botanical Living
colors:
  surface: '#fbf9f5'
  surface-dim: '#dbdad6'
  surface-bright: '#fbf9f5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3ef'
  surface-container: '#efeeea'
  surface-container-high: '#eae8e4'
  surface-container-highest: '#e4e2de'
  on-surface: '#1b1c1a'
  on-surface-variant: '#414844'
  inverse-surface: '#30312e'
  inverse-on-surface: '#f2f0ed'
  outline: '#717973'
  outline-variant: '#c1c8c2'
  surface-tint: '#3f6653'
  primary: '#012d1d'
  on-primary: '#ffffff'
  primary-container: '#1b4332'
  on-primary-container: '#86af99'
  inverse-primary: '#a5d0b9'
  secondary: '#0e6c4a'
  on-secondary: '#ffffff'
  secondary-container: '#a0f4c8'
  on-secondary-container: '#19724f'
  tertiary: '#1f2a0e'
  on-tertiary: '#ffffff'
  tertiary-container: '#344022'
  on-tertiary-container: '#9eac85'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#c1ecd4'
  primary-fixed-dim: '#a5d0b9'
  on-primary-fixed: '#002114'
  on-primary-fixed-variant: '#274e3d'
  secondary-fixed: '#a0f4c8'
  secondary-fixed-dim: '#85d7ad'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#dae8be'
  tertiary-fixed-dim: '#becca3'
  on-tertiary-fixed: '#141f05'
  on-tertiary-fixed-variant: '#3f4b2c'
  background: '#fbf9f5'
  on-background: '#1b1c1a'
  surface-variant: '#e4e2de'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 40px
    fontWeight: '600'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 34px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Playfair Display
    fontSize: 22px
    fontWeight: '500'
    lineHeight: 30px
  headline-sm:
    fontFamily: Playfair Display
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 26px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-mobile: 0.75rem
  margin: 1.5rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
---

## Brand & Style

The design system embodies an organic, serene, and warm modern aesthetic tailored for cultivating an intentional, nature-infused living space. Designed for urban dwellers, interior enthusiasts, and aspiring plant parents, the interface feels like stepping into a sunlit conservatory or curated boutique plant atelier. 

The emotional signature is calming, grounding, and effortlessly premium—balancing lush living greens with airy linen tones. It combines a refined editorial sensibility with tactile warmth. Visual structures draw from warm minimalism and organic modernism: soft rounded geometries, airy white space, subtle clay and foliage undertones, and tactile micro-interactions that make plant care feel approachable rather than intimidating.

## Colors

The palette is rooted in living botanicals and tactile earth textures:

- **Primary (`#1B4332`)**: Deep Forest Green. Anchors high-priority actions, primary buttons, bottom navigation active states, and dominant editorial typography. Supported by `#2D6A4F` for interactive states, pressed moments, and focused active cards.
- **Secondary (`#74C69D`)**: Soft Sage. Provides fresh accents, positive status indicators, filter selections, and active iconography. Tinted variant `#D8F3DC` serves as tender background fills for badges, pill chips, and toast containers.
- **Tertiary (`#A3B18A`)**: Olive Leaf. Used for secondary metadata, subtle dividers, care requirement indicators (light, soil moisture), and low-emphasis iconography.
- **Neutral Canvas (`#FBF9F5` / `#F4EFEB`)**: Warm Linen & Raw Alabaster. The base atmosphere of the entire app, replacing harsh sterile whites with soft, natural warmth. Pure `#FFFFFF` is reserved strictly for raised product cards, filter sheets, and floating surface dialogs.

## Typography

The type system balances botanical editorial romance with functional mobile clarity.

- **Headlines**: Playfair Display delivers an elegant, horticultural journal aesthetic. Use for species botanical names, section banners, hero landing text, and product titles.
- **Interface & Body**: Plus Jakarta Sans supplies geometric warmth, exceptional legibility at small mobile sizes, and friendly humanist nuances. Use for plant care instructions, prices, descriptions, and filter selectors.
- **Labels & Badges**: Set in Plus Jakarta Sans with deliberate micro-letterspacing to maintain readability on compact requirement tags such as light levels and pet-safety alerts.

## Layout & Spacing

The layout is built around a mobile-first, fluid 4-column grid on standard viewports (360px - 428px), extending to 8 columns for tablet overlays. 

- **Outer Margins**: Mobile uses `1rem` (16px) margins to preserve maximum real estate for double-column catalog browsing, expanding to `1.5rem` on larger mobile and tablet formats.
- **Grid Gutters**: Set to `0.75rem` (12px) horizontally between plant card columns to provide a continuous, dense, yet breathing visual rhythm.
- **Vertical Flow**: Use `space-md` for grouped items within components, `space-lg` between distinct modules, and `space-xl` between thematic editorial collections.

## Elevation & Depth

Visual hierarchy uses soft ambient diffusion tinted with warm moss tones (`rgba(27, 67, 50, 0.06)` to `rgba(27, 67, 50, 0.12)`) instead of artificial grey drops:

- **Level 0 (Flat Canvas)**: Pure `#FBF9F5` surface tone.
- **Level 1 (Resting Cards & Filters)**: Surface `#FFFFFF` layered over the linen background, framed by a soft 1px border (`#F4EFEB`) and a subtle ambient shadow: `0 4px 16px -2px rgba(27, 67, 50, 0.05)`.
- **Level 2 (Active Cards & Floating Add-to-Cart Bars)**: Elevated with `0 8px 24px -4px rgba(27, 67, 50, 0.09)`.
- **Level 3 (Modal Bottom Sheets & Filter Drawers)**: High elevation with `0 16px 40px -8px rgba(27, 67, 50, 0.14)`, accompanied by a gentle background tint overlay of `#1B4332` at 40% opacity with 4px backdrop blur.

## Shapes

The design system embraces soft, organic geometry to echo botanical leaves, pebbles, and terracotta pottery:

- Base containers, input elements, and cards utilize standard rounded corners (`1rem` / 16px).
- Bottom sheets, modal dialogs, and hero showcase frames leverage `rounded-xl` (`1.5rem` / 24px) to soften transitions.
- Interactive filter tags, requirement chips, and floating action buttons adopt fully rounded pill forms (`9999px`) to create smooth, touch-friendly touchpoints.

## Components

### Buttons
- **Primary Action**: Solid `#1B4332` background with `#FFFFFF` text, `0.75rem` vertical padding, and `1.25rem` horizontal padding with `rounded-lg` radius. Subtle active scale feedback (0.98).
- **Secondary Action**: Background `#D8F3DC` with text `#1B4332`.
- **Ghost/Text**: Borderless, `#1B4332` font with an optional leaf-accent trailing icon.

### Chips & Filter Tags (Plant Requirement System)
- **State: Unselected**: Background `#F4EFEB`, text `#2D6A4F`, border `1px solid transparent`, pill-shaped (`9999px`).
- **State: Selected**: Background `#1B4332`, text `#FFFFFF`, with a mini checkmark icon.
- **Multi-variant Requirements**: 
  - *Light Level*: Sun icon glyph paired with Low, Medium, Bright Direct, or Indirect.
  - *Care Difficulty*: Green soil droplet rating (Beginner: 1 drop, Moderate: 2 drops, Expert: 3 drops).
  - *Pet-Friendly*: Paw badge with soft green tint `#D8F3DC` and `#1B4332` iconography.

### Product Cards
- Elevated card container with `#FFFFFF` background, rounded corners (`1rem`), and zero-border image container featuring a neutral warm backdrop (`#F4EFEB`).
- Top-right corner overlay features a soft circular wishlist heart button.
- Bottom details feature botanical title in Playfair Display, sub-label with common name in Plus Jakarta Sans, formatted price, and a quick-add floating circular `+` button in deep green.

### Filter Bottom Sheet
- Drawer sliding up with `rounded-xl` top edges.
- Segmented sections for Size (S, M, L, XL), Light Level, Pet Safety toggle, and an organic dual-thumb range slider for Price in `#1B4332`.
- Fixed sticky footer containing "Clear All" and "Show Results" actions.

### Badges
- Compact indicators (e.g., "Pet Safe", "Low Light", "Air Purifier") rendered in `label-sm` with `0.25rem` vertical and `0.5rem` horizontal padding, background in `#D8F3DC` and text in `#1B4332`.

### Inputs & Search
- Rounded search field with `#FFFFFF` fill, `1px solid #A3B18A` at 30% opacity, prefix botanical magnifying glass icon, and placeholder colored in muted olive.