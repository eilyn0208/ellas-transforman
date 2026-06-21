-- Permite que una mentora lea las bookings donde ella aparece como mentor_id.
-- bookings.mentor_id es tipo TEXT, por eso se castea auth.uid() a text.
--
-- Importante: las bookings creadas antes de esta migración tienen mentor_id
-- con valores mock ("1", "2", "3"). Solo las bookings nuevas creadas con el
-- UUID real de la mentora serán visibles. Esto es correcto.

CREATE POLICY "mentor_read_own"
  ON bookings FOR SELECT
  USING (auth.uid()::text = mentor_id);
