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
    "CREATE TABLE IF NOT EXISTS resenha (userId TEXT PRIMARY KEY, guildId TEXT, messageId TEXT, resenhaPoints INTEGER DEFAULT 0);"
  );

  return db;
}

export async function getRanking(db: DB, guildId: string): Promise<Score[]> {
  return await db.all<Score[]>(
    "SELECT userId, SUM(resenhaPoints) FROM resenha where guildId = ? GROUP BY userId ORDER BY resenhaPoints DESC",
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
    "INSERT INTO resenha (userId, guildId, messageId, resenhaPoints) VALUES (?, ?, ?, 0) ON CONFLICT(userId, guildId, messageId) DO UPDATE SET resenhaPoints = resenhaPoints + 1;",
    uid,
    guildId,
    messageId
  );
}

export async function decrementScore(
  uid: string,
  guildId: string,
  messageId: string,
  db: DB
) {
  await db.run(
    "UPDATE resenha SET resenhaPoints = resenhaPoints - 1 WHERE userId = ? AND guildId = ? AND messageId = ?",
    uid,
    guildId,
    messageId
  );
}