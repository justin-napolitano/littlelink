/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly DIRECT_SIGNAL_URL?: string;
  readonly DIRECT_EMAIL_URL?: string;
  readonly DIRECT_STUDIO_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
