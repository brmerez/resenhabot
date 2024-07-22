import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { getRanking } from "../db";
import { DB } from "../types/db";

export default {
  data: new SlashCommandBuilder()
    .setName("ranking")
    .setDescription("Mostra o ranking da resenha."),

  async execute(int: ChatInputCommandInteraction, db: DB) {
    const results = await getRanking(db, int.guildId);

    let msg = `## Ranking 📈 da Resenha 🤪 (Oficial) 📜 :\n\n`;
    results.forEach((r, i) => {
      msg += `\n ${i + 1} - <@${r.userId}> - (${r.resenhaPoints})`;
    });
    await int.reply(msg);
  },
};
