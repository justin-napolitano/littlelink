import LinkIndexMobileFirst from '../design-templates/link-index-mobile-first/index.astro';
import { type DesignTemplateId, designTemplateIds } from './design-template-ids';

export const designTemplates = {
  'link-index-mobile-first': LinkIndexMobileFirst,
} satisfies Record<DesignTemplateId, unknown>;

export const getDesignTemplate = (templateId: string) =>
  designTemplates[templateId as DesignTemplateId] ?? null;

export { designTemplateIds };
