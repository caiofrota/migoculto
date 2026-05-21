declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string;
    SMTP_HOST;
    SMTP_PORT;
    SMTP_USER;
    SMTP_PASS;
    SMTP_MAIL_TO;
    NEXT_PUBLIC_BASE_URL: string;
    SESSION_SECRET: string;
    ACCESS_TOKEN_EXPIRES_IN: string;
    REFRESH_TOKEN_EXPIRES_IN: string;
  }
}
