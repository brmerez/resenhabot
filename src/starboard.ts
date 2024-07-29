import { Client, EmbedBuilder, Guild, Message } from "discord.js";
import CustomClient from "./client";
import DatabaseConnection from "./db";

export default class ResenhaBoard {
  private guild: Guild;
  private db: DatabaseConnection;

  constructor(guild: Guild, db: DatabaseConnection) {
    this.guild = guild;
    this.db = db;
  }

  static async new(
    guildId: string,
    client: CustomClient,
    db: DatabaseConnection
  ): Promise<ResenhaBoard> {
    const guild = await client.guilds.fetch(guildId);
    if (!guild) {
      throw new Error(`Erro ao fazer fetch do servidor com id '${guildId}'`);
    }

    return new ResenhaBoard(guild, db);
  }

  async getMessage(messageId: string): Promise<Message | null> {
    const channels = await this.guild.channels.fetch();

    let message = null;
    for (const ch in channels) {
      const _channel = channels.get(ch);
      const channel = await _channel.fetch();

      if (!channel.isTextBased()) continue;

      const match = await channel.messages.fetch(messageId);

      if (!match) continue;

      message = match;
    }

    return message;
  }

  getMessageEmbed(message: Message<true>) {
    const embed = new EmbedBuilder().addFields(
      { name: "Mensagem", value: message.content },
      { name: "Autor", value: message.author.displayName }
    );

    return embed;
  }
}
