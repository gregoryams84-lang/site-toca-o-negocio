-- supabase/migrations/0013_carga_horaria_real.sql

-- 0010 gravou 8h como valor provisório em todas as trilhas. Gregory
-- confirmou que a carga horária real é 30h para as 4 trilhas atuais.
update trilhas set carga_horaria_horas = 30;
