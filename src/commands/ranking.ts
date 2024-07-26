import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { getRanking } from "../db";
import { DB, Score } from "../types/db";

export default {
  data: new SlashCommandBuilder()
    .setName("ranking")
    .setDescription("Mostra o ranking da resenha."),

  async execute(int: ChatInputCommandInteraction, db: DB) {
    const results = await getRanking(db, int.guildId);
    const ids = results.map((r) => r.userId);
    const users = await int.guild.members.fetch({ user: ids });

    let msg = `## Ranking 📈 da Resenha 🤪 (Oficial) 📜 :\n\n`;
    results.forEach((r, i) => {
      const user = users.get(r.userId).user;
      msg += `\n ${i + 1} - ${user.displayName}, ${r.resenhaPoints} RP`;
    });
    await int.reply(msg);
  },
};
