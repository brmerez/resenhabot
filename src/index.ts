import { Events } from "discord.js";
import { getCommands } from "./commands";
import DatabaseConnection from "./db";
import CustomClient from "./client";
import setupEnv from "./env";

async function main() {
  const isProd = setupEnv();
  const db = await DatabaseConnection.new();
  const commands = getCommands();
  const client = await CustomClient.new();
  const MINIMUM_REACTIONS = isProd ? 3 : 1;

  client.on(Events.MessageReactionAdd, async (reaction, user) => {
    if (reaction.partial) {
      try {
        await reaction.fetch();
      } catch (e) {
        console.error("Erro ao fazer fetch da reação", e);
        return;
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
      await db.addScore(author.id, message.guildId, message.id, count);
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
      await db.decrementScore(author.id, message.guildId, message.id);
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
