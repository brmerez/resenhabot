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
          name: `${rank.header} - ${rank.points} RP`,
          value: " ",
          inline: false,
        };
      })
    )
    .setColor("#ff7800")
    .setImage(getRandomBritto(brittos))
    .setTimestamp();
}

function getRandomBritto(images: string[]): string {
  const randomIndex = Math.floor(Math.random() * images.length);
  return images[randomIndex];
}

const brittos = [
  "https://midias.correiobraziliense.com.br/_midias/jpg/2024/08/26/675x450/1_whatsapp_image_2024_08_26_at_08_36_06-39609702.jpeg?20240826084744?20240826084744",
  "https://img.band.uol.com.br/image/2024/11/06/davi-britto-desiste-de-cursar-medicina-111848.jpg",
  "https://noticiasdatv.uol.com.br/media/_versions/bio/bbb24-perfil-davi--foto-globo_fixed_big.jpg",
  "https://s2-oglobo.glbimg.com/-4EtGBZE6vUNYGUKVnnlCxWXvmY=/0x0:1405x972/888x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_da025474c0c44edd99332dddb09cabe8/internal_photos/bs/2024/n/m/9YthdCQVOiJ0dEcVNo5w/106722800-documentario-vencedor-do-bbb-24-davi.-1-.jpg",
  "https://static.ndmais.com.br/2024/08/davi-brito.jpeg",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgKzQjSlhLy8AgFo5KRg-33-lFuMjA7UNd_w&s",
  "https://cdn.oantagonista.com/uploads/2025/03/Davi-Brito-1024x576.png",
  "https://ofuxico.com.br/wp-content/uploads/2024/04/Davi.jpg",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAAn87-O7bCcxV6-0J0xbVw6QsqNqXoae0ew&s",
];
