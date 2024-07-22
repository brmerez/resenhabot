import {
  ChatInputCommandInteraction,
  MessageContextMenuCommandInteraction,
  SlashCommandBuilder,
  UserContextMenuCommandInteraction,
} from "discord.js";
import { DB } from "./db";

export default interface Command {
  data: SlashCommandBuilder;
  execute: (
    interaction:
      | ChatInputCommandInteraction
      | MessageContextMenuCommandInteraction
      | UserContextMenuCommandInteraction,
    db: DB,
    ...args: any[]
  ) => Promise<void>;
}
