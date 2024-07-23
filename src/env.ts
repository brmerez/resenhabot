import dotEnv from "dotenv";

export default function setupEnv(): boolean {
  try {
    const isProd = process.env.NODE_ENV === "production";
    dotEnv.config({
      path: isProd ? "./env" : "./.env.dev",
    });

    console.debug("Iniciando bot em ambiente de " + process.env.NODE_ENV);
    return isProd;
  } catch (e) {
    console.error("Houve um erro ao recuperar variáveis de ambiente: ", e);
  }
}
