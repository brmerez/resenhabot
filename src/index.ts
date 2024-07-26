import { Events } from "discord.js";
import { addScore, decrementScore, setupDB } from "./db";
import { getCommands } from "./commands";
import setupClient from "./client";
import setupEnv from "./env";

async function main() {
  const isProd = setupEnv();
  const db = await setupDB();
  const commands = getCommands();
  const client = await setupClient();
  const MINIMUM_REACTIONS = isProd ? 3 : 1;

  client.on(Events.MessageReactionAdd, async (reaction, user) => {
    if (reaction.partial) {
      try {
        await reaction.fetch();
      } catch (e) {
        console.error("Erro ao fazer fetch da reação", e);
      }
    }

    const { emoji, count, message } = reaction;
    const { author } = message;
    // const added = message.reactions.resolve("🔥");
    const removed = message.reactions.resolve("😣");

    if (emoji.name === "🤣" && count >= MINIMUM_REACTIONS && !author.bot) {
      console.log(
        `[Info]: ${author.displayName} (${author.id}) +1 Resenhapoint`
      );
      await addScore(author.id, message.guildId, message.id, count, db);
      await message.react("🔥");
    }

    if (emoji.name === "🙁" && count >= MINIMUM_REACTIONS && !author.bot) {
      if (removed) {
        console.log("Ja reagi nessa!!!");
        return;
      }

      console.log(
        `[Info]: ${author.displayName} (${author.id}) -1 Resenhapoint`
      );
      await decrementScore(author.id, message.guildId, message.id, db);
      await message.react("😣");
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
