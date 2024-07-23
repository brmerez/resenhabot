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
  const MINIMUM_REACTIONS = 3;

  client.on(Events.MessageReactionAdd, async (reaction, user) => {
    if (reaction.partial) {
      try {
        await reaction.fetch();
      } catch (e) {
        console.error("Erro ao fazer fetch da reação", e);
      }
    }

    const { emoji, count, message } = reaction;

    if (
      emoji.name === "🤣" &&
      count >= MINIMUM_REACTIONS &&
      !message.author.bot
    ) {
      console.log(
        `[Info]: ${message.author.displayName} (${message.author.id}) +1 Resenhapoint`
      );
      await addScore(message.author.id, message.guildId, message.id, db);
      await message.react("🔥");
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
