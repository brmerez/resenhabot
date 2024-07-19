import { Client, Events, GatewayIntentBits, Guild, Partials } from "discord.js";
import sqlite3 from "sqlite3";
import { Database, open } from "sqlite";
import dotEnv from "dotenv";

interface Score {
  userId: string;
  resenhaPoints: number;
}

type DB = Database<sqlite3.Database, sqlite3.Statement>;

async function main() {
  const db = await open({
    filename: "db/resenha.sqlite",
    driver: sqlite3.Database,
  });

  await db.run(
    "CREATE TABLE IF NOT EXISTS resenha (userId TEXT, resenhaPoints INT);"
  );

  dotEnv.config();
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMessageReactions,
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction],
  });

  client.once(Events.ClientReady, (readyClient) => {
    console.log("Bora bill!!!");
  });

  try {
    await client.login(process.env.DISCORD_TOKEN);
  } catch (e) {
    console.error("Houve um erro ao fazer login: ", e);
    return;
  }

  process.on("SIGINT", (s) => {
    console.log("\nClosing db connection...");
    db.close();
    process.exit();
  });

  client.on(Events.MessageCreate, (msg) => {
    msg.createReactionCollector();
  });

  client.on(Events.MessageReactionAdd, async (reaction, user) => {
    if (reaction.partial) {
      try {
        await reaction.fetch();
      } catch (e) {
        console.error("Erro ao fazer fetch da mensagem", e);
      }
    }

    if (reaction.emoji.name === "🤣") {
      await addScore(user.id, db);
      reaction.message.reply(`Que resenha, ${user.displayName}!!`);
    }
  });

  client.on(Events.InteractionCreate, async (int) => {
    if (!int.isCommand()) {
      return;
    }
    const { commandName } = int;
    if (commandName === "ranking") {
      const results = await getRanking(db);

      let msg = `# Ranking 📈 da Resenha 🤪 (Oficial) 📜 :`;
      results.forEach((r, i) => {
        msg += `\n ${i + 1} - #${r.userId} - (${r.resenhaPoints})`;
      });

      await int.reply(msg);
    }
  });
}

async function getRanking(db: DB): Promise<Score[]> {
  return await db.all<Score[]>(
    "SELECT * from resenha ORDER BY resenhaPoints DESC"
  );
}

interface SelectType {
  resenhaPoints: number;
}

async function addScore(uid: string, db: DB) {
  const result = await db.get<SelectType>(
    `SELECT resenhaPoints FROM resenha WHERE userId = ?`,
    uid
  );

  if (!result) {
    await db.run("INSERT INTO resenha VALUES(?, ?)", uid, 1);
    return;
  }

  await db.get(
    "UPDATE resenha SET resenhaPoints = ? WHERE userId = ?;",
    result.resenhaPoints + 1,
    uid
  );
}

main().catch((e) => {
  console.error("Houve um erro na aplicação: \n" + e);
});
