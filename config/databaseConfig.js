const { Pool } = require("pg");
require("dotenv").config();

let pool;

if (process.env.NODE_ENV === "production") {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: true, // Use only for self-signed certificates; remove in production
    },
  });
} else {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === "development" ? { rejectUnauthorized: false } : true,
  });
}

// Export both pool and query method
module.exports = {
  pool,
  query: async (text, params) => {
    const res = await pool.query(text, params);
    console.log("executed query", { text });
    return res;
  },
};