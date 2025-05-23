import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
  AttachmentBuilder,
} from "discord.js";
import DatabaseConnection from "../db";
import fs from "fs";
import path from "path";

const img_dir = process.env.IMAGES_DIRECTORY;

export default {
  data: new SlashCommandBuilder()
    .setName("ranking")
    .setDescription("Exibe o placar da resenha."),

  async execute(int: ChatInputCommandInteraction, db: DatabaseConnection) {
    const results = await db.getRanking(int.guildId);
    let mensagens: Ranking[] = [];

    results.forEach((r, i) => {
      mensagens.push({
        userId: r.userId,
        points: r.netPoints,
      });
    });

    const { embed, file } = await getEmbedRanking(mensagens);
    await int.reply({ embeds: [embed], files: [file] });
  },
};

type Ranking = { userId: string; points: number };

function getRankingEmoji(index: number) {
  switch (index) {
    case 0:
      return "🥇";
    case 1:
      return "🥈";
    case 2:
      return "🥉";
    default:
      return `${index + 1}`;
  }
}

async function getEmbedRanking(
  ranks: Ranking[]
): Promise<{ embed: EmbedBuilder; file: AttachmentBuilder }> {
  const { file, url } = await getLocalRandomImg();

  const rankDescriptions = ranks.map((rank, index) => {
    let placeEmoji = getRankingEmoji(index);
    return `• ${placeEmoji} <@${rank.userId}> \`${rank.points} RP\``;
  });

  const embed = new EmbedBuilder()
    .setTitle(
      "Ranking 📈 da Resenha 🤪 (Oficial) 2025 - A Resenha Agora É Outra!! 📜"
    )
    .setDescription(rankDescriptions.join("\n"))
    .setColor("#ff7800")
    .setImage(url)
    .setTimestamp();

  return { embed, file };
}

async function getLocalRandomImg(): Promise<{
  file: AttachmentBuilder;
  url: string;
}> {
  if (!fs.existsSync(img_dir)) {
    console.error(`Pasta de imagens não encontrada: ${img_dir}`);
    throw new Error("Pasta de imagens não encontrada.");
  }

  const files = fs
    .readdirSync(img_dir)
    .filter((file) => /\.(png|jpg)$/i.test(file));

  if (files.length === 0) {
    throw new Error("Nenhuma imagem encontrada na pasta.");
  }

  const randomFile = files[Math.floor(Math.random() * files.length)];
  const filePath = path.join(img_dir, randomFile);

  const file = new AttachmentBuilder(filePath);
  const url = `attachment://${randomFile}`;

  return { file, url };
}
