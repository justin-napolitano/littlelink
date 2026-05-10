import GardenIndex from '../design-templates/garden-index/index.astro';
import InternetFoyerIndex from '../design-templates/internet-foyer-index/index.astro';
import LinkIndexMobileFirst from '../design-templates/link-index-mobile-first/index.astro';
import ProofIndex from '../design-templates/proof-index/index.astro';
import QuietIndex from '../design-templates/quiet-index/index.astro';
import { type DesignTemplateId, designTemplateIds } from './design-template-ids';

export const designTemplates = {
  'link-index-mobile-first': LinkIndexMobileFirst,
  'quiet-index': QuietIndex,
  'garden-index': GardenIndex,
  'proof-index': ProofIndex,
  'internet-foyer-index': InternetFoyerIndex,
} satisfies Record<DesignTemplateId, unknown>;

export const getDesignTemplate = (templateId: string) =>
  designTemplates[templateId as DesignTemplateId] ?? null;

export { designTemplateIds };
