import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL as string;
export const connection = postgres(connectionString, {
  ssl: 'require',
  max: 1,
  idle_timeout: 20,
  connect_timeout: 10,
  prepare: false
});

export const db = drizzle(connection);