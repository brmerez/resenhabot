import { DB, Score } from "./types/db";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

interface SelectType {
  resenhaPoints: number;
}

export async function setupDB() {
  const db = await open({
    filename: "db/resenha.sqlite",
    driver: sqlite3.Database,
  });

  await db.run(
    "CREATE TABLE IF NOT EXISTS resenha (userId TEXT, guildId TEXT, resenhaPoints INT);"
  );

  return db;
}

export async function getRanking(db: DB): Promise<Score[]> {
  return await db.all<Score[]>(
    "SELECT * from resenha ORDER BY resenhaPoints DESC"
  );
}

export async function addScore(uid: string, guildId: string, db: DB) {
  const result = await db.get<SelectType>(
    `SELECT resenhaPoints FROM resenha WHERE userId = ?`,
    uid
  );

  if (!result) {
    await db.run("INSERT INTO resenha VALUES(?, ?, ?)", uid, guildId, 1);
    return;
  }

  await db.get(
    "UPDATE resenha SET resenhaPoints = ? WHERE userId = ?;",
    result.resenhaPoints + 1,
    uid
  );
}
