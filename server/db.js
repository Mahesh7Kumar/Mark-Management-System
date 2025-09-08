import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // from Render environment
  ssl: { rejectUnauthorized: false }         // required for Render
});

pool.connect()
  .then(() => console.log("✅ DB Connected"))
  .catch(err => console.error("❌ DB Connection Failed:", err));

export default pool;
