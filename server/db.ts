import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

// Support both AIVEN_ and DB_ prefixed environment variables
const host = process.env.AIVEN_DB_HOST || process.env.DB_HOST;
const port = parseInt(process.env.AIVEN_DB_PORT || process.env.DB_PORT || '5432');
const database = process.env.AIVEN_DB_NAME || process.env.DB_NAME;
const user = process.env.AIVEN_DB_USER || process.env.DB_USER;
const password = process.env.AIVEN_DB_PASSWORD || process.env.DB_PASSWORD;

// Check if we need SSL (Aiven typically requires it)
const needsSSL = host?.includes('aivencloud.com');
const sslConfig = needsSSL ? {
  rejectUnauthorized: false // Aiven uses self-signed certificates
} : undefined;

const pool = new Pool({
  host,
  port,
  database,
  user,
  password,
  ssl: sslConfig,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export default pool;

export const query = (text: string, params?: any[]) => pool.query(text, params);
