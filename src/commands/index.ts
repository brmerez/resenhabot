import { REST, Routes } from "discord.js";
import RankingCommand from "./ranking";
import ImageCommand from "./image";
import Command from "../types/command";

export default async function registerCommands(): Promise<void> {
  const token = process.env.DISCORD_TOKEN;
  const clientId = process.env.CLIENT_ID;
  const img_dir = process.env.IMAGES_DIRECTORY;

  if (!token || !clientId || !img_dir) {
    console.error("Erro ao recuperar variáveis de ambiente.");
    return;
  }

  const commandsMap = getCommands();
  const commands = Array.from(commandsMap.values()).map((cmd) => cmd.data.toJSON());

  try {
    const rest = new REST().setToken(token);
    await rest.put(Routes.applicationCommands(clientId), {
      body: commands,
    });

    console.log(`Registrados ${commands.length} comandos com sucesso.`);
  } catch (e) {
    console.error("Houve um erro ao registrar comandos: ", e);
  }
}

export function getCommands(): Map<string, Command> {
  const commands = new Map<string, Command>();
  commands.set(RankingCommand.data.name, RankingCommand);
  commands.set(ImageCommand.data.name, ImageCommand);
  return commands;
}
