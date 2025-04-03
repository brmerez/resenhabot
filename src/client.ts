import { Client, Events, GatewayIntentBits, Partials } from "discord.js";
import registerCommands from "./commands";

export default class CustomClient extends Client {
  private constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
      ],
      partials: [Partials.Message, Partials.Channel, Partials.Reaction],
    });
  }

  static async new(): Promise<CustomClient> {
    const client = new CustomClient();

    client.once(Events.ClientReady, async (readyClient) => {
      await registerCommands();
      console.log("Bora bill!!!");
    });

    try {
      await client.login(process.env.DISCORD_TOKEN);
    } catch (e) {
      console.error("Houve um erro ao fazer login: ", e);
      throw e;
    }

    return client;
  }
}
