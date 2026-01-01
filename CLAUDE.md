# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Big Picture Architecture

This is a **Vite + React + TypeScript single-page app** for a gaming platform with integrated 2D/3D lottery betting:

- **Routes** declared in `src/router/index.tsx` using `react-router-dom`
- **Dual Layout System**:
  - Authenticated routes wrapped by `src/layout/MainLayout.tsx` (home, games, wallet, lottery, etc.)
  - Unauthenticated routes render independently (login, register, bank/add, game frame)
- **Pages** under `src/pages/*` for major features; **components** under `src/components/*` for reusable UI elements
- **Dual Backend Architecture**:
  - **Main backend** (RedCow): Handles games catalog, user auth, wallet, etc.
  - **Lottery backend** (2D/3D): Separate domain at `https://game.sea2d3d.com` with independent auth token

## Build & Development

```bash
npm run dev       # Vite dev server on http://localhost:5173 (default)
npm run build     # TypeScript type check then production build to dist/
npm run preview   # Preview production build
npm run lint      # Run ESLint with TypeScript plugin
```

- **Node version**: 20 (see README.md)
- **Environment variables**: Use `import.meta.env.VITE_*` (Vite, not `process.env`)
- **TypeScript**: `tsconfig.json` (base) + `tsconfig.app.json` (app) + `tsconfig.node.json` (vite/eslint)
- **Vite plugins**: `@vitejs/plugin-react` and `vite-plugin-svgr` for SVG imports

## State Management (Zustand)

Four stores in `src/store/`:

1. **`useAppStore`** (key: `app-store`):
   - Caches domain, banners, notices, games catalog, game categories, system config
   - Fetches from `/nweb/getpath` on app init
   - Uses `persist` + `partialize` to store only `meta` and `data` fields

2. **`useUserStore`** (key: `user-store`):
   - Holds `token` (auth header) and `userInfo` (user profile)
   - Checks `localStorage` for "RedCow-token-expiration", "RedCow-username", "RedCow-password" for auto-login
   - Token managed by `MainLayout` with expiry validation

3. **`useLotteryStore`** (key: `lottery-store`):
   - Manages lottery backend session: `lotteryToken`, `lotteryDomain`, `gameType` (L2D/L3D)
   - Holds user info, bet sessions (pending/completed), current session, closed days
   - Only persists credentials (`lotteryToken`, `lotteryDomain`, `gameType`); session data refreshes on load

4. **`useSidebarStore`** (key: `sidebar-store`):
   - UI state for sidebar collapse/expand

**CRITICAL**: Altering store persistence keys or `partialize` logic breaks existing user sessions. Plan migrations carefully.

## API & Network Patterns

### Main Backend (`src/utils/request.ts`)

**Complex request interception** due to legacy backend requirements:

- **Base URL**: `import.meta.env.VITE_API_BASE_URL`
- **Every request** auto-appends query params:
  - `q`: 8-digit random number
  - `p`: computed XOR value
  - `lang`: from i18n.language
  - `t`: millisecond timestamp
- **Custom header**: `code` (derived from `q` and constant `920279`)
- **Auth header**: `eliao-token` from `useUserStore.token`
- **Time calibration**: `/nweb/getpath` returns server time to calculate `diffTime` (client-server offset)
- **Response encryption**:
  - If response is `{status:{errorCode}, data:"<AES-encrypted-string>"}` with `errorCode === 0`
  - Interceptor auto-decrypts using AES with IV=`pJfjDnI2V1Gvcia0`, KEY=`8739216015203896`
  - Successful decryption yields JSON object; failures fall back to raw string

**DO NOT remove or alter** encryption/decryption or header logic unless backend explicitly changes.

### Lottery Backend (`src/utils/lotteryRequest.ts`)

Separate axios instance for lottery API:

- **Base URL**: `import.meta.env.VITE_LOTTERY_API_BASE_URL` (default: `https://game.sea2d3d.com`)
- **Auth**: `Authorization` header with token (no "Bearer" prefix) from `useLotteryStore.lotteryToken`
- **Token management**: Use `setLotteryToken()` after obtaining token from main backend's `/nweb/Ky_login`
- **Simple JSON**: No encryption/decryption; standard `{code, message, data}` responses

## Service Layer Organization

### Main Backend Services

- **`src/services/http.ts`**: Generic `getData<T>()`, `postData<T>()` wrappers
- **`src/services/auth.ts`**: Login, register, OTP, password reset (all `/nweb/*`)
- **`src/services/games.ts`**: `fetchGamesByBrand`, `startGame` (POST to `/nweb/Ky_*`)
  - Validates `status.errorCode` and `data.data[]` structure
  - Throws on maintenance flag (`data.maintain.status === true`)
- **`src/services/api.ts`**: Domain-specific endpoints (wallet, profile, etc.)
- **`src/services/types.ts`**: TypeScript interfaces for all API responses

### Lottery Backend Services

- **`src/services/lottery.ts`**: All lottery API calls (see `2d3dapi.md` for details)
  - Game list, 2D live results, user info, bet sessions, place bet, rankings, history
  - **Game IDs**: 1 = 2D, 2 = 3D
  - **Win states**: 1 = pending/未开奖, 3 = completed/已开奖
- **`src/hooks/useLottery.ts`**: React hooks wrapping lottery API calls
  - `useBetSessions()`, `useLotteryUserInfo()`, `usePlaceBet()`, etc.
  - Provides loading states, error handling, and data caching

**Pattern**: Use generic types for responses; handle errors explicitly; throw descriptive messages, not raw API data.

## Lottery Integration Flow

1. **Entry**: User navigates to `/2d` or `/3d` routes
2. **Auth**: Main backend `/nweb/Ky_login` returns lottery ticket → exchange for token at lottery backend `/api/v1/exchange/certificates`
3. **Token Storage**: Store in `useLotteryStore` via `setLotteryCredentials()`
4. **Session Init**: Load user info, pending sessions, game resources via lottery API
5. **Betting Flow**:
   - Select session → fetch available numbers → place bets → confirm
   - Routes: `/2d/bet` → `/2d/bet-confirm` (same for 3D)
6. **History**: View bet records at `/2d/history`, rankings at `/2d/rank`, closed days at `/2d/closed-days`

Reference `2d3dapi.md` for complete lottery API documentation and `LOTTERY_*.md` files for implementation guides.

## Localization (i18n)

- **Setup**: `src/i18n/index.ts` with `react-i18next` + `i18next-browser-languagedetector`
- **Locales**: `src/i18n/locales/{en,zh,my}.json` (Myanmar `my` is default/fallback)
- **Usage**: `useTranslation()` hook in components; `i18n.language` or `i18n.t('key')` in logic
- **Backend sync**: `lang` param in all main backend requests comes from `i18n.language`

## Key Gotchas & Conventions

1. **Dual Network Clients**: Main backend uses `src/utils/request.ts` with custom encryption; lottery uses `src/utils/lotteryRequest.ts` with simple auth. Never mix them.

2. **Token Expiry**:
   - Main backend token checked in `MainLayout.useEffect` against `localStorage["RedCow-token-expiration"]`
   - Auto-login attempted if token absent but stored username+password exist

3. **Request Logic Changes**: Modifications to `src/utils/request.ts` (params, headers, crypto) must be verified against backend expectations. Update all `src/services/*.ts` callers if header names change.

4. **Encrypted Responses**: Don't duplicate AES decryption logic; trust `request.ts` interceptor to decrypt automatically.

5. **Game Brand Status**: `fetchGamesByBrand` throws if backend returns `data.maintain.status === true`.

6. **Lottery Token Flow**: Always obtain lottery token via main backend first, then exchange at lottery backend. Never use main backend token for lottery API.

7. **Store Migration**: If changing persistence keys or `partialize` logic, add version field and custom hydration function to prevent breaking sessions.

8. **Sidebar State**: Stored separately in `useSidebarStore`; independent from app/user data.

## Files for Common Tasks

**App initialization & routing:**
- `src/main.tsx` - Entry point, i18n setup
- `src/router/index.tsx` - Route definitions
- `src/layout/MainLayout.tsx` - Layout wrapper, auto-login logic

**Main backend integration:**
- `src/utils/request.ts` - Network client with encryption/auth
- `src/services/{auth,games,api}.ts` - Domain service functions
- `src/store/{app,user,sidebar}.ts` - State management

**Lottery integration:**
- `src/utils/lotteryRequest.ts` - Lottery network client
- `src/services/lottery.ts` - Lottery API functions
- `src/hooks/useLottery.ts` - React hooks for lottery features
- `src/store/lottery.ts` - Lottery session state
- `2d3dapi.md` - Lottery API reference

**UI components:**
- `src/components/*.tsx` - Reusable components (Header, Sidebar, GameCard, etc.)
- `src/pages/*.tsx` - Page components
- `src/pages/Lottery{2D,3D}*.tsx` - Lottery-specific pages
