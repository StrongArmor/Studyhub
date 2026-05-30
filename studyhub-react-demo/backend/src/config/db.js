import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { URL, fileURLToPath } from 'node:url';
import { Pool } from 'pg';
import { seedDatabase } from '../data/seed.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const schemaPath = path.resolve(__dirname, '../database/schema.sql');
const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL || 'postgresql://postgres:postgres@localhost:5432/studyhub';

const buildPoolConfig = (url) => {
  const parsedUrl = new URL(url);
  const sslMode = parsedUrl.searchParams.get('sslmode') || process.env.PGSSLMODE;
  const wantsSsl = String(process.env.DATABASE_SSL || '').toLowerCase() === 'true' || sslMode === 'require' || sslMode === 'verify-full' || sslMode === 'verify-ca';
  const config = {
    host: parsedUrl.hostname,
    port: Number(parsedUrl.port || 5432),
    user: decodeURIComponent(parsedUrl.username),
    password: decodeURIComponent(parsedUrl.password),
    database: parsedUrl.pathname.replace(/^\//, ''),
    connectionTimeoutMillis: 5000
  };

  if (wantsSsl) {
    config.ssl = { rejectUnauthorized: false };
  }

  return config;
};

const pool = new Pool(buildPoolConfig(databaseUrl));

const runStatements = async (sql) => {
  const statements = sql
    .split(';')
    .map((statement) => statement.trim())
    .filter(Boolean);

  for (const statement of statements) {
    await pool.query(statement);
  }
};

export const db = {
  pool,
  async query(text, params = []) {
    return pool.query(text, params);
  },
  async exec(sql) {
    await runStatements(sql);
  },
  prepare(sql) {
    return {
      async get(...params) {
        const result = await pool.query(sql, params);
        return result.rows[0];
      },
      async all(...params) {
        const result = await pool.query(sql, params);
        return result.rows;
      },
      async run(...params) {
        const text = /^\s*insert/i.test(sql) && !/returning/i.test(sql) ? `${sql} RETURNING id` : sql;
        const result = await pool.query(text, params);
        return {
          lastInsertRowid: result.rows[0]?.id,
          changes: result.rowCount
        };
      }
    };
  }
};

try {
  await db.exec(fs.readFileSync(schemaPath, 'utf8'));
  await seedDatabase(db);
} catch (error) {
  console.error('Unable to connect to PostgreSQL or initialize the schema.');
  console.error('Check DATABASE_URL / POSTGRES_URL in .env and make sure the database is running.');
  throw error;
}

export const shutdownDatabase = async () => {
  await pool.end();
};
