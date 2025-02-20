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

      try {
        const client = await pool.connect();
        console.log("connected to db");
        client.release(); // for testing purposes
      } catch (e) {
        console.error(e);
      }
    });
}

processCSV();