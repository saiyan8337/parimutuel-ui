declare global {
  namespace NodeJS {
    interface ProcessEnv {
      AUTHORITY_KEY_PAIR: string;
    }
  }
}
