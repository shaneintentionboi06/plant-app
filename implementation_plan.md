# Location-Based Plant Recommendations Implementation Plan

This document outlines the strategy for integrating user geolocation with OpenStreetMap (for reverse geocoding) and OpenWeather (for climate data), ultimately mapping the user's location to curated plant recommendations from the backend database.

> [!NOTE]
> Currently, the application uses mock data (`USDA_ZONES`) and manual Zip/City entry to determine plant recommendations. This plan transitions us to automatic geolocation and a dynamic backend.

## User Review Required

> [!IMPORTANT]
> - **API Keys**: We will need an OpenWeather API key. Please ensure you have one ready for when we begin execution. OpenStreetMap's Nominatim API is free but requires a custom User-Agent.
> - **Privacy Permissions**: We will need to prompt the user for Location Permissions on both iOS, Android, and Web. We must provide a fallback (manual entry) if they deny it.

## Open Questions

> [!WARNING]
> 1. **Architecture**: Should the mobile/web app directly call OpenStreetMap and OpenWeather to get the City/Zip/Weather, and then send that to our backend? OR should the app just send Latitude/Longitude to our backend, and let the backend securely call OpenStreetMap and OpenWeather? *(Recommendation: Send Lat/Long to the backend to keep API keys secure and reduce client-side network requests).*
2. **Backend Mapping Logic**: How will the backend use the OpenWeather data (temperature, humidity, etc.) to determine the recommended plants? Does it map this data to a USDA Hardiness Zone, or is there a custom algorithm based on current/historical weather?

## Proposed Changes

---

### Frontend (React Native / Expo)

#### [MODIFY] `package.json`
- Add `expo-location` for cross-platform geolocation fetching.

#### [MODIFY] `src/store/useZoneStore.ts`
- Add `latitude`, `longitude`, and `weatherData` state.
- Add an async action `fetchUserLocation()` that requests permissions and gets coords.
- Update `setZone` to potentially handle coordinates.

#### [MODIFY] `src/services/api.ts`
- Update `getZoneRecommendations` to accept coordinates or weather data instead of just a mock `zoneCode`.
- Add endpoints for the backend to handle location-based queries (e.g., `GET /api/v1/recommendations/location?lat=X&lon=Y`).

#### [MODIFY] `src/screens/LocationZoneModal.tsx` & `HomeScreen.tsx`
- Add a "Use My Current Location" button.
- Implement loading states while fetching GPS and API data.
- Gracefully handle location permission denials with the existing manual Zip/City input.

---

### Backend Service (Architecture Blueprint)

*(Note: The actual backend implementation depends on your stack, but this is the required API contract and logic).*

#### [NEW] `GET /api/v1/locations/resolve` (or integrated into recommendations)
- **Input**: `latitude`, `longitude`
- **Action 1 (OpenStreetMap)**: Perform reverse geocoding via Nominatim to get `City`, `State`, and `Zip/Postal Code`.
- **Action 2 (OpenWeather)**: Fetch current weather, historical averages, or climate data for the coordinates.
- **Action 3 (Database)**: Map the climate data / location to a `zone` or query the plant database for species that thrive in those conditions.
- **Output**: User's resolved location details, current weather snapshot, and an array of recommended `PlantSpecimen`s.

## Verification Plan

### Automated Tests
- N/A for this phase, assuming rapid prototyping, but we will ensure TypeScript compiles without errors.

### Manual Verification
- Run the app on Web and Expo Go.
- Click "Use My Current Location".
- Verify that the browser/device prompts for location permissions.
- Verify that upon approval, the app displays the correct City/State using OpenStreetMap.
- Verify that the UI populates with plant recommendations tailored to the OpenWeather climate profile of that location.
