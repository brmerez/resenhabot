import { DB, Score } from "./types/db";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

export default class DatabaseConnection {
  private db: DB;

  private constructor(db: DB) {
    this.db = db;
  }

  async close() {
    await this.db.close();
  }

  static async new() {
    const db = await open({
      filename: "./resenha.sqlite",
      driver: sqlite3.Database,
    });

    await db.run(
      "CREATE TABLE IF NOT EXISTS resenha (userId TEXT, guildId TEXT, messageId TEXT, resenhaPoints INTEGER DEFAULT 0, paiaPoints INTEGER DEFAULT 0, UNIQUE(userId, guildId, messageId));"
    );

    return new DatabaseConnection(db);
  }

  async getRanking(guildId: string): Promise<Score[]> {
    return await this.db.all<Score[]>(
      "SELECT userId, SUM(resenhaPoints - paiaPoints) as netPoints FROM resenha where guildId = ? GROUP BY userId ORDER BY netPoints DESC",
      guildId
    );
  }

  async addScore(
    uid: string,
    guildId: string,
    messageId: string,
    newScore: number
  ) {
    await this.db.run(
      "INSERT OR IGNORE INTO resenha (userId, guildId, messageId, resenhaPoints, paiaPoints) VALUES (?, ?, ?, 0, 0)",
      uid,
      guildId,
      messageId
    );

    await this.db.run(
      "UPDATE resenha SET resenhaPoints = ? WHERE userId = ? AND messageId = ?",
      newScore,
      uid,
      messageId
    );
  }

  async decrementScore(
    uid: string,
    guildId: string,
    messageId: string,
    paiaPoints: number
  ) {
    await this.db.run(
      "INSERT OR IGNORE INTO resenha (userId, guildId, messageId, resenhaPoints, paiaPoints) VALUES (?, ?, ?, 0, 0)",
      uid,
      guildId,
      messageId
    );
    await this.db.run(
      "UPDATE resenha SET paiaPoints = ? WHERE userId = ? AND guildId = ? AND messageId = ?",
      paiaPoints,
      uid,
      guildId,
      messageId
    );
  }

  async getResenha(messageId: string): Promise<ResenhaEntry | null> {
    const result = await this.db.get<ResenhaEntry>(
      "SELECT * from resenha WHERE messageId = ?"
    );
    if (!result) {
      console.warn(`getResenha <${messageId}>: Mensagem não encontrada.`);
      return null;
    }

    return result;
  }
}

export interface ResenhaEntry {
  userId: string;
  messageId: string;
  guildId: string;
  resenhaPoints: number;
}
