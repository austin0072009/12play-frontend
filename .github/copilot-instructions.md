# Copilot / AI agent instructions for 12play-frontend

Purpose: Give an AI coding agent the minimal, actionable project knowledge
to be productive quickly in this repository (React + Vite + TypeScript).

- **Big picture**: This is a Vite + React + TypeScript single-page app.
  - Routing is declared in `src/router/index.tsx` using `react-router-dom`.
  - The top-level layout component is `src/layout/MainLayout.tsx`; routes that
    require the app chrome are nested inside it.
  - Pages live under `src/pages/*`; reusable UI lives under `src/components/*`.

- **State & persistence**:
  - Zustand stores in `src/store/` (examples: `app.ts`, `user.ts`).
  - `useAppStore` uses `persist` and `createJSONStorage` and stores under the
    key `app-store` (see partialize behavior in `src/store/app.ts`).
  - `useUserStore` holds `token` (used by the API client).

- **API & network patterns** (key: `src/utils/request.ts`)
  - An axios instance uses `import.meta.env.VITE_API_BASE_URL` as `baseURL`.
  - Request interceptor appends common query params: `q`, `p`, `lang`, `t` and
    sets a custom `code` header. Do not remove or alter this logic unless
    you're certain the backend changed.
  - Auth token is sent as header `eliao-token` (in `request.ts` built from
    `useUserStore`). If backend moves to `Authorization: Bearer`, change both
    the header and downstream code that expects `eliao-token`.
  - Responses may be wrapped in an old structure: `{status:{errorCode}, data:"<enc>"}`.
    Successful `data` values are AES-encrypted; `request.ts` decrypts automatically.
  - `/nweb/getpath` response is used to calibrate server time (diffTime).

- **Where to add API calls**:
  - Add higher-level service functions under `src/services/` (see
    `src/services/http.ts` which wraps `request.get/post`). Keep these
    functions thin and typed (they return generics, e.g. `Promise<T>`).

- **Localization**:
  - i18n is under `src/i18n/` and uses `react-i18next`. Locale JSON files
    are in `src/i18n/locales/*.json`. The `lang` param sent to backend
    comes from this runtime value.

- **Build / dev / lint** (from `package.json`)
  - Dev server: `npm run dev` (vite)
  - Build: `npm run build` (runs `tsc -b` then `vite build`)
  - Preview: `npm run preview` (vite preview)
  - Lint: `npm run lint` (eslint)

- **Conventions & gotchas**
  - Avoid changing the request signature or header logic unless updating
    both `src/utils/request.ts` and callers in `src/services/*`.
  - Many server responses use legacy encrypted fields — rely on
    `request.ts` decryption instead of duplicating logic.
  - Persisted store keys matter (`app-store`) — altering partialize requires
    a migration strategy.
  - Environment variables use `import.meta.env` (Vite), not `process.env`.

- **Files to inspect for common tasks**
  - App bootstrap: `src/main.tsx`
  - Routing: `src/router/index.tsx`
  - API client: `src/utils/request.ts`
  - Services: `src/services/*.ts`
  - Stores: `src/store/*.ts`
  - i18n: `src/i18n/index.ts` and `src/i18n/locales/*`

If anything above is unclear or you want more detail (e.g. an example API
endpoint implementation or a brief migration plan for changing headers), tell
me which area to expand.
