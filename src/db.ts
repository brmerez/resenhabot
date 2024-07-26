import { DB, Score } from "./types/db";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

export async function setupDB() {
  const db = await open({
    filename: "./resenha.sqlite",
    driver: sqlite3.Database,
  });

  await db.run(
    "CREATE TABLE IF NOT EXISTS resenha (userId TEXT, guildId TEXT, messageId TEXT, resenhaPoints INTEGER DEFAULT 0, UNIQUE(userId, guildId, messageId));"
  );

  return db;
}

export async function getRanking(db: DB, guildId: string): Promise<Score[]> {
  return await db.all<Score[]>(
    "SELECT userId, SUM(resenhaPoints) as resenhaPoints FROM resenha where guildId = ? GROUP BY userId ORDER BY resenhaPoints DESC",
    guildId
  );
}

export async function addScore(
  uid: string,
  guildId: string,
  messageId: string,
  newScore: number,
  db: DB
) {
  await db.run(
    "INSERT OR IGNORE INTO resenha (userId, guildId, messageId, resenhaPoints) VALUES (?, ?, ?, 0)",
    uid,
    guildId,
    messageId
  );

  await db.run(
    "UPDATE resenha SET resenhaPoints = ? WHERE userId = ? AND messageId = ?",
    newScore,
    uid,
    messageId
  );
}

// TODO: Impossibilitar spam de decrementar score ao tirar e colocar a reação na mensagem.
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
