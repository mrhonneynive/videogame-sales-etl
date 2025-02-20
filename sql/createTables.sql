CREATE TABLE IF NOT EXISTS games (
    game_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    platform VARCHAR(50),
    release_year INTEGER,
    genre VARCHAR(50),
    publisher VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS sales (
    sale_id SERIAL PRIMARY KEY,
    game_id INTEGER REFERENCES games(game_id),
    region VARCHAR(50),
    units_sold NUMERIC
);