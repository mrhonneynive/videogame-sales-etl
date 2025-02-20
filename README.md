# Videogame Sales ETL Project

A PostgreSQL and Node.js based ETL project for analyzing video game sales data using SQL queries.

## PostgreSQL Setup

- [x] Installed Postgres
- [x] Created database "videogame_sales"
- [x] Created user "admin"
- [x] Created the .env file with required environment variables
- [x] `psql -U myuser -d videogame_sales -f sql/createTables.sql`

## Database Schema

### games Table

- **game_id**: SERIAL PRIMARY KEY
- **name**: VARCHAR(255) NOT NULL
- **platform**: VARCHAR(50)
- **release_year**: INTEGER
- **genre**: VARCHAR(50)
- **publisher**: VARCHAR(100)

### sales Table

- **sale_id**: SERIAL PRIMARY KEY
- **game_id**: INTEGER REFERENCES games(game_id)
- **region**: VARCHAR(50)
- **units_sold**: NUMERIC
