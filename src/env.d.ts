/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly SMTP_HOST?: string;
  readonly SMTP_PORT?: string;
  readonly SMTP_SECURE?: string;
  readonly SMTP_USER?: string;
  readonly SMTP_PASSWORD?: string;
  readonly SUBSCRIPTION_FROM_EMAIL?: string;
  readonly SUBSCRIPTION_SITE_NAME?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
