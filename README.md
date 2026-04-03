# sip-core

Core web implementation for Sip Party Game.

## Current Slice

This repository includes an initial MVP foundation with:

- Next.js App Router + TypeScript + Tailwind setup
- Guest-first and ephemeral room flow
- Free player naming with automatic fallback (`Player X`)
- Round progression with skip support
- Portable game engine module in pure TypeScript
- Baseline anti-spam rate limiting on room create/join actions
- Supabase migration-first schema draft + separate seed bootstrap SQL

## Run Locally

1. Install dependencies:

	 npm install

2. Configure env vars:

	 copy `.env.example` to `.env.local` and fill values.

3. Start dev server:

	 npm run dev

4. Run quality checks:

	 npm run lint
	 npm run test
	 npm run build

## API Endpoints (MVP Baseline)

- `POST /api/rooms`
	- Creates room and host player.
	- Request body: `{ "hostName": "optional" }`

- `POST /api/rooms/[code]/join`
	- Adds guest player to room.
	- Request body: `{ "name": "optional" }`

- `POST /api/rooms/[code]/start`
	- Moves room from lobby to active.

- `POST /api/rooms/[code]/rounds/next`
	- Draws and returns next card with computed sip value.

- `POST /api/rooms/[code]/rounds/skip`
	- Marks the latest round as skipped, preserving flow continuity.

## Domain and Architecture Notes

- Game logic is intentionally isolated in `src/features/game/engine.ts`.
- App state is currently ephemeral in memory for MVP speed and privacy simplicity.
- Supabase schema is defined under `supabase/migrations/`.
- Seed bootstrap is separate from migrations under `supabase/seed/`.
- Application code now lives under `src/` to keep the project root clean.

## Security Baseline

- Anti-spam applied to sensitive guest actions (`create room`, `join room`).
- Content retrieval uses approved and active cards only.
- RLS policies are included in the initial schema draft and should be hardened alongside auth rollout.

## MVP Decisions Implemented

- Guest anonymous entry
- Ephemeral sessions
- Manual internal moderation model
- English-only content for now with i18n-ready fields
- Bootstrap data separated from schema migration files

