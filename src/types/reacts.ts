export type EmojiHandler = {
  react: string;
  action: (
    authorId: string,
    guildId: string,
    messageId: string,
    count: number
  ) => Promise<void>;
};
