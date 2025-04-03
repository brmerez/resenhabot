import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import DatabaseConnection from "../db";

export default {
  data: new SlashCommandBuilder()
    .setName("ranking")
    .setDescription("Mostra o ranking da resenha."),

  async execute(int: ChatInputCommandInteraction, db: DatabaseConnection) {
    const results = await db.getRanking(int.guildId);
    const ids = results.map((r) => r.userId);
    const users = await int.guild.members.fetch({ user: ids });
    let mensagens: Ranking[] = [];

    results.forEach((r, i) => {
      const user = users.get(r.userId).user;
      // msg += `\n ${i + 1} - ${user.displayName}, ${r.resenhaPoints} RP`;
      mensagens.push({
        header: `${i + 1} - ${user.displayName} ${i == 0 ? "👑" : ""}`,
        points: r.netPoints,
      });
    });

    const embed = getEmbedRanking(mensagens);
    await int.reply({ embeds: [embed] });
  },
};

type Ranking = { header: string; points: number };

function getEmbedRanking(ranks: Ranking[]): EmbedBuilder {
  return new EmbedBuilder()
    .setAuthor({
      name: "ResenhaBot",
    })
    .setTitle(
      "Ranking 📈 da Resenha 🤪 (Oficial) 2025 - A Resenha Agora É Outra!! 📜"
    )
    .setDescription("Temporada 2025 da Resenha!!!!1")
    .addFields(
      ranks.map((rank) => {
        return {
          name: rank.header,
          value: rank.points + " RP",
          inline: false,
        };
      })
    )
    .setColor("#ff7800")
    .setTimestamp();
}
