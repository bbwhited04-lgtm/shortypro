import pkg from 'pg';
const { Pool } = pkg;

export const pool = new Pool({
  host: '127.0.0.1',
  port: 5432,
  user: 'shortypro_app',
  password: process.env.DB_PASSWORD,
  database: 'shortypro',
  ssl: false,
});

export async function query(text, params) {
  const res = await pool.query(text, params);
  return res.rows;
}
