# "Planty" Chat Session — Frontend Implementation Plan

This document outlines the plan for adding a persistent chat session to the Botanical Living app so users can talk to **Planty**, the plant-care chatbot served by the `chatbot` service in the root `docker-compose.yml` (Express + Ollama, `llama3.2:3b`, exposed on `:3001`, routes `GET /health` and `POST /api/chat`).

> [!NOTE]
> The backend already exists (`chat-bot/server.js`) and is now wired into the main compose file with `EXPO_PUBLIC_CHATBOT_URL=http://localhost:3001` passed to the frontend container. This plan only covers the client side: a chat UI, a store to hold the conversation, and a service wrapper to call the API.

## User Review Required

> [!IMPORTANT]
> - **Model warm-up**: On first container start, `dockerfile` runs `ollama pull llama3.2:3b` before starting the server, so the very first chat request after `docker compose up` can take a while (model download) and `/api/chat` will 500 until Ollama is ready. The UI must show a friendly "waking up" state rather than a raw error — confirm this UX is acceptable rather than blocking send until `/health` reports `ollama: true`.
> - **No streaming**: `server.js` calls Ollama with `stream: false`, so replies arrive as one chunk, not token-by-token. Recommend a lightweight typing indicator instead of a real stream; upgrading to SSE/streaming would require a backend change (out of scope here) — flag if that's actually wanted.
> - **No auth/rate-limiting on `/api/chat`**: fine for local/dev; call out before exposing this beyond `localhost`.

## Open Questions

> [!WARNING]
> 1. **Placement**: Floating action button (FAB) that opens a chat panel/modal over any screen (like a typical support widget), vs. a dedicated "Chat" tab in `BottomNav`/`Header`. *(Recommendation: FAB + slide-up panel — keeps existing 4-tab nav intact and matches how a "help" widget is normally surfaced.)*
> 2. **Persistence**: Should chat history persist across app restarts (e.g. via `AsyncStorage`) or reset each session? *(Recommendation: in-memory only for v1, matching `useCartStore`'s non-persisted pattern; add persistence later if desired.)*
> 3. **Desktop vs mobile layout**: On desktop (`useResponsive().isDesktop`), should the panel dock as a sidebar/corner card instead of a full-screen sheet like on mobile?

## Proposed Changes

---

### [MODIFY] `src/services/api.ts`
- Add a `CHATBOT_BASE_URL = process.env.EXPO_PUBLIC_CHATBOT_URL || ''` constant, mirroring the existing `API_BASE_URL` pattern.
- Add `ApiService.sendChatMessage(message: string): Promise<string>` that `POST`s to `${CHATBOT_BASE_URL}/api/chat` with `{ message }` and returns `data.reply`, throwing a typed error on non-OK responses so the UI can distinguish "chatbot offline" from "chatbot returned an error".
- Add `ApiService.getChatbotHealth(): Promise<boolean>` that hits `${CHATBOT_BASE_URL}/health` and resolves `data.ollama === true` (used for the "waking up" state and the availability indicator).

### [NEW] `src/store/useChatStore.ts`
- Zustand store (same shape as `useCartStore.ts`) holding:
  - `messages: ChatMessage[]` (`{ id, role: 'user' | 'assistant', text, status: 'sending' | 'sent' | 'error', createdAt }`)
  - `isOpen: boolean`, `isSending: boolean`, `isBackendReady: boolean | null`
  - Actions: `openChat()`, `closeChat()`, `sendMessage(text)` (optimistically appends the user message, calls `ApiService.sendChatMessage`, appends the assistant reply or an error bubble), `checkHealth()`, `resetChat()`.

### [NEW] `src/screens/ChatScreen.tsx`
- The chat panel UI: header ("🌱 Planty — Plant Care Assistant" + close button), scrollable message list (user bubbles right-aligned, Planty bubbles left-aligned using existing `Colors`/`Radii`/`Shadows` tokens), a typing/"Planty is thinking…" indicator while `isSending`, a bottom `TextInput` + send button, and an empty-state with 3–4 suggested prompts ("Why are my leaves yellowing?", "How often should I water a pothos?").
- Reuses `useResponsive()` to render as a full-screen `Modal`/sheet on mobile and an anchored card (bottom-right, ~380×560) on desktop.
- Shows a subtle banner if `isBackendReady === false` ("Planty is waking up, this can take a minute on first launch") driven by `checkHealth()` polling every few seconds while the panel is open and the backend isn't ready yet.

### [NEW] `src/components/ChatFab.tsx`
- Floating action button (leaf/chat-bubble icon, `Colors.primary` background) fixed to the bottom-right, positioned above `BottomNav` on mobile. Toggles `useChatStore`'s `isOpen`/`openChat`/`closeChat`.
- Renders an unread/new-message badge if a reply arrives while the panel is closed (optional nice-to-have).

### [MODIFY] `src/app/index.tsx`
- Render `<ChatFab />` and `<ChatScreen />` (panel only visible when `isOpen`) alongside the existing `<LocationZoneModal />` at the root level, so the chat is reachable from every tab (`catalog`, `cart`, `account`, `details`) without adding a 5th bottom-nav item.

### [MODIFY] `Dockerfile` / dev env
- No changes needed — `EXPO_PUBLIC_CHATBOT_URL` is already injected via `docker-compose.yml`; for local (non-Docker) `expo start`, add `EXPO_PUBLIC_CHATBOT_URL=http://localhost:3001` to a local `.env`/`.env.local` consumed by Expo, and document it in `README.md`.

---

## Verification Plan

### Automated Tests
- N/A (no test harness in this project yet); ensure `tsc`/`expo lint` pass on the new files.

### Manual Verification
- `docker compose up chatbot` (or the full stack), wait for `/health` to report `ollama: true`.
- Run the app (`npm run web` or the `frontend` container) and confirm the FAB appears on every tab.
- Open the chat panel before the model finishes pulling — confirm the "waking up" banner shows instead of a raw network error.
- Send a plant-care question, confirm the optimistic user bubble appears immediately, a typing indicator shows, and Planty's reply renders.
- Send a message while the `chatbot` container is stopped — confirm a graceful inline error bubble ("Planty isn't available right now") rather than a crash.
- Verify desktop layout (anchored card) vs. mobile layout (full-screen sheet) both render correctly via `useResponsive()`.
