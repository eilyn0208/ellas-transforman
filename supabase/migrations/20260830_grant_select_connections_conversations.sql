-- Otorga permiso de lectura a "authenticated" sobre connections y conversations.
--
-- Contexto: ambas tablas se crearon en 20260826_create_connections_conversations.sql
-- con RLS habilitado y policies de SELECT, pero sin ningun GRANT explicito. Este
-- proyecto de Supabase no usa los default privileges automaticos de Postgres para
-- tablas nuevas (a diferencia de bookings/profiles, que ya tienen GRANT SELECT a
-- authenticated) -- por eso toda lectura de authenticated sobre estas dos tablas
-- fallaba con 42501 "permission denied for table", incluida cualquier query sobre
-- profiles cuya policy hace EXISTS(...) contra connections
-- (ver 20260829_profiles_connections_rls.sql).
--
-- Este GRANT no reemplaza ni debilita el RLS existente: solo habilita que Postgres
-- evalue las policies en primer lugar. Sin este GRANT, authenticated nunca llega a
-- evaluar las policies de SELECT -- la conexion se rechaza antes por falta de
-- privilegio a nivel de tabla. Con el GRANT, cada policy sigue filtrando filas
-- exactamente igual que antes (mentee_id = auth.uid() / mentor_id = auth.uid()).
--
-- No se otorga INSERT/UPDATE/DELETE ni ningun permiso a anon: estas tablas solo
-- deben escribirse via la funcion SECURITY DEFINER handle_new_booking().

GRANT SELECT ON public.connections TO authenticated;
GRANT SELECT ON public.conversations TO authenticated;
