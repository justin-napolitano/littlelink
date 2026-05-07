export const designTemplateIds = [
  'link-index-mobile-first',
  'quiet-index',
  'garden-index',
  'proof-index',
] as const;

export type DesignTemplateId = (typeof designTemplateIds)[number];
