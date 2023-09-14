\echo 'Delete and recreate jp_trainer db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE jp_trainer;
CREATE DATABASE jp_trainer;
\connect jp_trainer

\i jp-trainer-schema.sql
\prompt 'Use seed? Type y then return for yes, return anything else for no ' answer
SELECT :'answer' = 'y' AS y \gset
\if :y
\i jp-trainer-test-seed.sql
\endif

\echo 'Delete and recreate jp_trainer_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE jp_trainer_test;
CREATE DATABASE jp_trainer_test;
\connect jp_trainer_test

\i jp-trainer-schema.sql
-- \i jp-trainer-test-seed