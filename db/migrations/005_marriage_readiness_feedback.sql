create table if not exists marriage_readiness_feedback (
  id bigserial primary key,
  rating smallint not null check (rating between 1 and 5),
  usefulness text not null check (usefulness in ('very_useful','somewhat_useful','not_very_useful','not_useful')),
  clarity text not null check (clarity in ('very_clear','mostly_clear','unclear')),
  comment text,
  created_at timestamptz not null default now()
);

create index if not exists marriage_readiness_feedback_created_at_idx
  on marriage_readiness_feedback (created_at desc);
