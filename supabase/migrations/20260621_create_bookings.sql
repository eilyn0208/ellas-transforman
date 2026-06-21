CREATE TABLE IF NOT EXISTS bookings (
  id            uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  mentee_id     uuid        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  mentor_id     text        NOT NULL,
  mentor_name   text        NOT NULL,
  slot_label    text        NOT NULL,
  scheduled_at  timestamptz NOT NULL,
  duration_min  int         NOT NULL DEFAULT 30,
  location_type text        NOT NULL DEFAULT 'Online · 1:1',
  status        text        NOT NULL DEFAULT 'confirmed',
  created_at    timestamptz DEFAULT now(),

  -- Una mentee no puede tener dos bookings confirmados en el mismo instante
  UNIQUE (mentee_id, scheduled_at)
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "mentee_read_own"
  ON bookings FOR SELECT
  USING (auth.uid() = mentee_id);

CREATE POLICY "mentee_insert_own"
  ON bookings FOR INSERT
  WITH CHECK (auth.uid() = mentee_id);
