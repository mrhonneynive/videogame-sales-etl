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