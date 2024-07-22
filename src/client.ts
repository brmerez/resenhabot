import { Client, Events, GatewayIntentBits, Partials } from "discord.js";
import registerCommands from "./commands";

export default async function setupClient() {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMessageReactions,
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction],
  });

  client.once(Events.ClientReady, async (readyClient) => {
    await registerCommands();
    console.log("Bora bill!!!");
  });

  try {
    await client.login(process.env.DISCORD_TOKEN);
  } catch (e) {
    console.error("Houve um erro ao fazer login: ", e);
    return;
  }

  return client;
}
