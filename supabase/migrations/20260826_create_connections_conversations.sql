-- Infraestructura de conexion/conversacion (sin tabla messages todavia).
--
-- connections: relacion persistente mentor <-> mentee. Sobrevive aunque se
-- cancele el booking que la origino (por diseno: la conexion no depende del
-- estado de una sesion puntual).
--
-- conversations: hilo de chat 1:1 con cada connection. mentor_id/mentee_id
-- estan denormalizados aqui a proposito para que las policies de RLS sean
-- comparaciones directas, sin subconsultas contra connections.
--
-- Ninguna de las dos tablas tiene policy de INSERT/UPDATE/DELETE para
-- clientes (anon/authenticated). La unica via de escritura es la funcion
-- SECURITY DEFINER de mas abajo, disparada por un trigger sobre bookings.
-- Esto evita que cualquier usuaria pueda crear una connection arbitraria
-- desde el cliente.

CREATE TABLE connections (
  id           uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  mentor_id    uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mentee_id    uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status       text        NOT NULL DEFAULT 'active',
  created_via  text        NOT NULL DEFAULT 'booking',
  created_at   timestamptz NOT NULL DEFAULT now(),

  UNIQUE (mentor_id, mentee_id)
);

ALTER TABLE connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "mentee_read_own_connections"
  ON connections FOR SELECT
  USING (auth.uid() = mentee_id);

CREATE POLICY "mentor_read_own_connections"
  ON connections FOR SELECT
  USING (auth.uid() = mentor_id);


CREATE TABLE conversations (
  id               uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  connection_id    uuid        NOT NULL UNIQUE REFERENCES connections(id) ON DELETE CASCADE,
  mentor_id        uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mentee_id        uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  last_message_at  timestamptz,
  created_at       timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "mentee_read_own_conversations"
  ON conversations FOR SELECT
  USING (auth.uid() = mentee_id);

CREATE POLICY "mentor_read_own_conversations"
  ON conversations FOR SELECT
  USING (auth.uid() = mentor_id);


-- Se ejecuta despues de cada INSERT en bookings (nunca UPDATE: hoy no existe
-- ningun UPDATE sobre bookings -- el unico upsert del cliente usa
-- ignoreDuplicates/DO NOTHING, y ademas no hay policy de UPDATE sobre
-- bookings, asi que quedaria bloqueado por RLS de todas formas).
--
-- bookings.mentor_id es TEXT (sin FK) pero en la practica siempre contiene
-- el UUID real de mentor_profiles.user_id. El cast a uuid es intencional:
-- si algun dia llegara un mentor_id invalido, el cast falla, la transaccion
-- completa hace rollback (incluido el INSERT del booking), y la operacion
-- se rechaza por completo en vez de dejar datos inconsistentes.
CREATE OR REPLACE FUNCTION public.handle_new_booking()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_mentor_id     uuid;
  v_connection_id uuid;
BEGIN
  v_mentor_id := NEW.mentor_id::uuid;

  INSERT INTO connections (mentor_id, mentee_id)
  VALUES (v_mentor_id, NEW.mentee_id)
  ON CONFLICT (mentor_id, mentee_id)
  DO UPDATE SET mentor_id = EXCLUDED.mentor_id  -- no-op, solo para forzar RETURNING en conflicto
  RETURNING id INTO v_connection_id;

  INSERT INTO conversations (connection_id, mentor_id, mentee_id)
  VALUES (v_connection_id, v_mentor_id, NEW.mentee_id)
  ON CONFLICT (connection_id) DO NOTHING;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_booking_creates_connection
AFTER INSERT ON bookings
FOR EACH ROW
WHEN (NEW.status IS DISTINCT FROM 'cancelled')
EXECUTE FUNCTION public.handle_new_booking();

-- Nota: este trigger solo aplica a INSERTs futuros. Los bookings creados
-- antes de esta migracion no generan connection/conversation retroactiva
-- (sin backfill incluido a proposito -- fuera de alcance de esta migracion).
