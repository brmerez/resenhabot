import { DB, Score } from "./types/db";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

interface SelectType {
  resenhaPoints: number;
}

export async function setupDB() {
  const db = await open({
    filename: "./resenha.sqlite",
    driver: sqlite3.Database,
  });

  await db.run(
    "CREATE TABLE IF NOT EXISTS resenha (userId TEXT PRIMARY KEY, guildId TEXT, messageId TEXT);"
  );

  return db;
}

export async function getRanking(db: DB, guildId: string): Promise<Score[]> {
  return await db.all<Score[]>(
    "SELECT userId, COUNT(messageId) AS resenhaPoints FROM resenha where guildId = ? GROUP BY userId ORDER BY resenhaPoints DESC",
    guildId
  );
}

export async function addScore(
  uid: string,
  guildId: string,
  messageId: string,
  db: DB
) {
  await db.run(
    "INSERT OR IGNORE INTO resenha VALUES(?, ?, ?)",
    uid,
    guildId,
    messageId
  );
}
