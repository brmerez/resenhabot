import { REST, Routes } from "discord.js";
import RankingCommand from "./ranking";
import Command from "../types/command";

export default async function registerCommands(): Promise<void> {
  const token = process.env.DISCORD_TOKEN;
  const clientId = process.env.CLIENT_ID;

  if (!token || !clientId) {
    console.error("Erro ao recuperar variáveis de ambiente.");
    return;
  }

  const commandsMap = getCommands();
  const commands = Array.from(commandsMap.values()).map((cmd) => ({
    name: cmd.data.name,
    description: cmd.data.description,
  }));

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
  return commands;
}
