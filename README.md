# Videogame Sales ETL Project

A PostgreSQL and Node.js based ETL project for analyzing video game sales data using SQL queries. This project showcases data ingestion, transformation, and analysis about ETL and SQL skills.

## Table of Contents

- [PostgreSQL Setup](#postgresql-setup)
- [Database Schema](#database-schema)
  - [games Table](#games-table)
  - [sales Table](#sales-table)
- [SQL Queries Showcase](#sql-queries-showcase)
- [ETL Process](#etl-process)
- [Iterative Development & Atomic Commits](#iterative-development--atomic-commits)

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

## SQL Queries Showcase

### Top 10 Best Selling Games Globally

```sql
SELECT games.name, SUM(sales.units_sold) AS total_sales
FROM games, sales
WHERE games.game_id = sales.game_id
AND sales.region = 'Global'
GROUP BY games.name
ORDER BY total_sales DESC
LIMIT 10;
```

### Average Global Sales by Genre in North America

```sql
SELECT games.genre, AVG(sales.units_sold) AS avg_na_sales
FROM games
JOIN sales ON games.game_id = sales.game_id
WHERE sales.region = 'NA'
AND games.genre IS NOT NULL
AND games.genre != ''
GROUP BY games.genre
ORDER BY avg_na_sales DESC;
```

### Top-Selling Game per Region (Using CTE)

```sql
WITH avg_sales AS (
  SELECT region, AVG(units_sold) AS avg_units
  FROM sales
  GROUP BY region
)
SELECT games.name, sales.region, sales.units_sold
FROM games
JOIN sales ON games.game_id = sales.game_id
JOIN avg_sales ON sales.region = avg_sales.region
WHERE sales.units_sold > avg_sales.avg_units
AND sales.units_sold > 10
ORDER BY sales.region, sales.units_sold DESC;
```

## ETL Process

The ETL script is written in Node.js using the `pg` library and `dotenv` for environment management. The script reads the CSV file, inserts game records, and creates separate sales records for each region. It ensures data integrity with atomic transactions.

Key steps:

1. Read CSV file using `csv-parser`.
2. Insert each game into the `games` table.
3. Insert corresponding sales records into the `sales` table per region (e.g., NA, EU, JP, Global).

## Iterative Development & Atomic Commits

This project is built with a focus on small, atomic commits. Each change is committed individually to keep the development process clear.
