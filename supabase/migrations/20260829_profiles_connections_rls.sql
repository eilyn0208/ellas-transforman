-- Acceso simetrico a profiles via connections (mentor <-> mentee).
--
-- Contexto: las policies de SELECT existentes en profiles permiten:
--   1) que cada usuaria lea su propio perfil, y
--   2) que una mentora lea el perfil de una mentee con la que tiene
--      un booking (policy previa, basada en bookings).
-- No existe el caso inverso: una mentee no puede leer el perfil de su
-- mentora. Esto bloquea el rediseno de /messages, que necesita resolver
-- el nombre de la contraparte (mentor o mentee) a partir de
-- conversations/connections, no de bookings.
--
-- Esta migracion NO modifica ninguna policy existente. Solo agrega dos
-- policies nuevas, basadas en connections (relacion permanente
-- mentor <-> mentee, sobrevive aunque el booking que la origino se
-- cancele). Postgres combina multiples policies de SELECT sobre la
-- misma tabla con OR, asi que esto unicamente amplia el acceso -- nunca
-- puede quitar acceso que ya funcionaba.
--
-- connections no tiene ninguna policy de INSERT/UPDATE/DELETE para
-- clientes -- el unico camino previsto para escribirla es el trigger
-- SECURITY DEFINER de handle_new_booking (ver
-- 20260826_create_connections_conversations.sql). Ninguna usuaria
-- autenticada puede insertar una connection falsa para ganar acceso a
-- un perfil ajeno.
--
-- Nota sobre backfill: con cero backfill de bookings historicos, estas
-- policies solo otorgan acceso para connections creadas despues de esa
-- migracion -- exactamente el mismo universo de datos que /messages
-- mostrara.

CREATE POLICY "mentor_read_connected_mentee_profile"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM connections c
      WHERE c.mentor_id = auth.uid()
        AND c.mentee_id = profiles.id
    )
  );

CREATE POLICY "mentee_read_connected_mentor_profile"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM connections c
      WHERE c.mentee_id = auth.uid()
        AND c.mentor_id = profiles.id
    )
  );
