import { Events } from "discord.js";
import { getCommands } from "./commands";
import DatabaseConnection from "./db";
import CustomClient from "./client";
import setupEnv from "./env";
import { EmojiHandler } from "./types/reacts";

async function main() {
  const isProd = setupEnv();
  const db = await DatabaseConnection.new();
  const commands = getCommands();
  const client = await CustomClient.new();
  const MINIMUM_REACTIONS = isProd ? 3 : 1;

  const emojiMap = new Map<string, EmojiHandler>();
  emojiMap.set("🤣", { react: "🔥", action: db.addScore });
  emojiMap.set("🙁", { react: "😣", action: db.decrementScore });

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
    const { author, id: messageId, guildId } = message;

    if (author.bot) {
      return;
    }

    if (count < MINIMUM_REACTIONS) {
      return;
    }

    const match = emojiMap.get(emoji.name);

    if (!match) return;

    await match.action(author.id, guildId, messageId, count);
    await message.react(match.react);
  });

  client.on(Events.InteractionCreate, async (int) => {
    if (!int.isCommand()) {
      return;
    }

    if (!commands.has(int.commandName)) {
      return;
    }

    await commands.get(int.commandName)?.execute(int, db);
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
