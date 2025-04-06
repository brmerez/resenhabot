import DatabaseConnection from "../db";

export type ActionArgs = {
  authorId: string;
  guildId: string;
  messageId: string;
  count: number;
};

export type EmojiHandler = {
  react: string;
  action: (args: ActionArgs, db: DatabaseConnection) => Promise<void>;
};
