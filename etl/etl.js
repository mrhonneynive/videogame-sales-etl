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

      for (const record of results) {
        console.log("processing record", record);

        try {
          const client = await pool.connect();
          await client.query("BEGIN");
          console.log("transaction started for:", record["Name"]);

          // insert record into database

          await client.query("COMMIT");
          console.log("transaction committed for:", record["Name"]);
        } catch (e) {
          console.error("error processing row", e);
        }
      }
    });
}

processCSV();
