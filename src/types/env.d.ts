declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DISCORD_TOKEN: string;
      CLIENT_ID: string;
      NODE_ENV: "production" | "development";
    }
  }
}

export {};
