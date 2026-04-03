insert into public.cards
  (external_key, text, type, category, difficulty, sip_value, min_players, max_players, language, is_active, moderation_status, source)
values
  ('q_en_001', 'What is one surprisingly useful skill you learned this year?', 'question', 'icebreaker', 1, 1, 2, 10, 'en', true, 'approved', 'core_seed'),
  ('q_en_002', 'Name one decision you changed your mind about after hearing a friend.', 'question', 'reflection', 2, 1, 2, 10, 'en', true, 'approved', 'core_seed'),
  ('c_en_003', 'Improvise a dramatic weather forecast for this room for 20 seconds.', 'challenge', 'performance', 2, 2, 2, 10, 'en', true, 'approved', 'core_seed'),
  ('c_en_004', 'Describe your day as if it were a movie trailer voiceover.', 'challenge', 'performance', 3, 2, 2, 10, 'en', true, 'approved', 'core_seed'),
  ('q_en_005', 'Share one harmless opinion you think most people in this room disagree with.', 'question', 'debate', 4, 3, 3, 10, 'en', true, 'approved', 'core_seed'),
  ('c_en_006', 'Pitch a startup idea in 10 seconds using only three words.', 'challenge', 'creativity', 4, 3, 2, 10, 'en', true, 'approved', 'core_seed')
on conflict (external_key) do update
set
  text = excluded.text,
  type = excluded.type,
  category = excluded.category,
  difficulty = excluded.difficulty,
  sip_value = excluded.sip_value,
  min_players = excluded.min_players,
  max_players = excluded.max_players,
  language = excluded.language,
  is_active = excluded.is_active,
  moderation_status = excluded.moderation_status,
  source = excluded.source,
  updated_at = now();
