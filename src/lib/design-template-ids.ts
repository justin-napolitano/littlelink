export const designTemplateIds = [
  'link-index-mobile-first',
  'quiet-index',
  'garden-index',
  'proof-index',
  'internet-foyer-index',
] as const;

export type DesignTemplateId = (typeof designTemplateIds)[number];
