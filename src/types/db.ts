import { Database } from "sqlite";
import sqlite3 from "sqlite3";

export interface Score {
  userId: string;
  netPoints: number;
}

export type DB = Database<sqlite3.Database, sqlite3.Statement>;
