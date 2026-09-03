# JobShield AI frontend

React + TypeScript + Vite interface for the JobShield AI AI-assisted job-posting risk assessment product.

## Scripts

- `npm run dev` — start Vite
- `npm run build` — type-check and production build
- `npm run test` — run the Vitest suite
- `npm run lint` — run Oxlint

The app uses Demo Mode data when the FastAPI service is not yet connected. Configure the future backend origin with `VITE_API_URL` in `.env.local`; see [`.env.example`](./.env.example).
