import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
  AttachmentBuilder,
} from "discord.js";
import fs from "fs";
import path from "path";

const img_dir = process.env.IMAGES_DIRECTORY;

async function getLocalRandomImg(): Promise<{
  file: AttachmentBuilder;
  url: string;
}> {
  if (!img_dir || !fs.existsSync(img_dir)) {
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

export default {
  data: new SlashCommandBuilder()
    .setName("image")
    .setDescription("Envia uma imagem aleatória da resenha"),

  async execute(int: ChatInputCommandInteraction) {
    try {
      const { file, url } = await getLocalRandomImg();
      const embed = new EmbedBuilder().setImage(url).setColor("#ff7800");
      await int.reply({ embeds: [embed], files: [file] });
    } catch (e) {
      console.error(`Houve um erro ao pegar imagem aleatória: ${e}`);
    }
  },
};
