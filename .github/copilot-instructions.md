# Copilot / AI agent instructions for redcow-frontend

Purpose: Give an AI coding agent the minimal, actionable project knowledge
to be productive quickly in this repository (React + Vite + TypeScript).

## Big Picture Architecture

This is a **Vite + React + TypeScript single-page app** for a gaming platform:
- Routes declared in `src/router/index.tsx` using `react-router-dom`
- Top-level layout (`src/layout/MainLayout.tsx`) wraps authenticated routes; unauthenticated routes (login, register) render independently
- **Pages** under `src/pages/*` (Home, CategoryPage, Wallet, Profile, etc.); **components** under `src/components/*` (Header, Sidebar, GameCard, etc.)
- **Key data flow**: App fetches game metadata from `/nweb/getpath`, stores in `useAppStore`; user logs in via `/nweb/login`, token stored in `useUserStore`; page-specific data fetched via `src/services/*`

## State & Persistence (Zustand)

- Stores in `src/store/`:
  - **`useAppStore`** (key: `app-store`): caches domain, banners, notices, games catalog, game categories, system config. Uses `persist` + `partialize` to store only `meta` and `data` fields.
  - **`useUserStore`** (key: `user-store`): holds `token` (auth header), `userInfo` (user profile). Also checks `localStorage` for "RedCow-token-expiration" and "RedCow-username"/"RedCow-password" for auto-login.
  - **`useSidebarStore`** (key: `sidebar-store`): UI state for sidebar collapse/expand.
- **Critical**: Altering store persistence keys or partialize logic breaks existing user sessions; plan migrations carefully.

## API & Network Patterns

**Request interception** (`src/utils/request.ts`) is complex due to legacy backend:
- **Base URL**: `import.meta.env.VITE_API_BASE_URL`
- **Every request** appends query params: `q` (8-digit random), `p` (computed XOR), `lang` (from i18n), `t` (millisecond timestamp)
- **Custom header**: `code` (derived from `q` and hardcoded constant `920279`)
- **Auth header**: `eliao-token` (from `useUserStore.token`); if backend moves to `Authorization: Bearer`, update both `request.ts` interceptor and any code checking for `eliao-token`
- **Response handling**:
  - `/nweb/getpath`: Returns plaintext with `time` field (seconds); interceptor uses this to calibrate `diffTime` (client-server clock offset)
  - Other endpoints: May wrap response as `{status:{errorCode}, data:"<AES-encrypted-string>"}`. If `errorCode === 0` and `data` is string, interceptor auto-decrypts with IV=`pJfjDnI2V1Gvcia0` and KEY=`8739216015203896`
  - Successful decryption yields JSON object; failures fall back to raw string
- **Do not remove or alter** the encryption/decryption or header logic unless backend explicitly changes.

## Service Layer & API Calls

- **`src/services/http.ts`**: Thin wrapper (getData, postData) returning `Promise<T>` with typed responses
- **`src/services/auth.ts`**: loginApi, registerApi, sendOtpRegisterApi, verifyOtpApi, resetPassword (all POST to `/nweb/*`)
- **`src/services/games.ts`**: fetchGamesByBrand, startGame (POST to `/nweb/Ky_*`); validates response structure (`status.errorCode`, `data.data[]`), throws on maintenance flag
- **`src/services/api.ts`** & **`src/services/types.ts`**: Additional domain-specific endpoints and TypeScript interfaces
- **Pattern**: Use generic types for responses; handle errors explicitly; throw descriptive messages, not raw API data.

## Localization (i18n)

- Bootstrap in `src/i18n/index.ts` with `react-i18next` + `i18next-browser-languagedetector`
- Locale JSON files: `src/i18n/locales/{en,zh,my}.json`; Myanmar (`my`) is fallback/default
- Access via `useTranslation()` hook in components; `i18n.language` or `i18n.t('key')` in logic
- **Backend sync**: The `lang` param sent in all requests comes from `i18n.language` (set by detector or user override)

## Build & Development

```bash
npm run dev       # Vite dev server on http://localhost:5173 (by default)
npm run build     # tsc -b (typecheck) then vite build (dist/)
npm run preview   # Vite preview of dist/
npm run lint      # ESLint with TypeScript plugin
```
- TypeScript config: `tsconfig.json` (base) + `tsconfig.app.json` (app) + `tsconfig.node.json` (vite/eslint config)
- Environment: `import.meta.env` (Vite, not `process.env`)

## Key Gotchas & Conventions

1. **Request/header logic**: Changes to `src/utils/request.ts` (params, headers, crypto) must be verified against backend expectations; update all `src/services/*.ts` callers if header names change
2. **Encrypted responses**: Don't duplicate AES decryption logic; trust `request.ts` interceptor to decrypt automatically
3. **Token expiry**: Checked in `MainLayout.useEffect` against `localStorage["RedCow-token-expiration"]`; invalidation clears stored credentials
4. **Auto-login**: If token absent but stored username+password exist, `MainLayout` attempts re-login; fails gracefully
5. **Game brand status**: `fetchGamesByBrand` throws if backend returns `data.maintain.status === true`
6. **Sidebar state**: UI collapse stored in `useSidebarStore`; separate from app data
7. **Deprecated store keys** (if any migration needed): Add version field and custom hydration function

## Files for Common Tasks

- App entry & i18n setup: `src/main.tsx`
- Routing structure & route definitions: `src/router/index.tsx`
- Layout chrome & auto-login logic: `src/layout/MainLayout.tsx`
- Network client & crypto logic: `src/utils/request.ts`
- Domain service functions: `src/services/{auth,games,api}.ts`
- State management: `src/store/{app,user,sidebar}.ts`
- Component library: `src/components/*.tsx` (feature-organized, CSS modules)
