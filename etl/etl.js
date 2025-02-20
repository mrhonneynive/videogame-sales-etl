require("dotenv").config();
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

const csvFilePath = process.env.CSV_PATH;

async function processCSV() {
  const results = [];
  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", async () => {
      console.log(`csv file loaded with ${results.length} records`);

      for (const row of results) {
        try {
          const client = await pool.connect();
          await client.query("BEGIN");

          const insertGameQuery = `
            INSERT INTO games (name, platform, release_year, genre, publisher)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING game_id
          `;
          const gameValues = [
            row["Name"],
            row["Platform"],
            row["Year_of_Release"] ? parseInt(row["Year_of_Release"]) : null,
            row["Genre"],
            row["Publisher"],
          ];
          const gameResult = await client.query(insertGameQuery, gameValues);
          const gameId = gameResult.rows[0].game_id;

          // multiple regions have to be handled since three of them are provided in the CSV
          const regions = [
            {
              region: "NA",
              units: row["NA_Sales"] ? parseFloat(row["NA_Sales"]) : 0,
            },
            {
              region: "EU",
              units: row["EU_Sales"] ? parseFloat(row["EU_Sales"]) : 0,
            },
            {
              region: "JP",
              units: row["JP_Sales"] ? parseFloat(row["JP_Sales"]) : 0,
            },
            // Optionally, if you want to keep Global Sales as well:
            {
              region: "Global",
              units: row["Global_Sales"] ? parseFloat(row["Global_Sales"]) : 0,
            },
          ];

          // insert sales data for each region if greater than 0
          const insertSalesQuery = `
            INSERT INTO sales (game_id, region, units_sold)
            VALUES ($1, $2, $3)
          `;
          for (const reg of regions) {
            if (reg.units > 0) {
              await client.query(insertSalesQuery, [
                gameId,
                reg.region,
                reg.units,
              ]);
            }
          }

          await client.query("COMMIT");
          console.log(`Inserted game & sales data for: ${row["Name"]}`);

          client.release();
        } catch (e) {
          console.error("error processing row", e);
        }
      }
    });
}

processCSV();
