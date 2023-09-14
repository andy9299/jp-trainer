CREATE TABLE users (
    username  VARCHAR(25)  PRIMARY KEY,
    password TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL CHECK (position('@' IN email) > 1)
);

CREATE TABLE kanji_sets (
    id SERIAL PRIMARY KEY,
    username VARCHAR(25) REFERENCES users ON DELETE CASCADE,
    "name" VARCHAR(25),
    characters VARCHAR (1) []
);
