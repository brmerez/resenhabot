import { Events } from "discord.js";
import dotEnv from "dotenv";
import { addScore, setupDB } from "./db";
import { getCommands } from "./commands";
import setupClient from "./client";

async function main() {
  dotEnv.config();
  const db = await setupDB();
  const commands = getCommands();
  const client = await setupClient();

  client.on(Events.MessageReactionAdd, async (reaction, user) => {
    if (reaction.partial) {
      try {
        await reaction.fetch();
      } catch (e) {
        console.error("Erro ao fazer fetch da mensagem", e);
      }
    }

    if (reaction.emoji.name === "🤣") {
      await addScore(user.id, reaction.message.guildId, db);
      await reaction.message.react("🔥");
    }
  });

  client.on(Events.InteractionCreate, async (int) => {
    if (!int.isCommand()) {
      return;
    }

    if (commands.has(int.commandName)) {
      await commands.get(int.commandName)?.execute(int, db);
    }
  });

  process.on("SIGINT", async (s) => {
    console.log("\nClosing db connection...");
    await db.close();
    process.exit();
  });
}

main().catch((e) => {
  console.error("Houve um erro na aplicação: \n" + e);
});
