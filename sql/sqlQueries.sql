-- select 10 games from the games table
SELECT * FROM games
LIMIT 10;

-- top 10 best selling games
SELECT games.name, SUM(sales.units_sold) AS total_sales
FROM games, sales
WHERE games.game_id = sales.game_id
AND sales.region = 'Global'
GROUP BY games.name
ORDER BY total_sales DESC
LIMIT 10;

-- top 5 best selling games in Japan
SELECT games.name, SUM(sales.units_sold) AS total_sales
FROM games
JOIN sales ON games.game_id = sales.game_id
WHERE sales.region = 'JP'
GROUP BY games.name
ORDER BY total_sales DESC
LIMIT 5;

-- average sales for each genre in North America
SELECT games.genre, AVG(sales.units_sold) AS avg_na_sales
FROM games
JOIN sales ON games.game_id = sales.game_id
WHERE sales.region = 'NA'
AND games.genre IS NOT NULL
AND games.genre != ''
GROUP BY games.genre
ORDER BY avg_na_sales DESC;
