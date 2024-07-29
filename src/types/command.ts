import {
  ChatInputCommandInteraction,
  MessageContextMenuCommandInteraction,
  SlashCommandBuilder,
  UserContextMenuCommandInteraction,
} from "discord.js";
import { DB } from "./db";
import DatabaseConnection from "../db";

export default interface Command {
  data: SlashCommandBuilder;
  execute: (
    interaction:
      | ChatInputCommandInteraction
      | MessageContextMenuCommandInteraction
      | UserContextMenuCommandInteraction,
    db: DatabaseConnection,
    ...args: any[]
  ) => Promise<void>;
}
