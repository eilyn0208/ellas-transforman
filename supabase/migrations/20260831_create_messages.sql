-- Tabla messages: persistencia real de los mensajes de /messages/[conversationId].
--
-- Contexto: hasta ahora el chat solo mantenia los mensajes en useState local
-- (se perdian al refrescar). Esta migracion crea la tabla, su RLS, sus GRANTs
-- y su Realtime en un solo paso -- a diferencia de connections/conversations
-- (20260826), donde el GRANT quedo fuera de la migracion original y causo
-- 403 en /messages hasta que se corrigio en 20260830. Aqui no debe repetirse
-- esa ventana sin grant.
--
-- No se denormalizan mentor_id/mentee_id en esta tabla: a diferencia de
-- conversations (que denormaliza para no depender de connections en su
-- propia policy), aqui el EXISTS salta a conversations.id, que es su PK --
-- un lookup indexado de una sola fila, tan barato como una columna propia,
-- sin el riesgo de que la copia se desincronice.

CREATE TABLE messages (
  id              uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id uuid        NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id       uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content         text        NOT NULL CHECK (char_length(btrim(content)) > 0 AND char_length(content) <= 4000),
  created_at      timestamptz NOT NULL DEFAULT now()
);

-- Cubre "mensajes de esta conversacion ordenados por fecha" (el query real
-- del chat) y acelera el ON DELETE CASCADE al borrar una conversation.
-- Postgres no indexa columnas FK automaticamente.
CREATE INDEX idx_messages_conversation_id_created_at ON messages (conversation_id, created_at);

-- Acelera el ON DELETE CASCADE al borrar un auth.users row.
CREATE INDEX idx_messages_sender_id ON messages (sender_id);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "mentee_read_own_conversation_messages"
  ON messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM conversations c
      WHERE c.id = messages.conversation_id
        AND c.mentee_id = auth.uid()
    )
  );

CREATE POLICY "mentor_read_own_conversation_messages"
  ON messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM conversations c
      WHERE c.id = messages.conversation_id
        AND c.mentor_id = auth.uid()
    )
  );

-- Una sola policy de INSERT (a diferencia del par mentee/mentor de SELECT):
-- a diferencia de bookings (donde solo la mentee inserta), aqui ambos roles
-- pueden enviar mensajes con la misma condicion simetrica, asi que separarla
-- en dos policies casi identicas no agregaria claridad.
CREATE POLICY "participant_insert_own_message"
  ON messages FOR INSERT
  WITH CHECK (
    sender_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM conversations c
      WHERE c.id = messages.conversation_id
        AND (c.mentor_id = auth.uid() OR c.mentee_id = auth.uid())
    )
  );

-- Sin policy de UPDATE/DELETE: no hay edicion ni borrado de mensajes en el
-- MVP. Sin una policy que lo permita, RLS deniega por defecto.

GRANT SELECT, INSERT ON public.messages TO authenticated;

-- supabase_realtime existe, no es FOR ALL TABLES (puballtables = false) y
-- estaba vacia antes de esta migracion (verificado en Supabase SQL editor
-- el 2026-08-31) -- agregar messages es la operacion esperada, sin ajustes.
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- Mantiene conversations.last_message_at al dia (lo usa messages/page.tsx
-- para ordenar el inbox) sin dar UPDATE sobre conversations a authenticated:
-- SECURITY DEFINER corre como el owner de la funcion, mismo patron que
-- handle_new_booking() en 20260826_create_connections_conversations.sql.
CREATE OR REPLACE FUNCTION public.handle_new_message()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE conversations
  SET last_message_at = NEW.created_at
  WHERE id = NEW.conversation_id;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_message_updates_conversation
AFTER INSERT ON messages
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_message();
