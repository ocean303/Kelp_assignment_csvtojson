CREATE TABLE public.users (
  name JSONB NOT NULL,
  age INT NOT NULL,
  address JSONB,
  additionalinfo JSONB,
  id SERIAL PRIMARY KEY
);
