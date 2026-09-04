require('dotenv').config();
const { Pool } = require('pg');

// DATABASE_URL comes from Supabase -> Project Settings -> Database -> Connection string (URI)
// Put it in a .env file - see .env.example
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // required for Supabase's hosted Postgres
});

pool.connect()
  .then((client) => {
    console.log('Database Connected!!!');
    client.release();
  })
  .catch((err) => {
    console.error('Database connection error:', err.message);
  });

module.exports = pool;
