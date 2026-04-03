create extension if not exists pgcrypto;

create type public.card_type as enum ('question', 'challenge', 'event', 'joker');
create type public.moderation_status as enum ('pending', 'approved', 'rejected');
create type public.room_status as enum ('lobby', 'active', 'closed');

create table public.game_rooms (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  status public.room_status not null default 'lobby',
  language text not null default 'en',
  created_at timestamptz not null default now(),
  started_at timestamptz,
  closed_at timestamptz
);

create table public.players (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.game_rooms(id) on delete cascade,
  display_name text not null,
  is_host boolean not null default false,
  joined_at timestamptz not null default now()
);

create table public.cards (
  id uuid primary key default gen_random_uuid(),
  external_key text unique not null,
  text text not null,
  type public.card_type not null,
  category text not null,
  difficulty int not null check (difficulty between 1 and 5),
  sip_value int not null check (sip_value >= 1),
  min_players int not null default 2,
  max_players int not null default 10,
  language text not null default 'en',
  is_active boolean not null default true,
  moderation_status public.moderation_status not null default 'pending',
  source text not null default 'internal',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.rounds (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.game_rooms(id) on delete cascade,
  round_index int not null,
  card_id uuid references public.cards(id),
  skipped boolean not null default false,
  created_at timestamptz not null default now(),
  unique (room_id, round_index)
);

create table public.moderation_audit (
  id uuid primary key default gen_random_uuid(),
  card_id uuid not null references public.cards(id) on delete cascade,
  action text not null,
  reason_code text,
  actor text not null default 'internal-admin',
  created_at timestamptz not null default now()
);

create index idx_cards_language_active on public.cards (language, is_active);
create index idx_cards_matching on public.cards (category, difficulty, min_players, max_players);
create index idx_rounds_room on public.rounds (room_id, round_index desc);

alter table public.game_rooms enable row level security;
alter table public.players enable row level security;
alter table public.cards enable row level security;
alter table public.rounds enable row level security;
alter table public.moderation_audit enable row level security;

create policy "game_rooms_select" on public.game_rooms
for select
using (true);

create policy "game_rooms_insert" on public.game_rooms
for insert
with check (true);

create policy "players_select" on public.players
for select
using (true);

create policy "players_insert" on public.players
for insert
with check (true);

create policy "cards_select_approved" on public.cards
for select
using (is_active = true and moderation_status = 'approved');

create policy "rounds_select" on public.rounds
for select
using (true);

create policy "rounds_insert" on public.rounds
for insert
with check (true);

create policy "moderation_audit_internal_only" on public.moderation_audit
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');
