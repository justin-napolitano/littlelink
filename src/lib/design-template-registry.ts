import LinkIndexMobileFirst from '../design-templates/link-index-mobile-first/index.astro';

export const designTemplates = {
  'link-index-mobile-first': LinkIndexMobileFirst,
};

export type DesignTemplateId = keyof typeof designTemplates;

export const designTemplateIds = Object.keys(designTemplates) as DesignTemplateId[];

export const getDesignTemplate = (templateId: string) =>
  designTemplates[templateId as DesignTemplateId] ?? null;
